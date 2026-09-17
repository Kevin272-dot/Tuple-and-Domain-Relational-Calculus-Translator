import { ASTNode, QueryNode } from './types';
import { SAMPLE_DATABASE_SCHEMA } from './constants';

export interface DatabaseTable {
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface EvaluationResult {
  success: boolean;
  columns: string[];
  rows: (string | number)[][];
  rowCount: number;
  error?: string;
}

function buildDatabase(): Map<string, DatabaseTable> {
  const db = new Map<string, DatabaseTable>();
  for (const [name, schema] of Object.entries(SAMPLE_DATABASE_SCHEMA)) {
    db.set(name, {
      name,
      columns: [...schema.columns],
      rows: schema.sampleData.map(row => [...row]),
    });
  }
  return db;
}

function getTable(db: Map<string, DatabaseTable>, name: string): DatabaseTable | undefined {
  return db.get(name);
}

function compareValues(
  left: string | number,
  op: string,
  right: string | number
): boolean {
  switch (op) {
    case '=': return left === right;
    case '!=': return left !== right;
    case '<': return left < right;
    case '>': return left > right;
    case '<=': return left <= right;
    case '>=': return left >= right;
    default: return false;
  }
}

function evaluateCondition(
  node: ASTNode,
  row: (string | number)[],
  columns: string[],
  db: Map<string, DatabaseTable>,
  tupleVar: string
): boolean {
  switch (node.type) {
    case 'BinaryOp': {
      const left = evaluateCondition(node.left, row, columns, db, tupleVar);
      const right = evaluateCondition(node.right, row, columns, db, tupleVar);
      return node.operator === 'AND' ? left && right : left || right;
    }
    case 'UnaryOp':
      return !evaluateCondition(node.operand, row, columns, db, tupleVar);
    case 'Comparison': {
      const leftVal = getExprValue(node.left, row, columns, tupleVar);
      const rightVal = getExprValue(node.right, row, columns, tupleVar);
      if (leftVal === undefined || rightVal === undefined) return false;
      return compareValues(leftVal, node.operator, rightVal);
    }
    case 'Implication':
      return !evaluateCondition(node.left, row, columns, db, tupleVar) ||
             evaluateCondition(node.right, row, columns, db, tupleVar);
    case 'Quantifier':
      return evaluateQuantifier(node, row, columns, db, tupleVar);
    case 'Relation':
      return true;
    default:
      return true;
  }
}

function getExprValue(
  node: ASTNode,
  row: (string | number)[],
  columns: string[],
  tupleVar: string
): string | number | undefined {
  if (node.type === 'Attribute') {
    if (node.variable === tupleVar) {
      const idx = columns.indexOf(node.attribute);
      return idx >= 0 ? row[idx] : undefined;
    }
    return undefined;
  }
  if (node.type === 'Literal') return node.value;
  if (node.type === 'Variable') {
    const idx = columns.indexOf(node.name);
    return idx >= 0 ? row[idx] : undefined;
  }
  return undefined;
}

function evaluateQuantifier(
  node: ASTNode,
  row: (string | number)[],
  columns: string[],
  db: Map<string, DatabaseTable>,
  tupleVar: string
): boolean {
  if (node.type !== 'Quantifier') return true;

  const inner = node.expression;
  let targetRelation = '';
  if (inner.type === 'BinaryOp') {
    if (inner.left.type === 'Relation') targetRelation = inner.left.relation;
    else if (inner.right.type === 'Relation') targetRelation = inner.right.relation;
  }
  if (inner.type === 'Relation') targetRelation = inner.relation;

  if (!targetRelation) {
    for (const [name] of db) {
      if (name.toLowerCase() !== tupleVar.toLowerCase()) {
        targetRelation = name;
        break;
      }
    }
  }

  const table = getTable(db, targetRelation);
  if (!table) return node.operator === 'EXISTS' ? false : true;

  if (node.operator === 'EXISTS') {
    for (const subRow of table.rows) {
      if (evaluateCondition(inner, subRow, table.columns, db, node.variable)) {
        return true;
      }
    }
    return false;
  }

  for (const subRow of table.rows) {
    if (!evaluateCondition(inner, subRow, table.columns, db, node.variable)) {
      return false;
    }
  }
  return true;
}

export function evaluateQuery(ast: QueryNode): EvaluationResult {
  const db = buildDatabase();

  let mainRelation = '';
  function findRelation(n: ASTNode): string {
    if (n.type === 'Relation') return n.relation;
    if (n.type === 'BinaryOp') {
      const l = findRelation(n.left);
      return l || findRelation(n.right);
    }
    if (n.type === 'UnaryOp') return findRelation(n.operand);
    if (n.type === 'Quantifier') return '';
    if (n.type === 'Comparison') {
      const l = findRelation(n.left);
      return l || findRelation(n.right);
    }
    if (n.type === 'Implication') {
      const l = findRelation(n.left);
      return l || findRelation(n.right);
    }
    return '';
  }
  mainRelation = findRelation(ast.condition);

  if (!mainRelation) {
    for (const [name] of db) {
      mainRelation = name;
      break;
    }
  }

  const table = getTable(db, mainRelation);
  if (!table) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      error: `Table "${mainRelation}" not found in sample database.`,
    };
  }

  const tupleVar = ast.calculusType === 'TRC'
    ? (ast.tupleOrDomain.type === 'TupleVariable' ? ast.tupleOrDomain.name : 'T')
    : 'T';

  const selectedCols: string[] = [];
  if (ast.calculusType === 'TRC') {
    if (ast.tupleOrDomain.type === 'TupleVariable' && ast.tupleOrDomain.attributes) {
      selectedCols.push(...ast.tupleOrDomain.attributes);
    }
  } else {
    if (ast.tupleOrDomain.type === 'DomainVariable') {
      selectedCols.push(...ast.tupleOrDomain.variables);
    }
  }

  const resultRows: (string | number)[][] = [];

  for (const row of table.rows) {
    if (evaluateCondition(ast.condition, row, table.columns, db, tupleVar)) {
      if (selectedCols.length > 0) {
        const projected = selectedCols.map(col => {
          const idx = table.columns.indexOf(col);
          return idx >= 0 ? row[idx] : '';
        });
        resultRows.push(projected);
      } else {
        resultRows.push([...row]);
      }
    }
  }

  const resultColumns = selectedCols.length > 0 ? selectedCols : table.columns;

  return {
    success: true,
    columns: resultColumns,
    rows: resultRows,
    rowCount: resultRows.length,
  };
}
