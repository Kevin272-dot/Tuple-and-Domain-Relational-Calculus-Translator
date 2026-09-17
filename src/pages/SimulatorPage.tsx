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
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { TranslationResult, CalculusType } from '../engine/types';
import { useApp } from '../context/AppContext';
import { Calculator, GitBranch, Scale, Wand2, Database } from 'lucide-react';

export function SimulatorPage() {
  const { selectedCalculus } = useApp();
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

  const subTabs = [
    { id: 'translate', label: 'Translate', icon: <Calculator size={16} /> },
    { id: 'tree', label: 'Predicate Tree', icon: <GitBranch size={16} /> },
    { id: 'equivalence', label: 'Equivalence', icon: <Scale size={16} /> },
    { id: 'generate', label: 'AI Generator', icon: <Wand2 size={16} /> },
    { id: 'schema', label: 'Schema', icon: <Database size={16} /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            TRC/DRC to SQL Translator
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Write a Tuple or Domain Relational Calculus query and get the equivalent SQL
            with a step by step breakdown.
          </p>
        </div>

        <Tabs tabs={subTabs} activeTab={activeSubTab} onChange={setActiveSubTab} />

        {activeSubTab === 'translate' && (
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

        {activeSubTab === 'tree' && (
          <div className="animate-fade-in">
            <PredicateTree />
          </div>
        )}

        {activeSubTab === 'equivalence' && (
          <div className="animate-fade-in">
            <EquivalenceChecker />
          </div>
        )}

        {activeSubTab === 'generate' && (
          <div className="animate-fade-in">
            <AiQueryGenerator />
          </div>
        )}

        {activeSubTab === 'schema' && (
          <div className="animate-fade-in">
            <RelationViewer />
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
