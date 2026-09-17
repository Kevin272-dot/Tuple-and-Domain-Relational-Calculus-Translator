import { BookOpen, ExternalLink, FileText, Globe } from 'lucide-react';
import { Card } from '../ui/Card';

const references = [
  {
    type: 'book',
    title: 'Database System Concepts',
    author: 'Silberschatz, Korth, Sudarshan',
    edition: '7th Ed., McGraw-Hill, 2019',
    note: 'Chapter 6 covers the formal query languages in detail. The TRC/DRC sections are well-written with good examples.',
  },
  {
    type: 'book',
    title: 'Database Systems: The Complete Book',
    author: 'Garcia-Molina, Ullman, Widom',
    edition: '2nd Ed., Pearson, 2014',
    note: 'Chapters 5-6 walk through relational algebra and calculus side by side. Great for understanding the connection between the two.',
  },
  {
    type: 'book',
    title: 'An Introduction to Database Systems',
    author: 'C.J. Date',
    edition: '8th Ed., Pearson, 2003',
    note: 'Classic reference. Chapter 8 on TRC is particularly clear if you want the theoretical foundation.',
  },
  {
    type: 'website',
    title: 'Relational Calculus — GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/relational-calculus-in-dbms/',
    note: 'Good quick reference with worked examples. Useful when you need a fast refresher.',
  },
  {
    type: 'website',
    title: 'Tuple Relational Calculus — Stanford CS 145',
    url: 'https://cs.stanford.edu/people/nick/cs145/',
    note: 'Stanford course notes. More rigorous than most online tutorials.',
  },
  {
    type: 'website',
    title: 'Domain Relational Calculus — TutorialsPoint',
    url: 'https://www.tutorialspoint.com/dbms/domain_relational_calculus.htm',
    note: 'Beginner friendly walkthrough of DRC with step by step examples.',
  },
  {
    type: 'paper',
    title: 'A Completeness Theorem for the Tuple Relational Calculus',
    author: 'E.F. Codd',
    journal: 'Journal of the ACM, 19(1), pp. 42-58, 1972',
    note: 'The foundational paper that proved TRC is relationally complete. Worth reading if you want to understand why these languages matter.',
  },
];

const typeConfig: Record<string, { icon: JSX.Element; color: string }> = {
  book: {
    icon: <BookOpen size={14} />,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  website: {
    icon: <Globe size={14} />,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  paper: {
    icon: <FileText size={14} />,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
};

export function References() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <BookOpen size={18} className="text-primary-600 dark:text-primary-400" />
        References &amp; Sources
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        These are the books, papers, and websites we drew from while building this tool and writing the learning content.
      </p>

      <div className="space-y-5">
        {/* Books */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Textbooks
          </h4>
          <div className="space-y-2">
            {references
              .filter((r) => r.type === 'book')
              .map((ref, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 p-1 rounded ${typeConfig[ref.type].color}`}>
                      {typeConfig[ref.type].icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {ref.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ref.author} — {ref.edition}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                        {ref.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Websites */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Websites &amp; Online Resources
          </h4>
          <div className="space-y-2">
            {references
              .filter((r) => r.type === 'website')
              .map((ref, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 p-1 rounded ${typeConfig[ref.type].color}`}>
                      {typeConfig[ref.type].icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {ref.title}
                      </p>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                      >
                        {ref.url}
                        <ExternalLink size={10} />
                      </a>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                        {ref.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Papers */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Research Papers
          </h4>
          <div className="space-y-2">
            {references
              .filter((r) => r.type === 'paper')
              .map((ref, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 p-1 rounded ${typeConfig[ref.type].color}`}>
                      {typeConfig[ref.type].icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {ref.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ref.author}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ref.journal}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                        {ref.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
