import { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { QuizMode } from '../components/practice/QuizMode';
import { ChallengeMode } from '../components/practice/ChallengeMode';
import { ExerciseList } from '../components/practice/ExerciseList';
import { ScoreTracker } from '../components/practice/ScoreTracker';
import { SpacedRepetition } from '../components/advanced/SpacedRepetition';
import { Target, Zap, BookOpen, Trophy, Brain } from 'lucide-react';

export function PracticePage() {
  const [activeTab, setActiveTab] = useState('quiz');

  const tabs = [
    { id: 'quiz', label: 'Quiz', icon: <Target size={16} /> },
    { id: 'challenge', label: 'Challenge', icon: <Zap size={16} /> },
    { id: 'exercises', label: 'Exercises', icon: <BookOpen size={16} /> },
    { id: 'scores', label: 'Scores', icon: <Trophy size={16} /> },
    { id: 'review', label: 'Review', icon: <Brain size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Practice &amp; Assess
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Test your understanding of TRC and DRC with quizzes, challenges, exercises, and spaced repetition review.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="animate-fade-in">
        {activeTab === 'quiz' && <QuizMode />}
        {activeTab === 'challenge' && <ChallengeMode />}
        {activeTab === 'exercises' && <ExerciseList />}
        {activeTab === 'scores' && <ScoreTracker />}
        {activeTab === 'review' && <SpacedRepetition />}
      </div>
    </div>
  );
}
