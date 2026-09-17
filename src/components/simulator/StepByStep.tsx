import {
  Code,
  ArrowRight,
  ArrowDown,
  FileCode,
  Database,
  Filter,
  Table,
} from 'lucide-react';

interface StepByStepProps {
  steps: {
    step: number;
    description: string;
    inputFragment: string;
    outputFragment: string;
  }[];
}

export function StepByStep({ steps }: StepByStepProps) {
  if (steps.length === 0) return null;

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Code size={18} />;
      case 2:
        return <Database size={18} />;
      case 3:
        return <Filter size={18} />;
      case 4:
        return <Table size={18} />;
      default:
        return <FileCode size={18} />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <ArrowRight size={20} className="text-primary-600 dark:text-primary-400" />
        Translation Pipeline
      </h3>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex gap-4">
              <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-700 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300">
                {getStepIcon(step.step)}
              </div>

              <div className="flex-1 pb-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                      Step {step.step}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Input
                      </span>
                      <code className="block mt-1 text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                        {step.inputFragment}
                      </code>
                    </div>

                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                        Output
                      </span>
                      <code className="block mt-1 text-xs font-mono text-primary-700 dark:text-primary-300 break-all">
                        {step.outputFragment}
                      </code>
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex justify-center mt-3">
                    <ArrowDown
                      size={20}
                      className="text-slate-300 dark:text-slate-600"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
