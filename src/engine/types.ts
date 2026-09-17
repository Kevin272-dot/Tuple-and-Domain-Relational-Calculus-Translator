export type TokenType =
  | 'LBRACE'
  | 'RBRACE'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACKET'
  | 'RBRACKET'
  | 'PIPE'
  | 'COMMA'
  | 'DOT'
  | 'COLON'
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'LT'
  | 'GT'
  | 'LTE'
  | 'GTE'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'IMPLIES'
  | 'IFF'
  | 'FORALL'
  | 'EXISTS'
  | 'IN'
  | 'IDENTIFIER'
  | 'STRING_LITERAL'
  | 'NUMBER'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
  line: number;
  column: number;
}

export type CalculusType = 'TRC' | 'DRC';

export type ASTNode =
  | QueryNode
  | ConditionNode
  | BinaryOpNode
  | UnaryOpNode
  | QuantifierNode
  | AttributeNode
  | RelationNode
  | LiteralNode
  | VariableNode
  | ComparisonNode
  | ImplicationNode;

export interface QueryNode {
  type: 'Query';
  calculusType: CalculusType;
  variables: string[];
  tupleOrDomain: TupleVariable | DomainVariable;
  condition: ASTNode;
}

export interface TupleVariable {
  type: 'TupleVariable';
  name: string;
  attributes?: string[];
}

export interface DomainVariable {
  type: 'DomainVariable';
  variables: string[];
}

export interface ConditionNode {
  type: 'Condition';
  expression: ASTNode;
}

export interface BinaryOpNode {
  type: 'BinaryOp';
  operator: 'AND' | 'OR' | 'IMPLIES' | 'IFF';
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryOpNode {
  type: 'UnaryOp';
  operator: 'NOT';
  operand: ASTNode;
}

export interface QuantifierNode {
  type: 'Quantifier';
  operator: 'FORALL' | 'EXISTS';
  variable: string;
  expression: ASTNode;
}

export interface AttributeNode {
  type: 'Attribute';
  variable: string;
  attribute: string;
}

export interface RelationNode {
  type: 'Relation';
  variable: string;
  relation: string;
}

export interface LiteralNode {
  type: 'Literal';
  value: string | number;
}

export interface VariableNode {
  type: 'Variable';
  name: string;
}

export interface ComparisonNode {
  type: 'Comparison';
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=';
  left: ASTNode;
  right: ASTNode;
}

export interface ImplicationNode {
  type: 'Implication';
  operator: 'IMPLIES' | 'IFF';
  left: ASTNode;
  right: ASTNode;
}

export interface TranslationStep {
  step: number;
  description: string;
  inputFragment: string;
  outputFragment: string;
}

export interface TranslationResult {
  success: boolean;
  sql: string;
  steps: TranslationStep[];
  ast: ASTNode | null;
  error?: string;
  errorPosition?: number;
}

export interface SampleQuery {
  id: string;
  calculusType: CalculusType;
  query: string;
  description: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  expectedSql: string;
}

export interface QueryHistoryEntry {
  id: string;
  timestamp: number;
  calculusType: CalculusType;
  inputQuery: string;
  outputSql: string;
  steps: TranslationStep[];
}

export interface PracticeExercise {
  id: string;
  calculusType: CalculusType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  totalQuestions: number;
  answers: (number | null)[];
  completed: boolean;
}
