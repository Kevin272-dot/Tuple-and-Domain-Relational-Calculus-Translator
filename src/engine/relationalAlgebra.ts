import { tokenize } from './tokenizer';
import { Parser } from './parser';
import { ASTNode, QueryNode, TupleVariable } from './types';
import { drcToTrc } from './trcDrcConverter';
import { SAMPLE_DATABASE_SCHEMA } from './constants';

export interface RAResult {
  success: boolean;
  ra: string;
  notes: string[];
  error?: string;
}

const SCHEMA: Record<string, string[]> = {};
for (const [name, info] of Object.entries(SAMPLE_DATABASE_SCHEMA)) {
  SCHEMA[name] = [...info.columns];
}

const fail = (error: string): RAResult => ({ success: false, ra: '', notes: [], error });

function flattenAnd(n: ASTNode): ASTNode[] {
  if (n.type === 'BinaryOp' && n.operator === 'AND') {
    return [...flattenAnd(n.left), ...flattenAnd(n.right)];
  }
  return [n];
}

function toDisjuncts(n: ASTNode): ASTNode[] {
  if (n.type === 'BinaryOp' && n.operator === 'OR') {
    return [...toDisjuncts(n.left), ...toDisjuncts(n.right)];
  }
  return [n];
}

function containsQuantifier(n: ASTNode): boolean {
  if (n.type === 'Quantifier') return true;
  if (n.type === 'BinaryOp' || n.type === 'Implication') return containsQuantifier(n.left) || containsQuantifier(n.right);
  if (n.type === 'UnaryOp') return containsQuantifier(n.operand);
  if (n.type === 'Comparison') return containsQuantifier(n.left) || containsQuantifier(n.right);
  return false;
}

function referencedVars(n: ASTNode, out: Set<string> = new Set()): Set<string> {
  if (n.type === 'Attribute') out.add(n.variable);
  if (n.type === 'Variable') out.add(n.name);
  if (n.type === 'BinaryOp' || n.type === 'Implication') { referencedVars(n.left, out); referencedVars(n.right, out); }
  if (n.type === 'UnaryOp') referencedVars(n.operand, out);
  if (n.type === 'Quantifier') referencedVars(n.expression, out);
  if (n.type === 'Comparison') { referencedVars(n.left, out); referencedVars(n.right, out); }
  return out;
}

function referencedAttrsOf(n: ASTNode, tupleVar: string, out: Set<string> = new Set()): Set<string> {
  if (n.type === 'Attribute' && n.variable === tupleVar) out.add(n.attribute);
  if (n.type === 'BinaryOp' || n.type === 'Implication') { referencedAttrsOf(n.left, tupleVar, out); referencedAttrsOf(n.right, tupleVar, out); }
  if (n.type === 'UnaryOp') referencedAttrsOf(n.operand, tupleVar, out);
  if (n.type === 'Quantifier') referencedAttrsOf(n.expression, tupleVar, out);
  if (n.type === 'Comparison') { referencedAttrsOf(n.left, tupleVar, out); referencedAttrsOf(n.right, tupleVar, out); }
  return out;
}

const OP_SYMBOLS: Record<string, string> = {
  '=': '=', '!=': '≠', '<': '<', '>': '>', '<=': '≤', '>=': '≥',
  AND: '∧', OR: '∨',
};

function renderOperand(n: ASTNode, mainVar: string): string {
  if (n.type === 'Attribute') {
    return n.variable === mainVar ? n.attribute : `${n.variable}.${n.attribute}`;
  }
  if (n.type === 'Literal') return typeof n.value === 'string' ? `'${n.value}'` : String(n.value);
  if (n.type === 'Variable') return n.name;
  return '';
}

function renderPredicate(n: ASTNode, mainVar: string): string {
  switch (n.type) {
    case 'Comparison':
      return `${renderOperand(n.left, mainVar)} ${OP_SYMBOLS[n.operator] || n.operator} ${renderOperand(n.right, mainVar)}`;
    case 'BinaryOp':
      return `(${renderPredicate(n.left, mainVar)} ${OP_SYMBOLS[n.operator] || n.operator} ${renderPredicate(n.right, mainVar)})`;
    case 'UnaryOp':
      return `¬(${renderPredicate(n.operand, mainVar)})`;
    case 'Implication':
      return `(${renderPredicate(n.left, mainVar)} → ${renderPredicate(n.right, mainVar)})`;
    default:
      return '';
  }
}

export function generateRelationalAlgebra(input: string): RAResult {
  const notes: string[] = [];
  const addNote = (note: string) => {
    if (!notes.includes(note)) notes.push(note);
  };

  try {
    let text = input.trim();
    let ast = new Parser(tokenize(text)).parse();
    if (ast.calculusType === 'DRC') {
      const conv = drcToTrc(text);
      if (!conv.success) return fail(conv.error || 'Could not convert the DRC query to TRC for algebra generation.');
      text = conv.output;
      ast = new Parser(tokenize(text)).parse();
      addNote('The DRC query was first converted to TRC, then translated to relational algebra.');
    }

    const tv = ast.tupleOrDomain as TupleVariable;
    const mainVar = tv.name;

    const varRel = new Map<string, string>();
    (function collect(n: ASTNode): void {
      if (n.type === 'Relation') {
        const v = n.variable.split(',')[0].trim();
        if (!varRel.has(v)) varRel.set(v, n.relation);
      }
      if (n.type === 'BinaryOp' || n.type === 'Implication') { collect(n.left); collect(n.right); }
      if (n.type === 'UnaryOp') collect(n.operand);
      if (n.type === 'Quantifier') collect(n.expression);
      if (n.type === 'Comparison') { collect(n.left); collect(n.right); }
    })(ast.condition);

    const mainRel = varRel.get(mainVar) || varRel.values().next().value || 'R';

    const buildBranch = (branch: ASTNode): string => {
      const conjuncts = flattenAnd(branch);
      let current = mainRel;
      const sigmaParts: string[] = [];

      for (const conj of conjuncts) {
        let node = conj;
        let negated = false;
        if (node.type === 'UnaryOp' && node.operand.type === 'Quantifier') {
          negated = true;
          node = node.operand;
        }

        const isSimpleQuantifier =
          node.type === 'Quantifier' &&
          !containsQuantifier(node.expression);

        if (isSimpleQuantifier && (node as { operator: string }).operator === 'EXISTS') {
          const q = node as { type: 'Quantifier'; operator: 'EXISTS' | 'FORALL'; variable: string; expression: ASTNode };
          const rel2 = varRel.get(q.variable) || 'R2';
          const inner = q.expression;

          const joinParts: string[] = [];
          const eParts: string[] = [];
          const mainParts: string[] = [];

          for (const c of flattenAnd(inner)) {
            if (c.type === 'Relation') continue;
            const refs = referencedVars(c);
            const hasMain = refs.has(mainVar);
            const hasE = refs.has(q.variable);
            if (hasMain && hasE) joinParts.push(renderPredicate(c, mainVar));
            else if (hasE) eParts.push(renderPredicate(c, mainVar));
            else mainParts.push(renderPredicate(c, mainVar));
          }
          sigmaParts.push(...mainParts);

          const rel2Expr = eParts.length > 0 ? `σ_{${eParts.join(' ∧ ')}}(${rel2})` : rel2;
          const joinCond = joinParts.length > 0 ? joinParts.join(' ∧ ') : '';

          if (!negated) {
            current = joinCond
              ? `(${current} ⋈_{${joinCond}} ${rel2Expr})`
              : `(${current} ⋈ ${rel2Expr})`;
            addNote('∃ (exists) with a join condition is rendered as a theta-join (⋈).');
          } else {
            current = `(${current} ▷_{${joinCond || 'true'}} ${rel2Expr})`;
            addNote('¬∃ (not exists) is rendered as an anti-join (▷), the set-difference pattern.');
          }
        } else if (isSimpleQuantifier && (node as { operator: string }).operator === 'FORALL' && !negated) {
          const q = node as { type: 'Quantifier'; variable: string; expression: ASTNode };
          const rel2 = varRel.get(q.variable) || 'R2';
          const inner = q.expression;

          let preds: ASTNode[] = [];
          if (inner.type === 'Implication' && inner.left.type === 'Relation') {
            preds = [inner.right];
          } else {
            preds = flattenAnd(inner).filter((c) => c.type !== 'Relation');
          }

          const joinParts: string[] = [];
          const eParts: string[] = [];
          for (const p of preds) {
            const refs = referencedVars(p);
            if (refs.has(mainVar) && refs.has(q.variable)) joinParts.push(renderPredicate(p, mainVar));
            else if (refs.has(q.variable)) eParts.push(renderPredicate(p, mainVar));
          }

          if (joinParts.length === 0) {
            const eAttrSet = new Set<string>();
            for (const p of preds) referencedAttrsOf(p, q.variable, eAttrSet);
            const eAttrs = [...eAttrSet];
            const projExpr = eAttrs.length > 0
              ? `π_{${eAttrs.join(', ')}}(${eParts.length > 0 ? `σ_{${eParts.join(' ∧ ')}}(${rel2})` : rel2})`
              : rel2;
            current = `(${current} ÷ ${projExpr})`;
            addNote('∀ (forall) is rendered as division (÷) — ∀X(P → Q) ≡ ¬∃X(P ∧ ¬Q).');
          } else {
            current = `(${current} ▷_{¬(${[...joinParts, ...eParts].join(' ∧ ')})} ${rel2})`;
            addNote('A correlated ∀ (forall) is approximated as an anti-join over the negated condition.');
          }
        } else if (containsQuantifier(conj)) {
          addNote('A complex nested-quantifier pattern was rendered as a selection predicate for reference.');
          sigmaParts.push(`⟦${renderPredicate(conj, mainVar)}⟧`);
        } else {
          const rendered = renderPredicate(conj, mainVar);
          if (rendered) sigmaParts.push(rendered);
        }
      }

      let expr = sigmaParts.length > 0 ? `σ_{${sigmaParts.join(' ∧ ')}}(${current})` : current;
      if (tv.attributes && tv.attributes.length > 0) {
        expr = `π_{${tv.attributes.join(', ')}}(${expr})`;
      }
      return expr;
    };

    const disjuncts = toDisjuncts(ast.condition);
    if (disjuncts.length > 1) addNote('A top-level "or" is rendered as a union (∪) of the branches.');
    const ra = disjuncts.length > 1
      ? disjuncts.map(buildBranch).join(' ∪ ')
      : buildBranch(disjuncts[0]);

    return { success: true, ra, notes };
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Could not generate relational algebra.');
  }
}
