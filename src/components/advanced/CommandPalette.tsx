import { useState, useEffect, useRef } from 'react';
import { Search, Calculator, BookOpen, Target, HelpCircle, User, Download, Sun, Moon, Command } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { generateReport } from '../../utils/reportGenerator';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  shortcut?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setActiveTab, setBuilderOpen, queryHistory } = useApp();
  const { toggleTheme, theme } = useTheme();

  const commands: CommandItem[] = [
    { id: 'simulator', label: 'Go to Simulator', icon: <Calculator size={16} />, action: () => { setActiveTab('simulator'); setOpen(false); }, category: 'Navigation', shortcut: 'Ctrl+1' },
    { id: 'learn', label: 'Go to Learn', icon: <BookOpen size={16} />, action: () => { setActiveTab('learn'); setOpen(false); }, category: 'Navigation', shortcut: 'Ctrl+2' },
    { id: 'practice', label: 'Go to Practice', icon: <Target size={16} />, action: () => { setActiveTab('practice'); setOpen(false); }, category: 'Navigation', shortcut: 'Ctrl+3' },
    { id: 'help', label: 'Go to Help', icon: <HelpCircle size={16} />, action: () => { setActiveTab('help'); setOpen(false); }, category: 'Navigation', shortcut: 'Ctrl+4' },
    { id: 'builder', label: 'Open Builder Info', icon: <User size={16} />, action: () => { setBuilderOpen(true); setOpen(false); }, category: 'Navigation' },
    { id: 'theme', label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, icon: theme === 'light' ? <Moon size={16} /> : <Sun size={16} />, action: () => { toggleTheme(); setOpen(false); }, category: 'Settings', shortcut: 'Ctrl+D' },
    { id: 'download', label: 'Download Report', icon: <Download size={16} />, action: () => { handleDownload(); setOpen(false); }, category: 'Actions', shortcut: 'Ctrl+S' },
    { id: 'clear-history', label: 'Clear Query History', icon: <Command size={16} />, action: () => { localStorage.removeItem('trc-history'); window.location.reload(); }, category: 'Actions' },
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleDownload = () => {
    const reportContent = generateReport(queryHistory);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trc-drc-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selectedIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No commands found
            </div>
          ) : (
            filtered.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-slate-400 dark:text-slate-500">{cmd.icon}</span>
                <span className="flex-1 text-left">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
