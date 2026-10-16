import { tokenize } from './tokenizer';
import { Parser, ParseError } from './parser';
import { ASTNode, QueryNode, TupleVariable, DomainVariable, RelationNode } from './types';
import { SAMPLE_DATABASE_SCHEMA } from './constants';

export interface ConversionStep {
  title: string;
  detail: string;
}

export interface ConversionResult {
  success: boolean;
  output: string;
  steps: ConversionStep[];
  error?: string;
}

const SCHEMA: Record<string, string[]> = {};
for (const [name, info] of Object.entries(SAMPLE_DATABASE_SCHEMA)) {
  SCHEMA[name] = [...info.columns];
}

const KNOWN_RELATIONS = Object.keys(SCHEMA).join(', ');

const fail = (error: string): ConversionResult => ({
  success: false, output: '', steps: [], error,
});

function collectRelationNodes(node: ASTNode, out: RelationNode[] = []): RelationNode[] {
  if (node.type === 'Relation') out.push(node);
  if (node.type === 'BinaryOp' || node.type === 'Implication') {
    collectRelationNodes(node.left, out);
    collectRelationNodes(node.right, out);
  }
  if (node.type === 'UnaryOp') collectRelationNodes(node.operand, out);
  if (node.type === 'Quantifier') collectRelationNodes(node.expression, out);
  if (node.type === 'Comparison') {
    collectRelationNodes(node.left, out);
    collectRelationNodes(node.right, out);
  }
  return out;
}

export function renderTrc(ast: QueryNode): string {
  const tv = ast.tupleOrDomain as TupleVariable;
  let head: string;
  if (tv.attributes && tv.attributes.length === 1) head = `${tv.name}.${tv.attributes[0]}`;
  else if (tv.attributes && tv.attributes.length > 1) head = `${tv.name}[${tv.attributes.join(', ')}]`;
  else head = tv.name;
  return `{${head} | ${renderNode(ast.condition)}}`;
}

export function renderDrc(ast: QueryNode): string {
  const dv = ast.tupleOrDomain as DomainVariable;
  return `{<${dv.variables.join(', ')}> | ${renderNode(ast.condition)}}`;
}

function renderNode(n: ASTNode): string {
  switch (n.type) {
    case 'BinaryOp':
      return `(${renderNode(n.left)} ${n.operator === 'AND' ? 'and' : 'or'} ${renderNode(n.right)})`;
    case 'UnaryOp':
      return `not (${renderNode(n.operand)})`;
    case 'Quantifier':
      return `${n.operator === 'EXISTS' ? 'exists' : 'forall'} ${n.variable}(${renderNode(n.expression)})`;
    case 'Comparison':
      return `${renderNode(n.left)} ${n.operator} ${renderNode(n.right)}`;
    case 'Implication':
      return `(${renderNode(n.left)} implies ${renderNode(n.right)})`;
    case 'Attribute':
      return `${n.variable}.${n.attribute}`;
    case 'Variable':
      return n.name;
    case 'Literal':
      return typeof n.value === 'string' ? `'${n.value}'` : String(n.value);
    case 'Relation':
      return `<${n.variable.split(',').join(', ')}> in ${n.relation}`;
    default:
      return '';
  }
}

function parseInput(input: string): QueryNode {
  const tokens = tokenize(input.trim());
  return new Parser(tokens).parse();
}

// ============================================================
// TRC -> DRC
// ============================================================
export function trcToDrc(input: string): ConversionResult {
  const steps: ConversionStep[] = [];
  try {
    const ast = parseInput(input);
    if (ast.calculusType !== 'TRC') {
      return fail('Input is already a DRC query. Use the DRC to TRC direction instead.');
    }

    const tv = ast.tupleOrDomain as TupleVariable;
    const varRel = new Map<string, string>();
    for (const rel of collectRelationNodes(ast.condition)) {
      const v = rel.variable.split(',')[0].trim();
      if (!varRel.has(v)) varRel.set(v, rel.relation);
    }

    const mainRelation = varRel.get(tv.name) || varRel.values().next().value || '';
    if (!mainRelation) return fail('No relation membership found. Add "T in Students" to the condition.');
    const mainColumns = SCHEMA[mainRelation];
    if (!mainColumns) return fail(`Unknown relation "${mainRelation}". Conversion uses the sample schema: ${KNOWN_RELATIONS}.`);

    steps.push({
      title: 'Collect tuple variables',
      detail: [...varRel.entries()].map(([v, r]) => `${v} ranges over ${r}`).join('; '),
    });

    const used = new Set<string>();
    const uniqueName = (base: string): string => {
      let name = base;
      let i = 2;
      while (used.has(name)) name = base + i++;
      used.add(name);
      return name;
    };

    const domMap = new Map<string, string[]>();
    for (const [v, rel] of varRel) {
      const cols = SCHEMA[rel];
      if (!cols) return fail(`Unknown relation "${rel}". Conversion uses the sample schema: ${KNOWN_RELATIONS}.`);
      domMap.set(v, cols.map((c) => uniqueName(c)));
    }

    steps.push({
      title: 'Assign domain variables',
      detail: [...domMap.entries()].map(([v, d]) => `${v} becomes <${d.join(', ')}>`).join('; '),
    });

    if (tv.attributes) {
      for (const a of tv.attributes) {
        if (!mainColumns.includes(a)) {
          return fail(`Unknown attribute "${tv.name}.${a}". ${mainRelation} has columns: ${mainColumns.join(', ')}.`);
        }
      }
    }
    const mainDoms = domMap.get(tv.name) as string[];
    const resultVars = tv.attributes && tv.attributes.length > 0
      ? tv.attributes.map((a) => mainDoms[mainColumns.indexOf(a)])
      : [...mainDoms];

    const convert = (n: ASTNode): ASTNode => {
      switch (n.type) {
        case 'Relation': {
          const v = n.variable.split(',')[0].trim();
          return { type: 'Relation', variable: (domMap.get(v) as string[]).join(','), relation: n.relation };
        }
        case 'Attribute': {
          const rel = varRel.get(n.variable);
          const cols = rel ? SCHEMA[rel] : null;
          if (!cols) throw new Error(`Tuple variable "${n.variable}" has no "in Relation" membership.`);
          const idx = cols.indexOf(n.attribute);
          if (idx < 0) throw new Error(`Unknown attribute "${n.variable}.${n.attribute}" - ${rel} has columns: ${cols.join(', ')}.`);
          return { type: 'Variable', name: (domMap.get(n.variable) as string[])[idx] };
        }
        case 'Quantifier': {
          const doms = domMap.get(n.variable);
          if (!doms) throw new Error(`Tuple variable "${n.variable}" has no "in Relation" membership.`);
          let expr = convert(n.expression);
          for (let i = doms.length - 1; i >= 0; i--) {
            expr = { type: 'Quantifier', operator: n.operator, variable: doms[i], expression: expr };
          }
          return expr;
        }
        case 'BinaryOp':
          return { type: 'BinaryOp', operator: n.operator, left: convert(n.left), right: convert(n.right) };
        case 'UnaryOp':
          return { type: 'UnaryOp', operator: n.operator, operand: convert(n.operand) };
        case 'Comparison':
          return { type: 'Comparison', operator: n.operator, left: convert(n.left), right: convert(n.right) };
        case 'Implication':
          return { type: 'Implication', operator: n.operator, left: convert(n.left), right: convert(n.right) };
        default:
          return n;
      }
    };

    steps.push({
      title: 'Rewrite attribute references',
      detail: 'Each T.age becomes the domain variable bound to the age column of the relation T ranges over.',
    });
    steps.push({
      title: 'Expand quantifiers',
      detail: 'Each tuple quantifier (exists E) becomes nested domain quantifiers - one per column of the relation E ranges over.',
    });

    const drcAst: QueryNode = {
      type: 'Query',
      calculusType: 'DRC',
      variables: resultVars,
      tupleOrDomain: { type: 'DomainVariable', variables: resultVars } as DomainVariable,
      condition: convert(ast.condition),
    };

    return { success: true, output: renderDrc(drcAst), steps };
  } catch (e) {
    if (e instanceof ParseError) {
      return fail(`Parse error at line ${e.line}, column ${e.column}: ${e.message}`);
    }
    return fail(e instanceof Error ? e.message : 'Conversion failed.');
  }
}

// ============================================================
// DRC -> TRC
// ============================================================
interface JoinInfo {
  lTuple: string;
  lAttr: string;
  rTuple: string;
  rAttr: string;
}

export function drcToTrc(input: string): ConversionResult {
  const steps: ConversionStep[] = [];
  try {
    const ast = parseInput(input);
    if (ast.calculusType !== 'DRC') {
      return fail('Input is already a TRC query. Use the TRC to DRC direction instead.');
    }

    const resultVars = (ast.tupleOrDomain as DomainVariable).variables;
    for (const v of resultVars) {
      (function assertFree(n: ASTNode): void {
        if (n.type === 'Quantifier' && n.variable === v) {
          throw new Error(`Result variable "${v}" cannot be quantified - it must stay free.`);
        }
        if (n.type === 'BinaryOp' || n.type === 'Implication') { assertFree(n.left); assertFree(n.right); }
        if (n.type === 'UnaryOp') assertFree(n.operand);
        if (n.type === 'Comparison') { assertFree(n.left); assertFree(n.right); }
      })(ast.condition);
    }

    const relNodes = collectRelationNodes(ast.condition);
    if (relNodes.length === 0) return fail('No relation membership (e.g. <n, a, d> in Students) found in the condition.');

    const quantified = new Set<string>();
    (function walkQ(n: ASTNode): void {
      if (n.type === 'Quantifier') { quantified.add(n.variable); walkQ(n.expression); }
      if (n.type === 'BinaryOp' || n.type === 'Implication') { walkQ(n.left); walkQ(n.right); }
      if (n.type === 'UnaryOp') walkQ(n.operand);
      if (n.type === 'Comparison') { walkQ(n.left); walkQ(n.right); }
    })(ast.condition);

    const mainIdx = relNodes.findIndex((r) => {
      const vars = r.variable.split(',').map((s) => s.trim());
      return resultVars.every((v) => vars.includes(v));
    });
    if (mainIdx < 0) {
      return fail(`Result variables <${resultVars.join(', ')}> must all come from a single relation membership.`);
    }
    const ordered = [relNodes[mainIdx], ...relNodes.filter((_, i) => i !== mainIdx)];

    const TUPLE_NAMES = ['T', 'S', 'E', 'F', 'G', 'H', 'C', 'D', 'R'];
    let counter = 1;
    const freshTupleVar = (): string => {
      const name = TUPLE_NAMES[counter] || `T${counter + 1}`;
      counter++;
      return name;
    };

    const relAssign = new Map<RelationNode, { tupleVar: string; joins: JoinInfo[] }>();
    const boundAttr = new Map<string, { tupleVar: string; attr: string }>();
    const freeHome = new Map<string, { tupleVar: string; attr: string }>();

    for (const rel of ordered) {
      const cols = SCHEMA[rel.relation];
      if (!cols) return fail(`Unknown relation "${rel.relation}". Conversion uses the sample schema: ${KNOWN_RELATIONS}.`);
      const vars = rel.variable.split(',').map((s) => s.trim());
      if (vars.length !== cols.length) {
        return fail(`Arity mismatch: <${vars.join(', ')}> has ${vars.length} variable(s) but ${rel.relation} has ${cols.length} columns (${cols.join(', ')}).`);
      }
      const isMain = rel === ordered[0];
      const tupleVar = isMain ? 'T' : freshTupleVar();
      const joins: JoinInfo[] = [];
      vars.forEach((v, i) => {
        if (quantified.has(v)) {
          if (boundAttr.has(v)) {
            throw new Error(`Quantified variable "${v}" appears in two relation memberships - it cannot become a single tuple variable.`);
          }
          boundAttr.set(v, { tupleVar, attr: cols[i] });
        } else if (isMain) {
          freeHome.set(v, { tupleVar, attr: cols[i] });
        } else {
          const home = freeHome.get(v);
          if (home && home.tupleVar !== tupleVar) {
            joins.push({ lTuple: tupleVar, lAttr: cols[i], rTuple: home.tupleVar, rAttr: home.attr });
          }
        }
      });
      relAssign.set(rel, { tupleVar, joins });
    }

    steps.push({
      title: 'Assign tuple variables',
      detail: [...relAssign.entries()]
        .map(([r, a]) => `<${r.variable.split(',').join(', ')}> in ${r.relation} becomes ${a.tupleVar}`)
        .join('; '),
    });

    const convert = (n: ASTNode): ASTNode => {
      switch (n.type) {
        case 'Relation': {
          const info = relAssign.get(n) as { tupleVar: string; joins: JoinInfo[] };
          let chain: ASTNode = { type: 'Relation', variable: info.tupleVar, relation: n.relation };
          for (const j of info.joins) {
            chain = {
              type: 'BinaryOp', operator: 'AND', left: chain,
              right: {
                type: 'Comparison', operator: '=',
                left: { type: 'Attribute', variable: j.lTuple, attribute: j.lAttr },
                right: { type: 'Attribute', variable: j.rTuple, attribute: j.rAttr },
              },
            };
          }
          return chain;
        }
        case 'Variable': {
          const b = boundAttr.get(n.name) || freeHome.get(n.name);
          if (!b) {
            throw new Error(`Variable "${n.name}" is not bound by any relation membership. Every domain variable must appear inside a membership like <${n.name}, ...> in Relation.`);
          }
          return { type: 'Attribute', variable: b.tupleVar, attribute: b.attr };
        }
        case 'Quantifier': {
          const b = boundAttr.get(n.variable);
          if (!b) {
            throw new Error(`Quantified variable "${n.variable}" does not appear in any relation membership - it cannot become a tuple quantifier.`);
          }
          const inner = convert(n.expression);
          if (inner.type === 'Quantifier' && inner.variable === b.tupleVar) return inner;
          if (b.tupleVar === 'T') return inner;
          return { type: 'Quantifier', operator: n.operator, variable: b.tupleVar, expression: inner };
        }
        case 'BinaryOp':
          return { type: 'BinaryOp', operator: n.operator, left: convert(n.left), right: convert(n.right) };
        case 'UnaryOp':
          return { type: 'UnaryOp', operator: n.operator, operand: convert(n.operand) };
        case 'Comparison':
          return { type: 'Comparison', operator: n.operator, left: convert(n.left), right: convert(n.right) };
        case 'Implication':
          return { type: 'Implication', operator: n.operator, left: convert(n.left), right: convert(n.right) };
        default:
          return n;
      }
    };

    steps.push({
      title: 'Rewrite variable references',
      detail: 'Each bare domain variable (e.g. age) becomes an attribute reference (e.g. T.age) on the tuple variable that binds it.',
    });
    steps.push({
      title: 'Collapse quantifiers',
      detail: 'Chained domain quantifiers over the same relation merge into a single tuple quantifier (exists E(...)).',
    });

    const condition = convert(ast.condition);
    const homes = resultVars.map((v) => freeHome.get(v));
    if (homes.some((h) => !h)) {
      return fail(`Result variable "${resultVars.find((v) => !freeHome.has(v))}" is not bound by the main relation membership.`);
    }
    const attrs = homes.map((h) => (h as { attr: string }).attr);
    const mainCols = SCHEMA[ordered[0].relation];
    const projectAll = attrs.length === mainCols.length && attrs.every((a, i) => a === mainCols[i]);

    const trcAst: QueryNode = {
      type: 'Query',
      calculusType: 'TRC',
      variables: ['T'],
      tupleOrDomain: {
        type: 'TupleVariable',
        name: 'T',
        attributes: projectAll ? undefined : attrs,
      } as TupleVariable,
      condition,
    };

    return { success: true, output: renderTrc(trcAst), steps };
  } catch (e) {
    if (e instanceof ParseError) {
      return fail(`Parse error at line ${e.line}, column ${e.column}: ${e.message}`);
    }
    return fail(e instanceof Error ? e.message : 'Conversion failed.');
  }
}
