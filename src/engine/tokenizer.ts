import { Token, TokenType } from './types';

const SYMBOL_MAP: Record<string, TokenType> = {
  '{': 'LBRACE',
  '}': 'RBRACE',
  '(': 'LPAREN',
  ')': 'RPAREN',
  '[': 'LBRACKET',
  ']': 'RBRACKET',
  '|': 'PIPE',
  ',': 'COMMA',
  '.': 'DOT',
  ':': 'COLON',
  '=': 'EQUALS',
  '<': 'LT',
  '>': 'GT',
};

const KEYWORD_MAP: Record<string, TokenType> = {
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  IMPLIES: 'IMPLIES',
  IFF: 'IFF',
  FORALL: 'FORALL',
  EXISTS: 'EXISTS',
  IN: 'IN',
};

const SYMBOL_TOKENS = '(){},[].|:=<>';

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  let line = 1;
  let column = 1;

  function peek(): string {
    return pos < input.length ? input[pos] : '';
  }

  function advance(): string {
    const ch = input[pos];
    pos++;
    if (ch === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
    return ch;
  }

  function skipWhitespace(): void {
    while (pos < input.length && /\s/.test(input[pos])) {
      advance();
    }
  }

  function readString(): string {
    const quote = advance();
    let value = '';
    while (pos < input.length && input[pos] !== quote) {
      if (input[pos] === '\\') {
        advance();
        value += advance();
      } else {
        value += advance();
      }
    }
    if (pos < input.length) advance();
    return value;
  }

  function readNumber(): string {
    let value = '';
    while (pos < input.length && /[\d.]/.test(input[pos])) {
      value += advance();
    }
    return value;
  }

  function readIdentifier(): string {
    let value = '';
    while (pos < input.length && /[a-zA-Z0-9_]/.test(input[pos])) {
      value += advance();
    }
    return value;
  }

  while (pos < input.length) {
    skipWhitespace();
    if (pos >= input.length) break;

    const startLine = line;
    const startCol = column;
    const startPos = pos;
    const ch = peek();

    if (ch === '\n' || ch === '\r') {
      advance();
      continue;
    }

    if (ch === "'" || ch === '"') {
      const value = readString();
      tokens.push({
        type: 'STRING_LITERAL',
        value,
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (/\d/.test(ch)) {
      const value = readNumber();
      tokens.push({
        type: 'NUMBER',
        value,
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (SYMBOL_TOKENS.includes(ch)) {
      advance();
      if (ch === '<' && peek() === '=') {
        advance();
        tokens.push({
          type: 'LTE',
          value: '<=',
          position: startPos,
          line: startLine,
          column: startCol,
        });
      } else if (ch === '>' && peek() === '=') {
        advance();
        tokens.push({
          type: 'GTE',
          value: '>=',
          position: startPos,
          line: startLine,
          column: startCol,
        });
      } else if (ch === '!' && peek() === '=') {
        advance();
        tokens.push({
          type: 'NOT_EQUALS',
          value: '!=',
          position: startPos,
          line: startLine,
          column: startCol,
        });
      } else if (ch === '<' && peek() === '>') {
        advance();
        tokens.push({
          type: 'NOT_EQUALS',
          value: '<>',
          position: startPos,
          line: startLine,
          column: startCol,
        });
      } else if (ch === '-' && peek() === '>') {
        advance();
        tokens.push({
          type: 'IMPLIES',
          value: '->',
          position: startPos,
          line: startLine,
          column: startCol,
        });
      } else if (ch === '<' && peek() === '-') {
        advance();
        if (peek() === '>') {
          advance();
          tokens.push({
            type: 'IFF',
            value: '<->',
            position: startPos,
            line: startLine,
            column: startCol,
          });
        } else {
          tokens.push({
            type: SYMBOL_MAP[ch],
            value: ch,
            position: startPos,
            line: startLine,
            column: startCol,
          });
        }
      } else {
        tokens.push({
          type: SYMBOL_MAP[ch],
          value: ch,
          position: startPos,
          line: startLine,
          column: startCol,
        });
      }
      continue;
    }

    if (ch === '∧' || ch === '∧') {
      advance();
      tokens.push({
        type: 'AND',
        value: '∧',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '∨' || ch === '∨') {
      advance();
      tokens.push({
        type: 'OR',
        value: '∨',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '¬' || ch === '¬') {
      advance();
      tokens.push({
        type: 'NOT',
        value: '¬',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '∀' || ch === '∀') {
      advance();
      tokens.push({
        type: 'FORALL',
        value: '∀',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '∃' || ch === '∃') {
      advance();
      tokens.push({
        type: 'EXISTS',
        value: '∃',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '∈' || ch === '∈') {
      advance();
      tokens.push({
        type: 'IN',
        value: '∈',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '→' || ch === '→') {
      advance();
      tokens.push({
        type: 'IMPLIES',
        value: '→',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (ch === '↔' || ch === '↔') {
      advance();
      tokens.push({
        type: 'IFF',
        value: '↔',
        position: startPos,
        line: startLine,
        column: startCol,
      });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      const value = readIdentifier();
      const upper = value.toUpperCase();
      if (KEYWORD_MAP[upper]) {
        tokens.push({
          type: KEYWORD_MAP[upper],
          value: upper,
          position: startPos,
          line: startLine,
          column: startCol,
        });
      } else {
        tokens.push({
          type: 'IDENTIFIER',
          value,
          position: startPos,
          line: startLine,
          column: startCol,
        });
      }
      continue;
    }

    advance();
    tokens.push({
      type: SYMBOL_MAP[ch] || 'IDENTIFIER',
      value: ch,
      position: startPos,
      line: startLine,
      column: startCol,
    });
  }

  tokens.push({
    type: 'EOF',
    value: '',
    position: pos,
    line,
    column,
  });

  return tokens;
}
