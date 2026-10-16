import { useRef, useMemo } from 'react';
import { tokenize } from '../../engine/tokenizer';

interface HighlightedEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  ariaLabel?: string;
}

interface Segment {
  text: string;
  cls: string;
}

const TOKEN_CLASSES: Record<string, string> = {
  AND: 'text-violet-600 dark:text-violet-400 font-semibold',
  OR: 'text-violet-600 dark:text-violet-400 font-semibold',
  NOT: 'text-rose-600 dark:text-rose-400 font-semibold',
  IMPLIES: 'text-amber-600 dark:text-amber-400 font-semibold',
  IFF: 'text-amber-600 dark:text-amber-400 font-semibold',
  FORALL: 'text-emerald-600 dark:text-emerald-400 font-semibold',
  EXISTS: 'text-emerald-600 dark:text-emerald-400 font-semibold',
  IN: 'text-cyan-700 dark:text-cyan-400 font-semibold',
  STRING_LITERAL: 'text-orange-600 dark:text-orange-400',
  NUMBER: 'text-blue-600 dark:text-blue-400',
  IDENTIFIER: 'text-sky-700 dark:text-sky-300',
  LBRACE: 'text-primary-600 dark:text-primary-400 font-semibold',
  RBRACE: 'text-primary-600 dark:text-primary-400 font-semibold',
  PIPE: 'text-primary-600 dark:text-primary-400 font-semibold',
  LT: 'text-primary-600 dark:text-primary-400 font-semibold',
  GT: 'text-primary-600 dark:text-primary-400 font-semibold',
  EOF: '',
};

const DEFAULT_CLS = 'text-slate-500 dark:text-slate-400';

function buildSegments(value: string): Segment[] {
  try {
    const tokens = tokenize(value);
    const segments: Segment[] = [];
    let cursor = 0;
    for (const tok of tokens) {
      if (tok.position > cursor) {
        segments.push({ text: value.slice(cursor, tok.position), cls: DEFAULT_CLS });
      }
      const len = Math.max(1, tok.value.length);
      const text = value.slice(tok.position, tok.position + len);
      segments.push({ text, cls: TOKEN_CLASSES[tok.type] ?? DEFAULT_CLS });
      cursor = tok.position + len;
    }
    if (cursor < value.length) {
      segments.push({ text: value.slice(cursor), cls: DEFAULT_CLS });
    }
    return segments;
  } catch {
    return [{ text: value, cls: DEFAULT_CLS }];
  }
}

export function HighlightedEditor({
  value,
  onChange,
  placeholder,
  className = '',
  onKeyDown,
  ariaLabel,
}: HighlightedEditorProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const segments = useMemo(() => (value ? buildSegments(value) : []), [value]);

  const handleScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const shared = `${className} p-4 font-mono text-sm leading-6 rounded-xl border`;

  return (
    <div className="relative">
      <pre
        ref={preRef}
        aria-hidden="true"
        className={`${shared} absolute inset-0 overflow-hidden whitespace-pre-wrap break-words bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 pointer-events-none m-0`}
      >
        {segments.length > 0 &&
          segments.map((seg, i) => (
            <span key={i} className={seg.cls}>{seg.text}</span>
          ))}
        {'\n'}
      </pre>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        spellCheck={false}
        placeholder={placeholder}
        className={`${shared} relative bg-transparent text-transparent caret-primary-600 dark:caret-primary-400 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 selection:bg-primary-200 dark:selection:bg-primary-800`}
      />
    </div>
  );
}
