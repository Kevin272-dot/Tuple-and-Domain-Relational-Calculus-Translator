export const MAX_QUERY_LENGTH = 5000;

export const TRC_OPERATORS = {
  AND: { symbol: '∧', keyword: 'and', name: 'Conjunction', sql: 'AND' },
  OR: { symbol: '∨', keyword: 'or', name: 'Disjunction', sql: 'OR' },
  NOT: { symbol: '¬', keyword: 'not', name: 'Negation', sql: 'NOT' },
  IMPLIES: { symbol: '→', keyword: 'implies', name: 'Implication', sql: 'NOT ... OR' },
  IFF: { symbol: '↔', keyword: 'iff', name: 'Biconditional', sql: '=' },
  FORALL: { symbol: '∀', keyword: 'forall', name: 'Universal Quantifier', sql: 'NOT EXISTS ... NOT' },
  EXISTS: { symbol: '∃', keyword: 'exists', name: 'Existential Quantifier', sql: 'EXISTS' },
  IN: { symbol: '∈', keyword: 'in', name: 'Membership', sql: 'FROM / IN' },
  EQ: { symbol: '=', keyword: '=', name: 'Equality', sql: '=' },
  NEQ: { symbol: '≠', keyword: '!=', name: 'Inequality', sql: '!=' },
  LT: { symbol: '<', keyword: '<', name: 'Less Than', sql: '<' },
  GT: { symbol: '>', keyword: '>', name: 'Greater Than', sql: '>' },
  LTE: { symbol: '≤', keyword: '<=', name: 'Less or Equal', sql: '<=' },
  GTE: { symbol: '≥', keyword: '>=', name: 'Greater or Equal', sql: '>=' },
} as const;

export const SQL_RESERVED_WORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'INSERT',
  'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS', 'SET', 'VALUES',
  'INTO', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION',
  'ALL', 'DISTINCT', 'NULL', 'IS', 'BETWEEN', 'LIKE', 'ANY', 'SOME',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'PRIMARY', 'KEY',
  'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'UNIQUE', 'CHECK', 'DEFAULT',
  'DATABASE', 'SCHEMA', 'GRANT', 'REVOKE', 'TRIGGER', 'PROCEDURE', 'FUNCTION',
  'IF', 'WHILE', 'FOR', 'LOOP', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
];

export const SAMPLE_DATABASE_SCHEMA = {
  Students: {
    columns: ['name', 'age', 'dept', 'gpa'],
    types: ['VARCHAR', 'INT', 'VARCHAR', 'FLOAT'],
    sampleData: [
      ['Alice', 21, 'CS', 3.8],
      ['Bob', 22, 'Math', 3.5],
      ['Charlie', 20, 'CS', 3.9],
      ['Diana', 23, 'Physics', 3.2],
      ['Eve', 21, 'CS', 3.7],
      ['Frank', 22, 'Math', 3.1],
      ['Grace', 20, 'Physics', 3.6],
    ],
  },
  Enrollment: {
    columns: ['student', 'course', 'grade'],
    types: ['VARCHAR', 'VARCHAR', 'VARCHAR'],
    sampleData: [
      ['Alice', 'DBMS', 'A'],
      ['Alice', 'OS', 'B'],
      ['Bob', 'DBMS', 'A'],
      ['Charlie', 'DBMS', 'A'],
      ['Charlie', 'Networks', 'B'],
      ['Diana', 'OS', 'C'],
      ['Eve', 'DBMS', 'B'],
      ['Eve', 'OS', 'A'],
    ],
  },
  Enrolls: {
    columns: ['s', 'c'],
    types: ['VARCHAR', 'VARCHAR'],
    sampleData: [
      ['Alice', 'DBMS'],
      ['Alice', 'OS'],
      ['Bob', 'DBMS'],
      ['Charlie', 'DBMS'],
      ['Charlie', 'Networks'],
    ],
  },
  RequiredCourses: {
    columns: ['course', 'credits'],
    types: ['VARCHAR', 'INT'],
    sampleData: [
      ['DBMS', 4],
      ['OS', 3],
      ['Networks', 3],
    ],
  },
} as const;

export const COMMON_MISTAKES = [
  {
    mistake: 'Using ∧ instead of AND',
    correction: 'Use the text keyword "and" instead of the Unicode symbol "∧"',
    explanation: 'While the tokenizer supports Unicode symbols, text keywords are easier to type and more readable.',
  },
  {
    mistake: 'Missing "in" operator for relation membership',
    correction: 'Add "in RelationName" after the tuple variable',
    explanation: 'TRC requires explicit relation membership. Example: {T | T in Students AND T.age > 20}',
  },
  {
    mistake: 'Using SELECT * for projected attributes',
    correction: 'Use the attribute name: {T.name | ...} translates to SELECT name',
    explanation: 'The variable before the pipe determines which columns appear in the result.',
  },
  {
    mistake: 'Forgetting parentheses around quantifier expressions',
    correction: 'Quantifiers need parentheses: exists E(...)',
    explanation: '∃E(...) and ∀E(...) require parentheses around the scoped expression.',
  },
  {
    mistake: 'Using = for implication',
    correction: 'Use "implies" or →: P implies Q',
    explanation: 'Implication (→) is translated as NOT P OR Q in SQL.',
  },
] as const;

export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], action: 'Execute/translate query' },
  { keys: ['Ctrl', 'Shift', 'F'], action: 'Format query' },
  { keys: ['Ctrl', 'K'], action: 'Open command palette' },
  { keys: ['Ctrl', 'S'], action: 'Download/export report' },
  { keys: ['Ctrl', 'L'], action: 'Clear input' },
  { keys: ['Ctrl', 'D'], action: 'Toggle Day/Night mode' },
  { keys: ['Ctrl', '1'], action: 'Switch to Simulator tab' },
  { keys: ['Ctrl', '2'], action: 'Switch to Learn tab' },
  { keys: ['Ctrl', '3'], action: 'Switch to Practice tab' },
  { keys: ['Ctrl', '4'], action: 'Switch to Help tab' },
  { keys: ['Escape'], action: 'Close modals/palettes' },
] as const;
