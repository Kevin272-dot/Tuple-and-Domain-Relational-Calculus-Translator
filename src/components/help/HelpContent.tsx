import { Card } from '../ui/Card';
import {
  BookOpen,
  MousePointer,
  Play,
  FileText,
  Download,
  Settings,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Wrench,
  Sparkles,
} from 'lucide-react';

export function HelpContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          How to Use This Tool
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          This guide walks you through everything. Skim the headings or read it all — whatever works for you.
        </p>
      </div>

      {/* What is this */}
      <Card>
        <SectionHeader icon={<BookOpen />} title="What does this tool do?" />
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          You type a query in Tuple Relational Calculus (TRC) or Domain Relational Calculus (DRC) — the formal languages used in database theory courses. The tool converts it into SQL you can actually run. It also shows you <em>how</em> the conversion happens, step by step, so you can learn the mapping between formal notation and practical queries.
        </p>
      </Card>

      {/* Simulator walkthrough */}
      <Card>
        <SectionHeader icon={<Play />} title="Using the Simulator" />
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <Step num={1} text="Pick your calculus type — hit the TRC or DRC button at the top of the input area." />
          <Step num={2} text="Type your query in the text box. Use the Sample Queries panel on the right for examples if you are stuck." />
          <Step num={3} text='Hit "Translate" or press Ctrl+Enter. The SQL output appears below with a step by step breakdown.' />
          <Step num={4} text="Copy the SQL with the Copy button and paste it into your database tool (MySQL Workbench, pgAdmin, etc.)." />

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mt-3">
            <p className="text-amber-700 dark:text-amber-300 font-medium text-xs flex items-center gap-1">
              <Lightbulb size={14} />
              Tip
            </p>
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">
              If your query has errors, the tool will tell you exactly where the problem is — line number, position, and what was expected. Fix the issue and try again.
            </p>
          </div>
        </div>
      </Card>

      {/* Input syntax */}
      <Card>
        <SectionHeader icon={<FileText />} title="Writing Queries" />
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">TRC format:</p>
            <pre className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-xs border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
{`{ Variable | condition }

Examples:
{T | T ∈ Students ∧ T.age > 20}
{T.name | T ∈ Students ∧ T.dept = 'CS'}
{T.name | ∃E(T.name = E.student ∧ E.course = 'DBMS')}`}
            </pre>
          </div>

          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">DRC format:</p>
            <pre className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-xs border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
{`{ <v1, v2> | <v1, v2, v3> ∈ Relation ∧ condition }

Examples:
{<name, age> | <name, age, dept> ∈ Students ∧ dept = 'CS'}
{<s> | ∃c(<s, c> ∈ Enrolls ∧ c = 'DBMS')}`}
            </pre>
          </div>

          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">Operators you can use:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { sym: '∧', meaning: 'AND' },
                { sym: '∨', meaning: 'OR' },
                { sym: '¬', meaning: 'NOT' },
                { sym: '→', meaning: 'implies' },
                { sym: '↔', meaning: 'iff' },
                { sym: '∀', meaning: 'for all' },
                { sym: '∃', meaning: 'exists' },
                { sym: '∈', meaning: 'in' },
              ].map((op) => (
                <div
                  key={op.sym}
                  className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center"
                >
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {op.sym}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {op.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Features */}
      <Card>
        <SectionHeader icon={<Sparkles />} title="AI Features" />
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            There are three AI powered tools that help you learn. All of them use the Groq API with the LLaMA 3 model. You need a valid API key set up in your <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">.env</code> file.
          </p>

          <FeatureBlock
            icon={<Sparkles size={16} className="text-amber-500" />}
            title="Ask AI to Explain"
            description="Type a TRC/DRC query, pick a difficulty level (beginner/intermediate/advanced), and the AI will break it down in plain English. Great for understanding what a query actually means before you translate it."
          />

          <FeatureBlock
            icon={<Wrench size={16} className="text-amber-500" />}
            title="Syntax Checker"
            description="Not sure if your query is valid? This tool checks the syntax, points out errors (missing braces, wrong operators, etc.), and suggests a corrected version."
          />

          <FeatureBlock
            icon={<MessageCircle size={16} className="text-amber-500" />}
            title="Chat with the Tutor"
            description="Click the chat bubble in the bottom right corner to open a conversation. Ask anything about TRC, DRC, quantifiers, or SQL mappings. The AI remembers what query you have open in the simulator, so you can ask follow up questions."
          />

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-medium text-slate-700 dark:text-slate-300 text-xs mb-1">Setting up the API key:</p>
            <pre className="font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
{`1. Go to console.groq.com and create an account
2. Generate an API key
3. Create a .env file in the project root
4. Add: VITE_GROQ_API_KEY=your_key_here
5. Restart the dev server (npm run dev)`}
            </pre>
          </div>
        </div>
      </Card>

      {/* Understanding output */}
      <Card>
        <SectionHeader icon={<Settings />} title="Reading the Output" />
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            After you translate a query, you get three things:
          </p>
          <ol className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span><strong>The SQL query</strong> — this is the final output. Copy it and run it in your database.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span><strong>Translation steps</strong> — shows how each part of the calculus expression was converted. Useful for learning and for debugging if something looks wrong.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span><strong>AI explanation</strong> — a plain English breakdown of what the query does, at the difficulty level you chose.</span>
            </li>
          </ol>
        </div>
      </Card>

      {/* Download */}
      <Card>
        <SectionHeader icon={<Download />} title="Downloading Reports" />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Click the Download button in the top navigation bar. The tool generates a text report containing your input queries, translation steps, and the SQL output. Save it as a reference or submit it as part of your coursework.
        </p>
      </Card>

      {/* Keyboard shortcuts */}
      <Card>
        <SectionHeader icon={<MousePointer />} title="Keyboard Shortcuts" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { key: 'Ctrl + Enter', action: 'Translate the current query' },
            { key: 'Ctrl + K', action: 'Open command palette (coming soon)' },
            { key: 'Ctrl + S', action: 'Download report' },
            { key: 'Ctrl + L', action: 'Clear the input field' },
            { key: 'Ctrl + D', action: 'Toggle day/night mode' },
          ].map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {s.action}
              </span>
              <kbd className="px-2 py-1 text-xs font-mono bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <SectionHeader icon={<HelpCircle />} title="Common Issues" />
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <Issue
            problem="The translate button does nothing"
            fix="Make sure you have typed a query and it starts with { and ends with }."
          />
          <Issue
            problem="I get a parse error"
            fix="Check that you are using the right symbols. ∧ for AND, ∨ for OR, ∈ for IN. Make sure all parentheses and quotes are matched."
          />
          <Issue
            problem="AI features say 'No API key'"
            fix="Create a .env file in the project root with VITE_GROQ_API_KEY=your_key. Restart the dev server after adding it."
          />
          <Issue
            problem="The SQL output looks wrong"
            fix="Double-check your TRC/DRC syntax. Try a simpler query first to make sure the basics work. Use the Syntax Checker to validate."
          />
        </div>
      </Card>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
      <span className="text-primary-600 dark:text-primary-400">{icon}</span>
      {title}
    </h3>
  );
}

function Step({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="flex-shrink-0 w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-bold">
        {num}
      </span>
      <span>{text}</span>
    </div>
  );
}

function FeatureBlock({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">
          {title}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

function Issue({ problem, fix }: { problem: string; fix: string }) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">
        {problem}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{fix}</p>
    </div>
  );
}
