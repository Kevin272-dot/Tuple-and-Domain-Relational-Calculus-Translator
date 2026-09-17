import {
  Token,
  ASTNode,
  QueryNode,
  ConditionNode,
  BinaryOpNode,
  UnaryOpNode,
  QuantifierNode,
  AttributeNode,
  RelationNode,
  LiteralNode,
  VariableNode,
  ComparisonNode,
  CalculusType,
} from './types';
import { tokenize } from './tokenizer';

export class ParseError extends Error {
  position: number;
  line: number;
  column: number;

  constructor(message: string, position: number, line: number, column: number) {
    super(message);
    this.name = 'ParseError';
    this.position = position;
    this.line = line;
    this.column = column;
  }
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  private advance(): Token {
    const token = this.tokens[this.current];
    if (this.current < this.tokens.length - 1) {
      this.current++;
    }
    return token;
  }

  private expect(type: Token['type']): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new ParseError(
        `Expected ${type} but got ${token.type} ('${token.value}')`,
        token.position,
        token.line,
        token.column
      );
    }
    return this.advance();
  }

  private match(type: Token['type']): boolean {
    if (this.peek().type === type) {
      this.advance();
      return true;
    }
    return false;
  }

  private detectCalculusType(): CalculusType {
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.tokens[i].type === 'LBRACE') {
        if (
          i + 1 < this.tokens.length &&
          this.tokens[i + 1].type === 'IDENTIFIER'
        ) {
          if (
            i + 2 < this.tokens.length &&
            this.tokens[i + 2].type === 'PIPE'
          ) {
            return 'TRC';
          }
        }
        if (
          i + 1 < this.tokens.length &&
          this.tokens[i + 1].type === 'LT'
        ) {
          return 'DRC';
        }
      }
    }
    return 'TRC';
  }

  parse(): QueryNode {
    const calculusType = this.detectCalculusType();
    this.current = 0;

    this.expect('LBRACE');

    let tupleOrDomain: QueryNode['tupleOrDomain'];
    const variables: string[] = [];

    if (calculusType === 'TRC') {
      const varToken = this.expect('IDENTIFIER');
      variables.push(varToken.value);

      if (this.peek().type === 'DOT') {
        this.advance();
        const attrToken = this.expect('IDENTIFIER');
        variables.push(attrToken.value);
        tupleOrDomain = {
          type: 'TupleVariable',
          name: varToken.value,
          attributes: [attrToken.value],
        };
      } else {
        const attrs: string[] = [];
        if (this.peek().type === 'LBRACKET') {
          this.advance();
          while (this.peek().type !== 'RBRACKET') {
            attrs.push(this.expect('IDENTIFIER').value);
            if (this.peek().type === 'COMMA') this.advance();
          }
          this.expect('RBRACKET');
        }
        tupleOrDomain = {
          type: 'TupleVariable',
          name: varToken.value,
          attributes: attrs.length > 0 ? attrs : undefined,
        };
      }
    } else {
      this.expect('LT');
      while (this.peek().type !== 'GT') {
        const varToken = this.expect('IDENTIFIER');
        variables.push(varToken.value);
        if (this.peek().type === 'COMMA') this.advance();
      }
      this.expect('GT');
      tupleOrDomain = {
        type: 'DomainVariable',
        variables,
      };
    }

    this.expect('PIPE');
    const condition = this.parseImplication();

    this.expect('RBRACE');

    return {
      type: 'Query',
      calculusType,
      variables,
      tupleOrDomain,
      condition,
    };
  }

  private parseImplication(): ASTNode {
    let left = this.parseDisjunction();

    while (
      this.peek().type === 'IMPLIES' ||
      this.peek().type === 'IFF'
    ) {
      const op = this.advance();
      const right = this.parseDisjunction();
      left = {
        type: 'Implication',
        operator: op.type === 'IMPLIES' ? 'IMPLIES' : 'IFF',
        left,
        right,
      } as ASTNode;
    }

    return left;
  }

  private parseDisjunction(): ASTNode {
    let left = this.parseConjunction();

    while (this.peek().type === 'OR') {
      this.advance();
      const right = this.parseConjunction();
      left = {
        type: 'BinaryOp',
        operator: 'OR',
        left,
        right,
      };
    }

    return left;
  }

  private parseConjunction(): ASTNode {
    let left = this.parseNegation();

    while (this.peek().type === 'AND') {
      this.advance();
      const right = this.parseNegation();
      left = {
        type: 'BinaryOp',
        operator: 'AND',
        left,
        right,
      };
    }

    return left;
  }

  private parseNegation(): ASTNode {
    if (this.peek().type === 'NOT') {
      this.advance();
      const operand = this.parseQuantifier();
      return {
        type: 'UnaryOp',
        operator: 'NOT',
        operand,
      };
    }
    return this.parseQuantifier();
  }

  private parseQuantifier(): ASTNode {
    if (this.peek().type === 'FORALL' || this.peek().type === 'EXISTS') {
      const op = this.advance();
      const variable = this.expect('IDENTIFIER').value;
      this.expect('LPAREN');
      const expression = this.parseImplication();
      this.expect('RPAREN');
      return {
        type: 'Quantifier',
        operator: op.type as 'FORALL' | 'EXISTS',
        variable,
        expression,
      };
    }
    return this.parseComparison();
  }

  private parseComparison(): ASTNode {
    let left = this.parsePrimary();

    const comparisonOps = ['EQUALS', 'NOT_EQUALS', 'LT', 'GT', 'LTE', 'GTE'];
    if (comparisonOps.includes(this.peek().type)) {
      const opToken = this.advance();
      const right = this.parsePrimary();
      const opMap: Record<string, ComparisonNode['operator']> = {
        EQUALS: '=',
        NOT_EQUALS: '!=',
        LT: '<',
        GT: '>',
        LTE: '<=',
        GTE: '>=',
      };
      return {
        type: 'Comparison',
        operator: opMap[opToken.type],
        left,
        right,
      };
    }

    return left;
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === 'LPAREN') {
      this.advance();
      const expr = this.parseImplication();
      this.expect('RPAREN');
      return expr;
    }

    // DRC: <v1, v2, ...> in Relation
    if (token.type === 'LT') {
      this.advance();
      const vars: string[] = [];
      while (this.peek().type !== 'GT') {
        vars.push(this.expect('IDENTIFIER').value);
        if (this.peek().type === 'COMMA') this.advance();
      }
      this.expect('GT');

      if (this.peek().type === 'IN') {
        this.advance();
        const relation = this.expect('IDENTIFIER').value;
        return {
          type: 'Relation',
          variable: vars.join(','),
          relation,
        };
      }

      return {
        type: 'Variable',
        name: `<${vars.join(',')}>`,
      };
    }

    if (token.type === 'IDENTIFIER') {
      this.advance();

      if (this.peek().type === 'DOT') {
        this.advance();
        const attr = this.expect('IDENTIFIER').value;
        return {
          type: 'Attribute',
          variable: token.value,
          attribute: attr,
        };
      }

      if (this.peek().type === 'IN') {
        this.advance();
        const relation = this.expect('IDENTIFIER').value;
        return {
          type: 'Relation',
          variable: token.value,
          relation,
        };
      }

      return {
        type: 'Variable',
        name: token.value,
      };
    }

    if (token.type === 'STRING_LITERAL') {
      this.advance();
      return {
        type: 'Literal',
        value: token.value,
      };
    }

    if (token.type === 'NUMBER') {
      this.advance();
      return {
        type: 'Literal',
        value: parseFloat(token.value),
      };
    }

    throw new ParseError(
      `Unexpected token ${token.type} ('${token.value}')`,
      token.position,
      token.line,
      token.column
    );
  }
}

export function parseQuery(input: string): QueryNode {
  const tokens = tokenize(input);
  const parser = new Parser(tokens);
  return parser.parse();
}
