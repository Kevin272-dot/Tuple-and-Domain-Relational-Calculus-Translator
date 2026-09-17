import { createContext, useContext, useState, ReactNode } from 'react';
import { QueryHistoryEntry, CalculusType } from '../engine/types';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  queryHistory: QueryHistoryEntry[];
  addToHistory: (entry: QueryHistoryEntry) => void;
  clearHistory: () => void;
  selectedCalculus: CalculusType;
  setSelectedCalculus: (c: CalculusType) => void;
  isBuilderOpen: boolean;
  setBuilderOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('simulator');
  const [selectedCalculus, setSelectedCalculus] = useState<CalculusType>('TRC');
  const [isBuilderOpen, setBuilderOpen] = useState(false);

  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('trc-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToHistory = (entry: QueryHistoryEntry) => {
    setQueryHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      localStorage.setItem('trc-history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem('trc-history');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        queryHistory,
        addToHistory,
        clearHistory,
        selectedCalculus,
        setSelectedCalculus,
        isBuilderOpen,
        setBuilderOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
