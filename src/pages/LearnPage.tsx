import { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { ConceptExplanation } from '../components/learn/ConceptExplanation';
import { AnimatedVideo } from '../components/learn/AnimatedVideo';
import { References } from '../components/learn/References';
import { BookOpen, Video, BookMarked } from 'lucide-react';

export function LearnPage() {
  const [activeTab, setActiveTab] = useState('concepts');

  const tabs = [
    { id: 'concepts', label: 'Concepts', icon: <BookOpen size={16} /> },
    { id: 'video', label: 'Video', icon: <Video size={16} /> },
    { id: 'references', label: 'References', icon: <BookMarked size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Learn Relational Calculus
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Understand the fundamentals of Tuple and Domain Relational Calculus and how
          they relate to SQL.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="animate-fade-in">
        {activeTab === 'concepts' && <ConceptExplanation />}
        {activeTab === 'video' && <AnimatedVideo />}
        {activeTab === 'references' && <References />}
      </div>
    </div>
  );
}
