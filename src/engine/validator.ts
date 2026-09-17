import { tokenize } from './tokenizer';
import { Parser, ParseError } from './parser';
import { CalculusType } from './types';
import { SQL_RESERVED_WORDS, MAX_QUERY_LENGTH } from './constants';

export interface ValidationError {
  type: 'syntax' | 'semantic' | 'style';
  message: string;
  position?: number;
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
  ast: ReturnType<typeof parse> | null;
}

export function validateQuery(input: string, calculusType: CalculusType = 'TRC'): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const info: ValidationError[] = [];
  let ast: ReturnType<typeof parse> | null = null;

  const q = input.trim();

  if (!q) {
    errors.push({
      type: 'syntax',
      message: 'Query is empty. Enter a TRC or DRC query.',
      severity: 'error',
    });
    return { valid: false, errors, warnings, info, ast: null };
  }

  if (q.length > MAX_QUERY_LENGTH) {
    errors.push({
      type: 'syntax',
      message: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters.`,
      severity: 'error',
    });
  }

  if (!q.startsWith('{')) {
    errors.push({
      type: 'syntax',
      message: 'Query must start with { (opening curly brace).',
      severity: 'error',
    });
  }

  if (!q.endsWith('}')) {
    errors.push({
      type: 'syntax',
      message: 'Query must end with } (closing curly brace).',
      severity: 'error',
    });
  }

  const inner = q.length >= 2 ? q.slice(1, -1).trim() : '';
  if (!inner.includes('|')) {
    errors.push({
      type: 'syntax',
      message: 'Missing pipe | separator. Expected format: {variables | condition}',
      severity: 'error',
    });
  }

  if (inner.includes('|')) {
    const pipeIndex = inner.indexOf('|');
    const vars = inner.slice(0, pipeIndex).trim();
    const cond = inner.slice(pipeIndex + 1).trim();

    if (calculusType === 'TRC') {
      if (vars.includes('<') || vars.includes('>')) {
        warnings.push({
          type: 'style',
          message: 'TRC uses tuple variables (e.g., T), not angle brackets. Consider using DRC for <var1, var2> syntax.',
          severity: 'warning',
        });
      }
    }

    if (calculusType === 'DRC') {
      if (!vars.startsWith('<')) {
        errors.push({
          type: 'syntax',
          message: 'DRC requires angle brackets for domain variables. Example: {<name, age> | ...}',
          severity: 'error',
        });
      }
      if (vars.startsWith('<') && !vars.endsWith('>')) {
        errors.push({
          type: 'syntax',
          message: 'Unclosed angle bracket in domain variables. Expected > before the pipe.',
          severity: 'error',
        });
      }
    }

    if (cond) {
      const lowerCond = cond.toLowerCase();
      if (lowerCond.includes(' select ') || lowerCond.includes(' from ') || lowerCond.includes(' where ')) {
        warnings.push({
          type: 'style',
          message: 'It looks like you may have written SQL instead of TRC/DRC. Use relational calculus syntax.',
          severity: 'warning',
        });
      }
    }
  }

  const openParens = (q.match(/\(/g) || []).length;
  const closeParens = (q.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push({
      type: 'syntax',
      message: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing.`,
      severity: 'error',
    });
  }

  const openAngles = (q.match(/</g) || []).length;
  const closeAngles = (q.match(/>/g) || []).length;
  if (openAngles !== closeAngles) {
    errors.push({
      type: 'syntax',
      message: `Mismatched angle brackets: ${openAngles} opening, ${closeAngles} closing.`,
      severity: 'error',
    });
  }

  const openBraces = (q.match(/{/g) || []).length;
  const closeBraces = (q.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({
      type: 'syntax',
      message: `Mismatched curly braces: ${openBraces} opening, ${closeBraces} closing.`,
      severity: 'error',
    });
  }

  if (q.includes("'")) {
    const quotes = q.split("'");
    if (quotes.length % 2 === 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed string literal. Check that all single quotes are matched.',
        severity: 'error',
      });
    }
  }

  if (q.includes('"')) {
    const quotes = q.split('"');
    if (quotes.length % 2 === 0) {
      errors.push({
        type: 'syntax',
        message: 'Unclosed string literal. Check that all double quotes are matched.',
        severity: 'error',
      });
    }
  }

  const tokens = tokenize(q);
  for (const token of tokens) {
    if (token.type === 'IDENTIFIER') {
      const upper = token.value.toUpperCase();
      if (SQL_RESERVED_WORDS.includes(upper)) {
        info.push({
          type: 'style',
          message: `"${token.value}" is a SQL reserved word. Consider using a different name to avoid confusion.`,
          position: token.position,
          line: token.line,
          column: token.column,
          severity: 'info',
        });
      }
    }
  }

  try {
    ast = parse(q);
  } catch (e) {
    if (e instanceof ParseError) {
      errors.push({
        type: 'syntax',
        message: `Parse error: ${e.message}`,
        position: e.position,
        line: e.line,
        column: e.column,
        severity: 'error',
      });
    } else {
      errors.push({
        type: 'syntax',
        message: e instanceof Error ? e.message : 'Unknown parse error',
        severity: 'error',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info,
    ast,
  };
}

function parse(input: string) {
  const tokens = tokenize(input.trim());
  const parser = new Parser(tokens);
  return parser.parse();
}

export function getErrorAtPosition(input: string, position: number): { line: number; column: number; context: string } {
  const lines = input.substring(0, position).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  const inputLines = input.split('\n');
  const context = inputLines[line - 1] || '';
  return { line, column, context };
}

export function suggestFix(input: string, error: ValidationError): string | null {
  if (error.message.includes('Missing pipe')) {
    const match = input.match(/^\{([^|]*)\}$/);
    if (match) {
      return `{${match[1]} | true}`;
    }
  }

  if (error.message.includes('Missing curly brace')) {
    if (!input.includes('{')) return `{${input}}`;
    if (!input.includes('}')) return `${input}}`;
  }

  if (error.message.includes('Missing "in" operator')) {
    const match = input.match(/\{(\w+)\s*\|/);
    if (match) {
      const varName = match[1];
      return input.replace(
        `{${varName} |`,
        `{${varName} | ${varName} in Relation AND`
      );
    }
  }

  return null;
}
