import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Calculator } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <main className="max-w-content mx-auto px-4 sm:px-6 py-8">{children}</main>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <Calculator size={16} />
              <span>TRC/DRC Translator</span>
            </div>
            <div className="text-center text-xs text-slate-400 dark:text-slate-500">
              Database Systems Project — VIT University
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Kevin Daniel (25BCE1823)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
