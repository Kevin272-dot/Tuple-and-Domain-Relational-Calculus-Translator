import { ASTNode } from './types';

export function getOperatorSymbol(operator: string): string {
  const map: Record<string, string> = {
    AND: '∧',
    OR: '∨',
    NOT: '¬',
    IMPLIES: '→',
    IFF: '↔',
    FORALL: '∀',
    EXISTS: '∃',
    IN: '∈',
    '=': '=',
    '!=': '≠',
    '<': '<',
    '>': '>',
    '<=': '≤',
    '>=': '≥',
  };
  return map[operator] || operator;
}

export function getOperatorName(operator: string): string {
  const map: Record<string, string> = {
    AND: 'Conjunction',
    OR: 'Disjunction',
    NOT: 'Negation',
    IMPLIES: 'Implication',
    IFF: 'Biconditional',
    FORALL: 'Universal Quantifier',
    EXISTS: 'Existential Quantifier',
    IN: 'Membership',
    '=': 'Equality',
    '!=': 'Inequality',
    '<': 'Less Than',
    '>': 'Greater Than',
    '<=': 'Less or Equal',
    '>=': 'Greater or Equal',
  };
  return map[operator] || operator;
}

export function formatAST(node: ASTNode): string {
  switch (node.type) {
    case 'Query': {
      const vars = node.calculusType === 'TRC'
        ? (node.tupleOrDomain.type === 'TupleVariable'
            ? node.tupleOrDomain.attributes
              ? `${node.tupleOrDomain.name}.${node.tupleOrDomain.attributes.join('.')}`
              : node.tupleOrDomain.name
            : '')
        : `<${node.tupleOrDomain.type === 'DomainVariable' ? node.tupleOrDomain.variables.join(', ') : ''}>`;
      return `{ ${vars} | ${formatAST(node.condition)} }`;
    }
    case 'BinaryOp':
      return `(${formatAST(node.left)} ${getOperatorSymbol(node.operator)} ${formatAST(node.right)})`;
    case 'UnaryOp':
      return `${getOperatorSymbol(node.operator)}(${formatAST(node.operand)})`;
    case 'Quantifier':
      return `${getOperatorSymbol(node.operator)} ${node.variable}(${formatAST(node.expression)})`;
    case 'Comparison':
      return `${formatAST(node.left)} ${node.operator} ${formatAST(node.right)}`;
    case 'Implication':
      return `(${formatAST(node.left)} ${getOperatorSymbol(node.operator)} ${formatAST(node.right)})`;
    case 'Attribute':
      return `${node.variable}.${node.attribute}`;
    case 'Variable':
      return node.name;
    case 'Literal':
      return typeof node.value === 'string' ? `'${node.value}'` : String(node.value);
    case 'Relation':
      return `${node.variable} ∈ ${node.relation}`;
    default:
      return '';
  }
}

export function collectRelations(node: ASTNode): string[] {
  const relations: string[] = [];
  function walk(n: ASTNode) {
    if (n.type === 'Relation' && !relations.includes(n.relation)) {
      relations.push(n.relation);
    }
    if (n.type === 'BinaryOp') { walk(n.left); walk(n.right); }
    if (n.type === 'UnaryOp') walk(n.operand);
    if (n.type === 'Quantifier') walk(n.expression);
    if (n.type === 'Comparison') { walk(n.left); walk(n.right); }
    if (n.type === 'Implication') { walk(n.left); walk(n.right); }
  }
  walk(node);
  return relations;
}

export function collectVariables(node: ASTNode): string[] {
  const vars: string[] = [];
  function walk(n: ASTNode) {
    if (n.type === 'Variable' && !vars.includes(n.name)) vars.push(n.name);
    if (n.type === 'Attribute' && !vars.includes(n.variable)) vars.push(n.variable);
    if (n.type === 'BinaryOp') { walk(n.left); walk(n.right); }
    if (n.type === 'UnaryOp') walk(n.operand);
    if (n.type === 'Quantifier') { vars.push(n.variable); walk(n.expression); }
    if (n.type === 'Comparison') { walk(n.left); walk(n.right); }
    if (n.type === 'Implication') { walk(n.left); walk(n.right); }
  }
  walk(node);
  return vars;
}

export function collectQuantifiers(node: ASTNode): Array<{ operator: string; variable: string }> {
  const quants: Array<{ operator: string; variable: string }> = [];
  function walk(n: ASTNode) {
    if (n.type === 'Quantifier') {
      quants.push({ operator: n.operator, variable: n.variable });
      walk(n.expression);
    }
    if (n.type === 'BinaryOp') { walk(n.left); walk(n.right); }
    if (n.type === 'UnaryOp') walk(n.operand);
    if (n.type === 'Comparison') { walk(n.left); walk(n.right); }
    if (n.type === 'Implication') { walk(n.left); walk(n.right); }
  }
  walk(node);
  return quants;
}

export function cloneAST(node: ASTNode): ASTNode {
  const clone = { ...node };
  if ('left' in clone && clone.left && typeof clone.left === 'object' && 'type' in clone.left) {
    (clone as { left: ASTNode }).left = cloneAST(clone.left as ASTNode);
  }
  if ('right' in clone && clone.right && typeof clone.right === 'object' && 'type' in clone.right) {
    (clone as { right: ASTNode }).right = cloneAST(clone.right as ASTNode);
  }
  if ('operand' in clone && clone.operand && typeof clone.operand === 'object' && 'type' in clone.operand) {
    (clone as { operand: ASTNode }).operand = cloneAST(clone.operand as ASTNode);
  }
  if ('expression' in clone && clone.expression && typeof clone.expression === 'object' && 'type' in clone.expression) {
    (clone as { expression: ASTNode }).expression = cloneAST(clone.expression as ASTNode);
  }
  return clone as ASTNode;
}

export function getASTDepth(node: ASTNode): number {
  let maxDepth = 1;
  if ('left' in node && node.left && typeof node.left === 'object' && 'type' in node.left) {
    maxDepth = Math.max(maxDepth, 1 + getASTDepth(node.left as ASTNode));
  }
  if ('right' in node && node.right && typeof node.right === 'object' && 'type' in node.right) {
    maxDepth = Math.max(maxDepth, 1 + getASTDepth(node.right as ASTNode));
  }
  if ('operand' in node && node.operand && typeof node.operand === 'object' && 'type' in node.operand) {
    maxDepth = Math.max(maxDepth, 1 + getASTDepth(node.operand as ASTNode));
  }
  if ('expression' in node && node.expression && typeof node.expression === 'object' && 'type' in node.expression) {
    maxDepth = Math.max(maxDepth, 1 + getASTDepth(node.expression as ASTNode));
  }
  return maxDepth;
}

export function formatQuery(input: string): string {
  const keywordMap: Record<string, string> = {
    '∧': ' and ',
    '∨': ' or ',
    '¬': ' not ',
    '→': ' implies ',
    '↔': ' iff ',
    '∀': 'forall ',
    '∃': 'exists ',
    '∈': ' in ',
    '≠': '!= ',
    '≤': '<= ',
    '≥': '>= ',
  };

  let result = input;
  for (const [symbol, replacement] of Object.entries(keywordMap)) {
    result = result.split(symbol).join(replacement);
  }

  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

export function generatePredicateTree(node: ASTNode, id: number = 0): {
  id: number;
  label: string;
  type: string;
  children: ReturnType<typeof generatePredicateTree>[];
} {
  let nextId = id + 1;
  const children: ReturnType<typeof generatePredicateTree>[] = [];

  switch (node.type) {
    case 'Query': {
      const label = node.calculusType === 'TRC'
        ? `{ ${node.tupleOrDomain.type === 'TupleVariable' ? node.tupleOrDomain.name : '<...>'} | ... }`
        : `{ <${node.tupleOrDomain.type === 'DomainVariable' ? node.tupleOrDomain.variables.join(', ') : ''}> | ... }`;
      const child = generatePredicateTree(node.condition, nextId);
      nextId = child.id + 1;
      children.push(child);
      return { id, label, type: 'Query', children };
    }
    case 'BinaryOp':
    case 'Implication': {
      const opLabel = node.type === 'Implication'
        ? (node.operator === 'IMPLIES' ? '→' : '↔')
        : getOperatorSymbol(node.operator);
      const leftChild = generatePredicateTree(node.left, nextId);
      nextId = leftChild.id + 1;
      const rightChild = generatePredicateTree(node.right, nextId);
      nextId = rightChild.id + 1;
      children.push(leftChild, rightChild);
      return { id, label: opLabel, type: node.operator, children };
    }
    case 'UnaryOp': {
      const child = generatePredicateTree(node.operand, nextId);
      nextId = child.id + 1;
      children.push(child);
      return { id, label: '¬', type: 'NOT', children };
    }
    case 'Quantifier': {
      const child = generatePredicateTree(node.expression, nextId);
      nextId = child.id + 1;
      children.push(child);
      return { id, label: `${getOperatorSymbol(node.operator)} ${node.variable}`, type: node.operator, children };
    }
    case 'Comparison': {
      const leftChild = generatePredicateTree(node.left, nextId);
      nextId = leftChild.id + 1;
      const rightChild = generatePredicateTree(node.right, nextId);
      nextId = rightChild.id + 1;
      children.push(leftChild, rightChild);
      return { id, label: node.operator, type: 'Comparison', children };
    }
    case 'Attribute':
      return { id, label: `${node.variable}.${node.attribute}`, type: 'Attribute', children: [] };
    case 'Variable':
      return { id, label: node.name, type: 'Variable', children: [] };
    case 'Literal':
      return { id, label: typeof node.value === 'string' ? `'${node.value}'` : String(node.value), type: 'Literal', children: [] };
    case 'Relation':
      return { id, label: `${node.variable} ∈ ${node.relation}`, type: 'Relation', children: [] };
    default:
      return { id, label: '?', type: 'Unknown', children: [] };
  }
}
