import { createContext, useContext, useState, ReactNode } from 'react';
import { QueryHistoryEntry, CalculusType } from '../engine/types';

export interface UserTable {
  name: string;
  columns: string[];
  rows: (string | number)[][];
}

type SimulatorMode = 'translate' | 'execute';

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
  simulatorMode: SimulatorMode;
  setSimulatorMode: (mode: SimulatorMode) => void;
  userSchema: UserTable[];
  setUserSchema: (tables: UserTable[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SCHEMA: UserTable[] = [
  { name: 'Students', columns: ['name', 'age', 'dept', 'gpa'], rows: [
    ['Alice', 21, 'CS', 3.8], ['Bob', 22, 'Math', 3.5], ['Charlie', 20, 'CS', 3.9],
    ['Diana', 23, 'Physics', 3.2], ['Eve', 21, 'CS', 3.7], ['Frank', 22, 'Math', 3.1],
  ]},
  { name: 'Enrollment', columns: ['student', 'course', 'grade'], rows: [
    ['Alice', 'DBMS', 'A'], ['Alice', 'OS', 'B'], ['Bob', 'DBMS', 'A'],
    ['Charlie', 'DBMS', 'A'], ['Charlie', 'Networks', 'B'], ['Eve', 'DBMS', 'B'],
  ]},
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('simulator');
  const [selectedCalculus, setSelectedCalculus] = useState<CalculusType>('TRC');
  const [isBuilderOpen, setBuilderOpen] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('translate');

  const [userSchema, setUserSchema] = useState<UserTable[]>(() => {
    try {
      const saved = localStorage.getItem('trc-user-schema');
      return saved ? JSON.parse(saved) : DEFAULT_SCHEMA;
    } catch {
      return DEFAULT_SCHEMA;
    }
  });

  const handleSetUserSchema = (tables: UserTable[]) => {
    setUserSchema(tables);
    localStorage.setItem('trc-user-schema', JSON.stringify(tables));
  };

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
        simulatorMode,
        setSimulatorMode,
        userSchema,
        setUserSchema: handleSetUserSchema,
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
