import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BookOpen, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { practiceExercises } from '../../engine/examples';
import { CalculusType } from '../../engine/types';

export function ExerciseList() {
  const [selectedType, setSelectedType] = useState<'all' | CalculusType>('all');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const filtered = selectedType === 'all'
    ? practiceExercises
    : practiceExercises.filter((e) => e.calculusType === selectedType);

  const handleAnswer = (exerciseId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: answerIndex }));
    setShowExplanations((prev) => ({ ...prev, [exerciseId]: true }));
  };

  const correctCount = filtered.filter((e) => answers[e.id] === e.correctIndex).length;
  const answeredCount = filtered.filter((e) => answers[e.id] !== undefined).length;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Practice Exercises</h3>
          </div>
          {answeredCount > 0 && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {correctCount}/{answeredCount} correct
            </span>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          {(['all', 'TRC', 'DRC'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                selectedType === type
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
      </Card>

      {filtered.map((exercise) => {
        const answered = answers[exercise.id] !== undefined;
        const isCorrect = answers[exercise.id] === exercise.correctIndex;
        const showExplanation = showExplanations[exercise.id];

        return (
          <Card key={exercise.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                exercise.difficulty === 'basic' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : exercise.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {exercise.difficulty}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{exercise.calculusType}</span>
            </div>

            <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap mb-4">
              {exercise.question}
            </p>

            <div className="space-y-2">
              {exercise.options.map((option, index) => {
                const isSelected = answers[exercise.id] === index;
                const showCorrect = answered && index === exercise.correctIndex;
                const showWrong = answered && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(exercise.id, index)}
                    disabled={answered}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                      showCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300'
                        : showWrong
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {showCorrect && <CheckCircle size={16} className="text-green-500" />}
                      {showWrong && <XCircle size={16} className="text-red-500" />}
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 animate-slide-up">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Explanation:</strong> {exercise.explanation}
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
