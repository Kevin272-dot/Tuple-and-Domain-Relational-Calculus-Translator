import {
  ASTNode,
  QueryNode,
  TranslationStep,
  TranslationResult,
} from './types';
import { tokenize } from './tokenizer';
import { Parser, ParseError } from './parser';

export function translateToSQL(input: string): TranslationResult {
  const steps: TranslationStep[] = [];
  let stepNum = 1;

  try {
    const tokens = tokenize(input.trim());
    const parser = new Parser(tokens);
    const ast = parser.parse();

    steps.push({
      step: stepNum++,
      description: 'Parse the input query into an Abstract Syntax Tree (AST)',
      inputFragment: input.trim(),
      outputFragment: formatAST(ast),
    });

    const { sql, steps: translationSteps } = generateSQL(ast, stepNum);
    steps.push(...translationSteps);

    steps.push({
      step: steps.length + 1,
      description: 'Final SQL query',
      inputFragment: formatAST(ast),
      outputFragment: sql,
    });

    return { success: true, sql, steps, ast };
  } catch (error) {
    if (error instanceof ParseError) {
      return {
        success: false, sql: '', steps, ast: null,
        error: `Parse error at line ${error.line}, column ${error.column}: ${error.message}`,
        errorPosition: error.position,
      };
    }
    return {
      success: false, sql: '', steps, ast: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

function generateSQL(
  node: ASTNode,
  startStep: number
): { sql: string; steps: TranslationStep[] } {
  const steps: TranslationStep[] = [];
  let stepNum = startStep;

  function findMainRelation(n: ASTNode, tupleVar: string): string {
    // First try to find explicit "T in Students" pattern
    const explicit = findExplicitRelation(n, tupleVar);
    if (explicit) return explicit;

    // Fallback: collect all relations and use the first one not used by quantifiers
    const allRelations = collectAllRelations(n);
    const quantifierRelations = collectQuantifierRelations(n);
    for (const r of allRelations) {
      if (!quantifierRelations.has(r)) return r;
    }
    return allRelations[0] || '';
  }

  function findExplicitRelation(n: ASTNode, tupleVar: string): string {
    if (n.type === 'Relation') {
      const vars = n.variable.split(',');
      if (vars.includes(tupleVar)) return n.relation;
    }
    if (n.type === 'BinaryOp') {
      const l = findExplicitRelation(n.left, tupleVar);
      return l || findExplicitRelation(n.right, tupleVar);
    }
    if (n.type === 'UnaryOp') return findExplicitRelation(n.operand, tupleVar);
    if (n.type === 'Quantifier') return '';
    if (n.type === 'Comparison') {
      const l = findExplicitRelation(n.left, tupleVar);
      return l || findExplicitRelation(n.right, tupleVar);
    }
    if (n.type === 'Implication') {
      const l = findExplicitRelation(n.left, tupleVar);
      return l || findExplicitRelation(n.right, tupleVar);
    }
    return '';
  }

  function collectAllRelations(n: ASTNode): string[] {
    const relations: string[] = [];
    function walk(node: ASTNode) {
      if (node.type === 'Relation') {
        const rels = node.variable.includes(',') ? [node.relation] : [node.relation];
        for (const r of rels) if (!relations.includes(r)) relations.push(r);
      }
      if (node.type === 'BinaryOp') { walk(node.left); walk(node.right); }
      if (node.type === 'UnaryOp') walk(node.operand);
      if (node.type === 'Quantifier') walk(node.expression);
      if (node.type === 'Comparison') { walk(node.left); walk(node.right); }
      if (node.type === 'Implication') { walk(node.left); walk(node.right); }
    }
    walk(n);
    return relations;
  }

  function collectQuantifierRelations(n: ASTNode): Set<string> {
    const relations = new Set<string>();
    function walk(node: ASTNode) {
      if (node.type === 'Quantifier') {
        const rels = collectAllRelations(node.expression);
        for (const r of rels) relations.add(r);
      }
      if (node.type === 'BinaryOp') { walk(node.left); walk(node.right); }
      if (node.type === 'UnaryOp') walk(node.operand);
      if (node.type === 'Comparison') { walk(node.left); walk(node.right); }
      if (node.type === 'Implication') { walk(node.left); walk(node.right); }
    }
    walk(n);
    return relations;
  }

  function findMainRelationDRC(n: ASTNode): string {
    if (n.type === 'Relation') return n.relation;
    if (n.type === 'BinaryOp') {
      const l = findMainRelationDRC(n.left);
      return l || findMainRelationDRC(n.right);
    }
    if (n.type === 'UnaryOp') return findMainRelationDRC(n.operand);
    if (n.type === 'Quantifier') return findMainRelationDRC(n.expression);
    if (n.type === 'Comparison') {
      const l = findMainRelationDRC(n.left);
      return l || findMainRelationDRC(n.right);
    }
    if (n.type === 'Implication') {
      const l = findMainRelationDRC(n.left);
      return l || findMainRelationDRC(n.right);
    }
    return 'dual';
  }

  function findQuantifierRelation(n: ASTNode, qvar: string): string {
    // For quantifiers, we want the relation the quantifier variable belongs to
    // e.g., "exists E(E in Enrollment ...)" -> the relation is Enrollment
    if (n.type === 'Relation') {
      const vars = n.variable.split(',');
      // If this relation's variables include the quantifier variable, it IS the relation we want
      if (vars.includes(qvar)) return n.relation;
    }
    if (n.type === 'BinaryOp') {
      const l = findQuantifierRelation(n.left, qvar);
      return l || findQuantifierRelation(n.right, qvar);
    }
    if (n.type === 'UnaryOp') return findQuantifierRelation(n.operand, qvar);
    if (n.type === 'Quantifier') return findQuantifierRelation(n.expression, qvar);
    if (n.type === 'Comparison') {
      const l = findQuantifierRelation(n.left, qvar);
      return l || findQuantifierRelation(n.right, qvar);
    }
    if (n.type === 'Implication') {
      const l = findQuantifierRelation(n.left, qvar);
      return l || findQuantifierRelation(n.right, qvar);
    }
    return '';
  }

  function translate(n: ASTNode, inQuantifierWhere = false): string {
    switch (n.type) {
      case 'Query':
        return translateQuery(n);
      case 'BinaryOp':
        return `(${translate(n.left, inQuantifierWhere)} ${n.operator === 'AND' ? 'AND' : 'OR'} ${translate(n.right, inQuantifierWhere)})`;
      case 'UnaryOp':
        return `NOT (${translate(n.operand, inQuantifierWhere)})`;
      case 'Quantifier':
        return translateQuantifier(n);
      case 'Comparison':
        return `${translate(n.left, inQuantifierWhere)} ${n.operator} ${translate(n.right, inQuantifierWhere)}`;
      case 'Attribute':
        return `${n.variable}.${n.attribute}`;
      case 'Variable':
        return n.name;
      case 'Literal':
        return typeof n.value === 'string' ? `'${n.value}'` : String(n.value);
      case 'Relation':
        // Inside a quantifier WHERE clause, skip Relation nodes (they go to FROM)
        if (inQuantifierWhere) return '';
        return `${n.variable} IN ${n.relation}`;
      case 'Implication': {
        const l = translate(n.left, inQuantifierWhere);
        const r = translate(n.right, inQuantifierWhere);
        return `(NOT (${l}) OR (${r}))`;
      }
      default:
        return '';
    }
  }

  function translateQuery(q: QueryNode): string {
    const isTRC = q.calculusType === 'TRC';

    if (isTRC) {
      const tupleVar = q.tupleOrDomain.type === 'TupleVariable' ? q.tupleOrDomain : null;
      const selectAttrs = tupleVar?.attributes
        ? tupleVar.attributes.map((a) => `${tupleVar.name}.${a}`).join(', ')
        : '*';
      const tv = tupleVar?.name || 'T';
      const mainRelation = findMainRelation(q.condition, tv);
      const whereClause = buildWhere(q.condition, tv);

      steps.push({
        step: stepNum++,
        description: 'Identify the main relation from the "in" clause',
        inputFragment: `${tv} in ${mainRelation}`,
        outputFragment: `FROM ${mainRelation}`,
      });

      steps.push({
        step: stepNum++,
        description: selectAttrs !== '*' ? 'Identify projected attributes' : 'Select all columns',
        inputFragment: selectAttrs,
        outputFragment: `SELECT ${selectAttrs}`,
      });

      if (whereClause) {
        steps.push({
          step: stepNum++,
          description: 'Build the WHERE clause from remaining conditions',
          inputFragment: formatAST(q.condition),
          outputFragment: `WHERE ${whereClause}`,
        });
      }

      const parts = [`SELECT ${selectAttrs}`, `FROM ${mainRelation}`];
      if (whereClause) parts.push(`WHERE ${whereClause}`);
      return parts.join('\n') + ';';
    }

    const domainVars = q.tupleOrDomain.type === 'DomainVariable' ? q.tupleOrDomain.variables : [];
    const selectClause = domainVars.length > 0 ? domainVars.join(', ') : '*';
    const mainRelation = findMainRelationDRC(q.condition);
    const whereClause = buildWhereDRC(q.condition);

    steps.push({
      step: stepNum++,
      description: 'Identify the main relation',
      inputFragment: 'relation membership',
      outputFragment: `FROM ${mainRelation}`,
    });

    steps.push({
      step: stepNum++,
      description: 'Identify projected domain variables',
      inputFragment: `<${domainVars.join(', ')}>`,
      outputFragment: `SELECT ${selectClause}`,
    });

    if (whereClause) {
      steps.push({
        step: stepNum++,
        description: 'Build the WHERE clause',
        inputFragment: formatAST(q.condition),
        outputFragment: `WHERE ${whereClause}`,
      });
    }

    const parts = [`SELECT ${selectClause}`, `FROM ${mainRelation}`];
    if (whereClause) parts.push(`WHERE ${whereClause}`);
    return parts.join('\n') + ';';
  }

  function stripRelationNodes(n: ASTNode): ASTNode | null {
    if (n.type === 'Relation') return null;
    if (n.type === 'BinaryOp') {
      const l = stripRelationNodes(n.left);
      const r = stripRelationNodes(n.right);
      if (!l) return r;
      if (!r) return l;
      return { type: 'BinaryOp', operator: n.operator, left: l, right: r };
    }
    if (n.type === 'UnaryOp') {
      const inner = stripRelationNodes(n.operand);
      return inner ? { type: 'UnaryOp', operator: n.operator, operand: inner } : null;
    }
    if (n.type === 'Quantifier') {
      const inner = stripRelationNodes(n.expression);
      return inner ? { type: 'Quantifier', operator: n.operator, variable: n.variable, expression: inner } : null;
    }
    if (n.type === 'Comparison') {
      return { type: 'Comparison', operator: n.operator, left: n.left, right: n.right };
    }
    if (n.type === 'Implication') {
      const l = stripRelationNodes(n.left);
      const r = stripRelationNodes(n.right);
      // A implies B becomes NOT A OR B; if A is stripped (was just a relation), the implication is always true
      if (!l) return r;
      if (!r) return { type: 'UnaryOp', operator: 'NOT', operand: l };
      return { type: 'Implication', operator: 'IMPLIES', left: l, right: r };
    }
    return n;
  }

  function translateQuantifier(node: { operator: string; variable: string; expression: ASTNode }): string {
    const stripped = stripRelationNodes(node.expression);
    const inner = stripped ? translate(stripped, false) : '1=1';
    const rel = findQuantifierRelation(node.expression, node.variable);

    if (node.operator === 'EXISTS') {
      steps.push({
        step: stepNum++,
        description: `Translate existential quantifier (exists ${node.variable}) to EXISTS subquery`,
        inputFragment: `exists ${node.variable}(...)`,
        outputFragment: `EXISTS (SELECT * FROM ${rel} WHERE ...)`,
      });
      return `EXISTS (SELECT * FROM ${rel} WHERE ${inner})`;
    }
    steps.push({
      step: stepNum++,
      description: `Translate universal quantifier (forall ${node.variable}) to NOT EXISTS`,
      inputFragment: `forall ${node.variable}(...)`,
      outputFragment: `NOT EXISTS (SELECT * FROM ${rel} WHERE NOT (...))`,
    });
    return `NOT EXISTS (SELECT * FROM ${rel} WHERE NOT (${inner}))`;
  }

  function buildWhere(n: ASTNode, tv: string): string {
    if (n.type === 'BinaryOp') {
      const l = buildWhere(n.left, tv);
      const r = buildWhere(n.right, tv);
      const op = n.operator === 'AND' ? 'AND' : 'OR';
      if (l && r) return `(${l} ${op} ${r})`;
      return l || r || '';
    }
    if (n.type === 'UnaryOp') {
      const inner = buildWhere(n.operand, tv);
      return inner ? `NOT (${inner})` : '';
    }
    if (n.type === 'Comparison') {
      const left = n.left.type === 'Attribute' ? `${n.left.variable}.${n.left.attribute}` : exprToStr(n.left);
      const right = exprToStr(n.right);
      return `${left} ${n.operator} ${right}`;
    }
    if (n.type === 'Quantifier') return translate(n);
    // Relation nodes that reference the tuple variable go to FROM, not WHERE
    // Relation nodes that reference quantifier variables also go to subquery FROM
    if (n.type === 'Relation') return '';
    if (n.type === 'Implication') return translate(n);
    return '';
  }

  function buildWhereDRC(n: ASTNode): string {
    if (n.type === 'BinaryOp') {
      const l = buildWhereDRC(n.left);
      const r = buildWhereDRC(n.right);
      const op = n.operator === 'AND' ? 'AND' : 'OR';
      if (l && r) return `(${l} ${op} ${r})`;
      return l || r || '';
    }
    if (n.type === 'UnaryOp') {
      const inner = buildWhereDRC(n.operand);
      return inner ? `NOT (${inner})` : '';
    }
    if (n.type === 'Comparison') {
      return `${exprToStr(n.left)} ${n.operator} ${exprToStr(n.right)}`;
    }
    if (n.type === 'Quantifier') return translate(n);
    if (n.type === 'Relation') return '';
    if (n.type === 'Implication') return translate(n);
    return '';
  }

  function exprToStr(n: ASTNode): string {
    if (n.type === 'Attribute') return `${n.variable}.${n.attribute}`;
    if (n.type === 'Variable') return n.name;
    if (n.type === 'Literal') return typeof n.value === 'string' ? `'${n.value}'` : String(n.value);
    if (n.type === 'Comparison') return `${exprToStr(n.left)} ${n.operator} ${exprToStr(n.right)}`;
    if (n.type === 'BinaryOp') {
      const l = exprToStr(n.left);
      const r = exprToStr(n.right);
      return `(${l} ${n.operator === 'AND' ? 'AND' : 'OR'} ${r})`;
    }
    if (n.type === 'UnaryOp') return `NOT (${exprToStr(n.operand)})`;
    if (n.type === 'Relation') return `${n.variable} IN ${n.relation}`;
    return translate(n);
  }

  const sql = translate(node);
  return { sql, steps };
}

function formatAST(node: ASTNode): string {
  switch (node.type) {
    case 'Query':
      return `{ ${node.variables.join('.')} | ${formatAST(node.condition)} }`;
    case 'BinaryOp': {
      const sym = node.operator === 'AND' ? ' AND ' : ' OR ';
      return `${formatAST(node.left)}${sym}${formatAST(node.right)}`;
    }
    case 'UnaryOp':
      return `NOT (${formatAST(node.operand)})`;
    case 'Quantifier':
      return `${node.operator === 'FORALL' ? 'forall' : 'exists'} ${node.variable}(${formatAST(node.expression)})`;
    case 'Comparison':
      return `${formatAST(node.left)} ${node.operator} ${formatAST(node.right)}`;
    case 'Attribute':
      return `${node.variable}.${node.attribute}`;
    case 'Variable':
      return node.name;
    case 'Literal':
      return typeof node.value === 'string' ? `'${node.value}'` : String(node.value);
    case 'Relation':
      return `${node.variable} in ${node.relation}`;
    case 'Implication': {
      const sym = node.operator === 'IMPLIES' ? ' implies ' : ' iff ';
      return `${formatAST(node.left)}${sym}${formatAST(node.right)}`;
    }
    default:
      return '';
  }
}
