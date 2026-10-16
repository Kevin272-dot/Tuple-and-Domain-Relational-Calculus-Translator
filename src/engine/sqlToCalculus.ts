import { trcToDrc, ConversionStep } from './trcDrcConverter';

export interface SqlToCalculusResult {
  success: boolean;
  trc: string;
  drc: string;
  normalizedSql: string;
  steps: ConversionStep[];
  error?: string;
}

// ============================================================
// SQL tokenizer
// ============================================================
type SqlTokType = 'ident' | 'string' | 'number' | 'op' | 'punct' | 'kw' | 'star';
interface SqlTok { type: SqlTokType; value: string; }

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'EXISTS', 'IN', 'AS', 'DISTINCT',
]);

function tokenizeSql(input: string): SqlTok[] {
  const toks: SqlTok[] = [];
  let i = 0;
  const s = input.trim();
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === "'") {
      let j = i + 1;
      let val = '';
      while (j < s.length) {
        if (s[j] === "'" && s[j + 1] === "'") { val += "'"; j += 2; continue; }
        if (s[j] === "'") break;
        val += s[j];
        j++;
      }
      if (j >= s.length) throw new Error('Unterminated string literal. Missing closing quote.');
      toks.push({ type: 'string', value: val });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(s[i + 1] || ''))) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      toks.push({ type: 'number', value: s.slice(i, j) });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < s.length && /[A-Za-z_0-9]/.test(s[j])) j++;
      const word = s.slice(i, j);
      const upper = word.toUpperCase();
      toks.push({ type: SQL_KEYWORDS.has(upper) ? 'kw' : 'ident', value: upper === word ? word : word });
      i = j;
      continue;
    }
    if (ch === '*') { toks.push({ type: 'star', value: '*' }); i++; continue; }
    const two = s.slice(i, i + 2);
    if (['>=', '<=', '<>', '!='].includes(two)) {
      toks.push({ type: 'op', value: two === '<>' ? '!=' : two });
      i += 2;
      continue;
    }
    if (['=', '<', '>'].includes(ch)) { toks.push({ type: 'op', value: ch }); i++; continue; }
    if (['(', ')', ',', '.'].includes(ch)) { toks.push({ type: 'punct', value: ch }); i++; continue; }
    throw new Error(`Unexpected character "${ch}" at position ${i + 1} in the SQL query.`);
  }
  return toks;
}

// ============================================================
// SQL parser (subset)
// ============================================================
type SqlOperand =
  | { kind: 'col'; qualifier?: string; name: string }
  | { kind: 'lit'; value: string | number };

type SqlExpr =
  | { kind: 'cmp'; left: SqlOperand; op: string; right: SqlOperand }
  | { kind: 'and'; l: SqlExpr; r: SqlExpr }
  | { kind: 'or'; l: SqlExpr; r: SqlExpr }
  | { kind: 'not'; e: SqlExpr }
  | { kind: 'exists'; negated: boolean; sub: SqlSelect }
  | { kind: 'in'; negated: boolean; operand: SqlOperand; sub: SqlSelect };

interface SqlSelect {
  cols: { qualifier?: string; name: string }[] | '*';
  table: string;
  alias?: string;
  where?: SqlExpr;
  distinct: boolean;
}

class SqlParser {
  private toks: SqlTok[];
  private pos = 0;

  constructor(toks: SqlTok[]) { this.toks = toks; }

  private peek(): SqlTok | undefined { return this.toks[this.pos]; }
  private next(): SqlTok | undefined { return this.toks[this.pos++]; }
  private expectKw(kw: string): void {
    const t = this.next();
    if (!t || t.type !== 'kw' || t.value.toUpperCase() !== kw) {
      throw new Error(`Expected keyword ${kw} but found "${t?.value ?? 'end of query'}".`);
    }
  }
  private matchKw(kw: string): boolean {
    const t = this.peek();
    if (t && t.type === 'kw' && t.value.toUpperCase() === kw) { this.pos++; return true; }
    return false;
  }
  private expectPunct(p: string): void {
    const t = this.next();
    if (!t || t.type !== 'punct' || t.value !== p) {
      throw new Error(`Expected "${p}" but found "${t?.value ?? 'end of query'}".`);
    }
  }
  private matchPunct(p: string): boolean {
    const t = this.peek();
    if (t && t.type === 'punct' && t.value === p) { this.pos++; return true; }
    return false;
  }

  parseSelect(): SqlSelect {
    this.expectKw('SELECT');
    const distinct = this.matchKw('DISTINCT');

    let cols: SqlSelect['cols'];
    const t0 = this.peek();
    if (t0 && t0.type === 'star') { this.next(); cols = '*'; }
    else {
      cols = [];
      for (;;) {
        const t = this.next();
        if (!t || t.type !== 'ident') throw new Error(`Expected a column name but found "${t?.value ?? 'end of query'}".`);
        let col: { qualifier?: string; name: string };
        if (this.matchPunct('.')) {
          const t2 = this.next();
          if (!t2 || t2.type !== 'ident') throw new Error(`Expected a column name after "${t.value}."`);
          col = { qualifier: t.value, name: t2.value };
        } else {
          col = { name: t.value };
        }
        (cols as { qualifier?: string; name: string }[]).push(col);
        if (!this.matchPunct(',')) break;
      }
    }

    this.expectKw('FROM');
    const tt = this.next();
    if (!tt || tt.type !== 'ident') throw new Error(`Expected a table name after FROM but found "${tt?.value ?? 'end of query'}".`);
    const table = tt.value;
    let alias: string | undefined;
    this.matchKw('AS');
    const ta = this.peek();
    if (ta && ta.type === 'ident') {
      alias = this.next()?.value;
    }

    let where: SqlExpr | undefined;
    if (this.matchKw('WHERE')) {
      where = this.parseOr();
    }

    const leftover = this.peek();
    if (leftover) {
      throw new Error(`Unexpected token "${leftover.value}". Supported SQL: SELECT [DISTINCT] cols FROM table [alias] [WHERE ...] with AND/OR/NOT, comparisons, EXISTS and IN subqueries.`);
    }

    return { cols, table, alias, where, distinct };
  }

  private parseOr(): SqlExpr {
    let left = this.parseAnd();
    while (this.matchKw('OR')) left = { kind: 'or', l: left, r: this.parseAnd() };
    return left;
  }

  private parseAnd(): SqlExpr {
    let left = this.parseNot();
    while (this.matchKw('AND')) left = { kind: 'and', l: left, r: this.parseNot() };
    return left;
  }

  private parseNot(): SqlExpr {
    if (this.matchKw('NOT')) return { kind: 'not', e: this.parseNot() };
    return this.parsePrimary();
  }

  private parsePrimary(): SqlExpr {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of SQL query.');

    if (t.type === 'kw' && t.value.toUpperCase() === 'EXISTS') {
      this.next();
      this.expectPunct('(');
      const sub = this.parseSelect();
      this.expectPunct(')');
      return { kind: 'exists', negated: false, sub };
    }

    if (t.type === 'punct' && t.value === '(') {
      this.next();
      const e = this.parseOr();
      this.expectPunct(')');
      return e;
    }

    const operand = this.parseOperand();

    const nt = this.peek();
    if (nt && nt.type === 'kw' && nt.value.toUpperCase() === 'NOT') {
      const after = this.toks[this.pos + 1];
      if (after && after.type === 'kw' && after.value.toUpperCase() === 'IN') {
        this.next();
        this.next();
        this.expectPunct('(');
        const sub = this.parseSelect();
        this.expectPunct(')');
        return { kind: 'in', negated: true, operand, sub };
      }
    }

    if (nt && nt.type === 'kw' && nt.value.toUpperCase() === 'IN') {
      this.next();
      this.expectPunct('(');
      const sub = this.parseSelect();
      this.expectPunct(')');
      return { kind: 'in', negated: false, operand, sub };
    }

    if (nt && nt.type === 'op') {
      this.next();
      const right = this.parseOperand();
      return { kind: 'cmp', left: operand, op: nt.value, right };
    }

    throw new Error(`Expected a comparison operator after "${'name' in operand ? operand.name : operand.value}" but found "${nt?.value ?? 'end of query'}".`);
  }

  private parseOperand(): SqlOperand {
    const t = this.next();
    if (!t) throw new Error('Unexpected end of SQL query.');
    if (t.type === 'string') return { kind: 'lit', value: t.value };
    if (t.type === 'number') return { kind: 'lit', value: parseFloat(t.value) };
    if (t.type === 'ident') {
      if (this.matchPunct('.')) {
        const t2 = this.next();
        if (!t2 || t2.type !== 'ident') throw new Error(`Expected a column name after "${t.value}."`);
        return { kind: 'col', qualifier: t.value, name: t2.value };
      }
      return { kind: 'col', name: t.value };
    }
    throw new Error(`Expected a column name or value but found "${t.value}".`);
  }
}

// ============================================================
// TRC generation
// ============================================================
const TUPLE_VARS = ['T', 'S', 'E', 'F', 'G', 'H', 'C', 'D'];

class TrcBuilder {
  private counter = 0;
  private used = new Set<string>();

  fresh(existing: string | undefined): string {
    if (existing && /^[A-Za-z_][A-Za-z_0-9]*$/.test(existing) && !this.used.has(existing)) {
      this.used.add(existing);
      return existing;
    }
    let name = TUPLE_VARS[this.counter] || `V${this.counter}`;
    while (this.used.has(name)) { this.counter++; name = TUPLE_VARS[this.counter] || `V${this.counter}`; }
    this.counter++;
    this.used.add(name);
    return name;
  }

  renderOperand(op: SqlOperand, scope: Map<string, string>, defaultVar: string): string {
    if (op.kind === 'lit') return typeof op.value === 'string' ? `'${op.value}'` : String(op.value);
    if (op.qualifier) {
      const v = scope.get(op.qualifier);
      if (!v) throw new Error(`Unknown table alias "${op.qualifier}". Define it in FROM or use the table name.`);
      return `${v}.${op.name}`;
    }
    return `${defaultVar}.${op.name}`;
  }

  renderExpr(e: SqlExpr, scope: Map<string, string>, defaultVar: string): string {
    switch (e.kind) {
      case 'cmp':
        return `${this.renderOperand(e.left, scope, defaultVar)} ${e.op} ${this.renderOperand(e.right, scope, defaultVar)}`;
      case 'and':
        return `(${this.renderExpr(e.l, scope, defaultVar)} and ${this.renderExpr(e.r, scope, defaultVar)})`;
      case 'or':
        return `(${this.renderExpr(e.l, scope, defaultVar)} or ${this.renderExpr(e.r, scope, defaultVar)})`;
      case 'not':
        return `not (${this.renderExpr(e.e, scope, defaultVar)})`;
      case 'exists': {
        const v = this.fresh(e.sub.alias);
        const innerScope = new Map(scope);
        innerScope.set(e.sub.alias || e.sub.table, v);
        innerScope.set(e.sub.table, v);
        const inner = this.renderWhere(e.sub.where, innerScope, v, e.sub.table, v);
        return `${e.negated ? 'not ' : ''}exists ${v}(${v} in ${e.sub.table}${inner ? ` and ${inner}` : ''})`;
      }
      case 'in': {
        if (e.sub.cols === '*') {
          throw new Error('IN subquery must select a single column, e.g. IN (SELECT student FROM Enrollment ...).');
        }
        if (e.sub.cols.length !== 1) {
          throw new Error('IN subquery must select exactly one column.');
        }
        const colName = e.sub.cols[0].name;
        const v = this.fresh(e.sub.alias);
        const innerScope = new Map(scope);
        innerScope.set(e.sub.alias || e.sub.table, v);
        innerScope.set(e.sub.table, v);
        const inner = this.renderWhere(e.sub.where, innerScope, v, e.sub.table, v);
        const renderedOperand = this.renderOperand(e.operand, scope, defaultVar);
        return `${e.negated ? 'not ' : ''}exists ${v}(${v} in ${e.sub.table} and ${v}.${colName} = ${renderedOperand}${inner ? ` and ${inner}` : ''})`;
      }
    }
  }

  renderWhere(
    where: SqlExpr | undefined,
    scope: Map<string, string>,
    defaultVar: string,
    table: string,
    tupleVar: string
  ): string {
    if (!where) return '';
    return this.renderExpr(where, scope, defaultVar);
  }
}

const normalizeSql = (sel: SqlSelect): string => {
  const cols = sel.cols === '*' ? '*' : sel.cols.map((c) => (c.qualifier ? `${c.qualifier}.${c.name}` : c.name)).join(', ');
  const alias = sel.alias ? ` ${sel.alias}` : '';
  return `SELECT ${sel.distinct ? 'DISTINCT ' : ''}${cols} FROM ${sel.table}${alias}${sel.where ? ' WHERE ...' : ''}`;
};

export function sqlToCalculus(input: string): SqlToCalculusResult {
  try {
    if (!input.trim()) throw new Error('Enter a SQL query first.');
    const toks = tokenizeSql(input);
    const parser = new SqlParser(toks);
    const sel = parser.parseSelect();

    const builder = new TrcBuilder();
    const mainVar = builder.fresh(sel.alias || undefined);
    const scope = new Map<string, string>();
    scope.set(sel.alias || sel.table, mainVar);
    scope.set(sel.table, mainVar);

    const whereTrc = builder.renderWhere(sel.where, scope, mainVar, sel.table, mainVar);
    let head: string;
    if (sel.cols === '*') head = mainVar;
    else if (sel.cols.length === 1) head = `${mainVar}.${sel.cols[0].name}`;
    else head = `${mainVar}[${sel.cols.map((c) => c.name).join(', ')}]`;

    const trc = `{${head} | ${mainVar} in ${sel.table}${whereTrc ? ` and ${whereTrc}` : ''}}`;

    const steps: ConversionStep[] = [
      { title: 'Parse the SQL query', detail: `Recognized: SELECT ${sel.cols === '*' ? '*' : sel.cols.map((c) => c.name).join(', ')} FROM ${sel.table} with ${sel.where ? 'a WHERE clause' : 'no WHERE clause'}.` },
      { title: 'Map FROM to tuple membership', detail: `FROM ${sel.table} becomes "${mainVar} in ${sel.table}" — a tuple variable ranging over ${sel.table}.` },
      { title: 'Map WHERE to the condition', detail: 'Comparisons, AND/OR/NOT map directly; EXISTS subqueries become exists quantifiers; IN subqueries become exists with an equality join.' },
      { title: 'Map SELECT to the result head', detail: `SELECT ${sel.cols === '*' ? '*' : sel.cols.map((c) => c.name).join(', ')} becomes the projection "${head}".` },
    ];

    let drc = '';
    let drcError: string | undefined;
    try {
      const conv = trcToDrc(trc);
      if (conv.success) {
        drc = conv.output;
        steps.push(...conv.steps);
      } else {
        drcError = conv.error;
      }
    } catch (e) {
      drcError = e instanceof Error ? e.message : 'DRC conversion failed.';
    }

    if (sel.distinct) {
      steps.push({ title: 'Set semantics note', detail: 'Relational calculus returns a SET of tuples, so SELECT DISTINCT needs no special handling — duplicates never appear.' });
    }

    return {
      success: true,
      trc,
      drc: drc || `DRC conversion unavailable: ${drcError || 'unknown error'}`,
      normalizedSql: normalizeSql(sel),
      steps,
    };
  } catch (e) {
    return {
      success: false,
      trc: '',
      drc: '',
      normalizedSql: '',
      steps: [],
      error: e instanceof Error ? e.message : 'Could not convert the SQL query.',
    };
  }
}
