import { useState } from 'react';
import { Calculator, BookOpen, Target, HelpCircle, User, Download, Menu, X, FileText } from 'lucide-react';
import { ThemeToggle } from '../ui/Toggle';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { generateReport, generatePDFReport } from '../../utils/reportGenerator';

const navItems = [
  { id: 'simulator', label: 'Simulator', icon: <Calculator size={18} /> },
  { id: 'learn', label: 'Learn', icon: <BookOpen size={18} /> },
  { id: 'practice', label: 'Practice', icon: <Target size={18} /> },
  { id: 'help', label: 'Help', icon: <HelpCircle size={18} /> },
];

export function Navbar() {
  const { activeTab, setActiveTab, setBuilderOpen, queryHistory } = useApp();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const handleDownloadText = () => {
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
    setDownloadMenuOpen(false);
  };

  const handleDownloadPDF = () => {
    generatePDFReport(queryHistory);
    setDownloadMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Calculator size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white hidden sm:block">
              TRC/DRC Translator
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                title="Download Report"
              >
                <Download size={16} />
                <span className="hidden lg:inline">Download</span>
              </button>
              {downloadMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDownloadMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 animate-slide-up">
                    <button
                      onClick={handleDownloadText}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-t-lg"
                    >
                      <Download size={14} />
                      Download as Text
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-b-lg"
                    >
                      <FileText size={14} />
                      Download as PDF
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setBuilderOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <User size={16} />
              <span className="hidden lg:inline">Builder</span>
            </button>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <hr className="border-slate-200 dark:border-slate-700 my-2" />
              <button
                onClick={() => {
                  handleDownloadText();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Download size={16} />
                Download Report (Text)
              </button>
              <button
                onClick={() => {
                  handleDownloadPDF();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <FileText size={16} />
                Download Report (PDF)
              </button>
              <button
                onClick={() => {
                  setBuilderOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <User size={16} />
                Builder
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
