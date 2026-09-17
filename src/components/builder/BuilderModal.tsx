import { Modal } from '../ui/Modal';
import { User, Mail, GraduationCap, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function BuilderModal() {
  const { isBuilderOpen, setBuilderOpen } = useApp();

  return (
    <Modal
      isOpen={isBuilderOpen}
      onClose={() => setBuilderOpen(false)}
      title="About the Developer"
      size="lg"
    >
      <div className="space-y-6">
        {/* Developer Section */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
            <User size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Kevin Daniel
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Developer
          </p>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            Register Number: 25BCE1823
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Mail size={14} />
            <a
              href="mailto:lrkevindaniel@gmail.com"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              lrkevindaniel@gmail.com
            </a>
          </div>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              Guided By
            </span>
          </div>
        </div>

        {/* Mentor Section */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Dr. Swaminathan A
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Assistant Professor
          </p>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium">
            <BookOpen size={14} />
            Mentor
          </div>
        </div>

        {/* Course Info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Details
          </h4>
          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <p>
              <strong>Course:</strong> Database Systems
            </p>
            <p>
              <strong>University:</strong> VIT University
            </p>
            <p>
              <strong>Project:</strong> Tuple &amp; Domain Relational Calculus
              Translator
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
