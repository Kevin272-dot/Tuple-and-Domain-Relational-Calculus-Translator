import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { BuilderModal } from './components/builder/BuilderModal';
import { CommandPalette } from './components/advanced/CommandPalette';
import { SimulatorPage } from './pages/SimulatorPage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { HelpPage } from './pages/HelpPage';
import { useApp } from './context/AppContext';
import { useTheme } from './context/ThemeContext';
import { generateReport } from './utils/reportGenerator';

function App() {
  const { activeTab, setActiveTab, queryHistory } = useApp();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveTab('simulator');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('learn');
            break;
          case '3':
            e.preventDefault();
            setActiveTab('practice');
            break;
          case '4':
            e.preventDefault();
            setActiveTab('help');
            break;
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
          case 's':
            e.preventDefault();
            handleDownload();
            break;
          case 'l':
            e.preventDefault();
            const textarea = document.querySelector('textarea');
            if (textarea) {
              textarea.value = '';
              textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
            break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setActiveTab, toggleTheme, queryHistory]);

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

  const renderPage = () => {
    switch (activeTab) {
      case 'simulator':
        return <SimulatorPage />;
      case 'learn':
        return <LearnPage />;
      case 'practice':
        return <PracticePage />;
      case 'help':
        return <HelpPage />;
      default:
        return <SimulatorPage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
      <BuilderModal />
      <CommandPalette />
    </Layout>
  );
}

export default App;
