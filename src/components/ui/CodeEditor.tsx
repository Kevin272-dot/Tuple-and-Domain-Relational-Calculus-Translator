import { useState, useRef, useCallback } from 'react';
import { tokenize } from '../../engine/tokenizer';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
}

function getTokenColor(tokenType: string): string {
  switch (tokenType) {
    case 'LBRACE':
    case 'RBRACE':
      return 'text-amber-600 dark:text-amber-400';
    case 'PIPE':
      return 'text-primary-600 dark:text-primary-400 font-bold';
    case 'AND':
    case 'OR':
    case 'NOT':
    case 'IMPLIES':
    case 'IFF':
      return 'text-violet-600 dark:text-violet-400 font-medium';
    case 'FORALL':
    case 'EXISTS':
      return 'text-emerald-600 dark:text-emerald-400 font-bold';
    case 'IN':
      return 'text-cyan-600 dark:text-cyan-400 font-medium';
    case 'EQUALS':
    case 'NOT_EQUALS':
    case 'LT':
    case 'GT':
    case 'LTE':
    case 'GTE':
      return 'text-rose-600 dark:text-rose-400';
    case 'STRING_LITERAL':
      return 'text-green-600 dark:text-green-400';
    case 'NUMBER':
      return 'text-orange-600 dark:text-orange-400';
    case 'IDENTIFIER':
      return 'text-slate-800 dark:text-slate-200';
    default:
      return 'text-slate-500 dark:text-slate-400';
  }
}

export function CodeEditor({ value, onChange, placeholder, onKeyDown, className = '' }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const getHighlightedHTML = useCallback(() => {
    if (!value) return '';
    try {
      const tokens = tokenize(value);
      let html = '';
      let pos = 0;

      for (const token of tokens) {
        if (token.type === 'EOF') break;
        if (token.position > pos) {
          html += escapeHTML(value.substring(pos, token.position));
        }
        const colorClass = getTokenColor(token.type);
        html += `<span class="${colorClass}">${escapeHTML(token.value)}</span>`;
        pos = token.position + token.value.length;
      }
      if (pos < value.length) {
        html += escapeHTML(value.substring(pos));
      }
      return html;
    } catch {
      return escapeHTML(value);
    }
  }, [value]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none overflow-hidden whitespace-pre-wrap break-words"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: getHighlightedHTML() + '\n' }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="w-full h-32 p-4 font-mono text-sm bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl text-transparent caret-primary-600 dark:caret-primary-400 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
