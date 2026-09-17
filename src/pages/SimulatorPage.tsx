import { useState } from 'react';
import { QueryInput } from '../components/simulator/QueryInput';
import { SampleQueries } from '../components/simulator/SampleQueries';
import { OperatorReference } from '../components/simulator/OperatorReference';
import { StepByStep } from '../components/simulator/StepByStep';
import { QueryHistory } from '../components/simulator/QueryHistory';
import { AiExplainer } from '../components/ai/AiExplainer';
import { AiErrorCorrector } from '../components/ai/AiErrorCorrector';
import { SyntaxChecker } from '../components/ai/SyntaxChecker';
import { AiChat } from '../components/ai/AiChat';
import { RelationViewer } from '../components/simulator/RelationViewer';
import { EquivalenceChecker } from '../components/advanced/EquivalenceChecker';
import { PredicateTree } from '../components/advanced/PredicateTree';
import { AiQueryGenerator } from '../components/advanced/AiQueryGenerator';
import { UserSchemaEditor } from '../components/simulator/UserSchemaEditor';
import { ExecutePanel } from '../components/simulator/ExecutePanel';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { TranslationResult, CalculusType } from '../engine/types';
import { useApp } from '../context/AppContext';
import { Calculator, GitBranch, Scale, Wand2, Database, Play, BookOpen } from 'lucide-react';

export function SimulatorPage() {
  const { selectedCalculus, simulatorMode, setSimulatorMode } = useApp();
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [query, setQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('translate');

  const handleResult = (r: TranslationResult | null) => {
    setResult(r);
  };

  const handleSampleSelect = (q: string) => {
    setQuery(q);
  };

  const handleHistoryRerun = (q: string) => {
    setQuery(q);
  };

  const translateTabs = [
    { id: 'translate', label: 'Translate', icon: <Calculator size={16} /> },
    { id: 'tree', label: 'Predicate Tree', icon: <GitBranch size={16} /> },
    { id: 'equivalence', label: 'Equivalence', icon: <Scale size={16} /> },
    { id: 'generate', label: 'AI Generator', icon: <Wand2 size={16} /> },
    { id: 'schema', label: 'Schema', icon: <Database size={16} /> },
  ];

  const executeTabs = [
    { id: 'schema', label: 'Define Schema', icon: <Database size={16} /> },
    { id: 'execute', label: 'Run Query', icon: <Play size={16} /> },
  ];

  const currentTabs = simulatorMode === 'translate' ? translateTabs : executeTabs;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            TRC/DRC to SQL Translator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Write a Tuple or Domain Relational Calculus query and get the equivalent SQL
            with a step by step breakdown.
          </p>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
            <button
              onClick={() => setSimulatorMode('translate')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                simulatorMode === 'translate'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen size={16} />
              Translate
            </button>
            <button
              onClick={() => setSimulatorMode('execute')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                simulatorMode === 'execute'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Play size={16} />
              Define & Execute
            </button>
          </div>
        </div>

        <Tabs tabs={currentTabs} activeTab={activeSubTab} onChange={setActiveSubTab} />

        {simulatorMode === 'translate' && activeSubTab === 'translate' && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <QueryInput onResult={handleResult} externalQuery={query} onQueryChange={setQuery} />
            </Card>

            {result && result.steps.length > 0 && (
              <Card>
                <StepByStep steps={result.steps} />
              </Card>
            )}

            <SyntaxChecker query={query} calculusType={selectedCalculus} />
            <AiErrorCorrector query={query} />
            <AiExplainer query={query} />
          </div>
        )}

        {simulatorMode === 'translate' && activeSubTab === 'tree' && (
          <div className="animate-fade-in">
            <PredicateTree />
          </div>
        )}

        {simulatorMode === 'translate' && activeSubTab === 'equivalence' && (
          <div className="animate-fade-in">
            <EquivalenceChecker />
          </div>
        )}

        {simulatorMode === 'translate' && activeSubTab === 'generate' && (
          <div className="animate-fade-in">
            <AiQueryGenerator />
          </div>
        )}

        {simulatorMode === 'translate' && activeSubTab === 'schema' && (
          <div className="animate-fade-in">
            <RelationViewer />
          </div>
        )}

        {simulatorMode === 'execute' && activeSubTab === 'schema' && (
          <div className="animate-fade-in">
            <UserSchemaEditor />
          </div>
        )}

        {simulatorMode === 'execute' && activeSubTab === 'execute' && (
          <div className="animate-fade-in">
            <ExecutePanel />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card padding="sm">
          <SampleQueries
            onSelect={handleSampleSelect}
            calculusType={selectedCalculus as CalculusType}
          />
        </Card>

        <Card padding="sm">
          <OperatorReference />
        </Card>

        <QueryHistory onRerun={handleHistoryRerun} />
      </div>

      <AiChat currentQuery={query} />
    </div>
  );
}
