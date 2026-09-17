import { BookOpen, ExternalLink, GraduationCap, Lightbulb, ArrowRight, Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { useState } from 'react';

export function ConceptExplanation() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap size={24} className="text-primary-600 dark:text-primary-400" />
          Why Relational Calculus Matters
        </h2>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
          <p>
            Most of us learned SQL by writing <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono">SELECT ... FROM ... WHERE</code> from day one. But there is a deeper, more formal way to describe what we want from a database — and that is where Relational Calculus comes in.
          </p>
          <p>
            Think of SQL as the language you <em>speak</em> to a database. Relational Calculus is the language you <em>think in</em> when you are reasoning about what a query actually means. It separates the "what" from the "how" — you describe the result you want, and the database engine figures out the best way to get it.
          </p>
          <p>
            There are two flavors: <strong>Tuple Relational Calculus (TRC)</strong>, which works with entire rows, and <strong>Domain Relational Calculus (DRC)</strong>, which works with individual column values. Both are logically equivalent — they can express the same things — but they approach the problem from different angles.
          </p>
        </div>
      </div>

      {/* TRC */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-600 dark:text-primary-400" />
          Tuple Relational Calculus (TRC)
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            TRC lets you talk about tuples — whole rows in a table. You give a name to the tuple you are looking for, then describe what conditions it must satisfy.
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-sm text-primary-700 dark:text-primary-300 border border-slate-200 dark:border-slate-700">
            {'{ T | condition(T) }'}
          </div>
          <p>
            The curly braces mean "the set of all." The pipe separates the variable from the condition. So <code className="font-mono">{'{T | T.age > 20}'}</code> reads as "the set of all tuples T where T's age is greater than 20."
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-slate-700 dark:text-slate-300">A real example:</p>
              <CopyButton text={'{T | T in Students AND T.age > 20}'} id="ex1" copiedId={copiedId} onClick={copyToClipboard} />
            </div>
            <p className="font-mono text-primary-700 dark:text-primary-300">
              {'{T | T in Students AND T.age > 20}'}
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              "Give me every student tuple where the student is in the Students table AND their age is over 20."
            </p>
            <div className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded border border-primary-200 dark:border-primary-800">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">SQL equivalent:</p>
              <code className="font-mono text-sm text-primary-700 dark:text-primary-300">SELECT * FROM Students WHERE age &gt; 20;</code>
            </div>
          </div>

          <p>
            When you only need specific columns, you can project just those attributes:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-sm text-primary-700 dark:text-primary-300 border border-slate-200 dark:border-slate-700">
            {"{ T.name | T in Students AND T.dept = 'CS' }"}
          </div>
          <p>
            This returns only the <code className="font-mono">name</code> column for students in the CS department.
          </p>
        </div>
      </Card>

      {/* DRC */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-violet-600 dark:text-violet-400" />
          Domain Relational Calculus (DRC)
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            DRC works a bit differently. Instead of naming a whole tuple, you list out the specific column values (domains) you care about. Think of it as zooming in on individual fields rather than looking at the whole row.
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-sm text-violet-700 dark:text-violet-300 border border-slate-200 dark:border-slate-700">
            {'{ <v1, v2, ..., vn> | condition(v1, v2, ..., vn) }'}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-slate-700 dark:text-slate-300">Example:</p>
              <CopyButton text={"{ <name, age> | <name, age, dept> in Students AND dept = 'CS' }"} id="ex2" copiedId={copiedId} onClick={copyToClipboard} />
            </div>
            <p className="font-mono text-violet-700 dark:text-violet-300">
              {"{ <name, age> | <name, age, dept> in Students AND dept = 'CS' }"}
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              "Return the name and age for any tuple in Students where the department is CS."
            </p>
            <div className="mt-2 p-2 bg-violet-50 dark:bg-violet-900/20 rounded border border-violet-200 dark:border-violet-800">
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">SQL equivalent:</p>
              <code className="font-mono text-sm text-violet-700 dark:text-violet-300">{"SELECT name, age FROM Students WHERE dept = 'CS';"}</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Quantifiers */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-600 dark:text-amber-400" />
          The Tricky Part: Quantifiers
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Quantifiers are where TRC/DRC get interesting — and where most students stumble. They let you make statements about "all" or "some" tuples without listing them explicitly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-mono font-bold text-primary-600 dark:text-primary-400 text-lg">exists (or type: exists)</p>
              <p className="mt-2">
                "There is at least one tuple that satisfies this condition."
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Maps to SQL <code className="font-mono">EXISTS</code> or <code className="font-mono">IN</code>.
              </p>
              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
                <p>TRC: {'{T | exists E(T.name = E.student)}'}</p>
                <p className="text-primary-600 dark:text-primary-400">SQL: WHERE EXISTS (SELECT * FROM ...)</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-mono font-bold text-primary-600 dark:text-primary-400 text-lg">forall (or type: forall)</p>
              <p className="mt-2">
                "Every single tuple satisfies this condition."
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Maps to <code className="font-mono">NOT EXISTS ... NOT</code> — a double negation pattern.
              </p>
              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
                <p>TRC: {'{T | forall E(T.name = E.student implies E.grade = A)}'}</p>
                <p className="text-primary-600 dark:text-primary-400">SQL: NOT EXISTS (... WHERE NOT ...)</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="font-medium text-amber-700 dark:text-amber-300 text-sm">
              Why does forall use NOT EXISTS? Think about it: "everyone passed" is the same as "there is nobody who did not pass." That double negative is how SQL handles universal quantification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-mono font-bold text-slate-700 dark:text-slate-300">implies (or: -&gt;)</p>
              <p className="mt-2">
                "If P then Q." In logic, P implies Q is the same as NOT P OR Q.
              </p>
              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
                <p>P implies Q</p>
                <p className="text-primary-600 dark:text-primary-400">= NOT P OR Q</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-mono font-bold text-slate-700 dark:text-slate-300">iff (or: &lt;-&gt;)</p>
              <p className="mt-2">
                "P exactly when Q." Both must have the same truth value.
              </p>
              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
                <p>P iff Q</p>
                <p className="text-primary-600 dark:text-primary-400">= (P implies Q) AND (Q implies P)</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* TRC vs DRC */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Quick Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 text-slate-700 dark:text-slate-300 font-medium">What</th>
                <th className="text-left py-2 text-primary-600 dark:text-primary-400 font-medium">TRC</th>
                <th className="text-left py-2 text-violet-600 dark:text-violet-400 font-medium">DRC</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">Works with</td>
                <td className="py-2">Whole tuples (rows)</td>
                <td className="py-2">Domain values (columns)</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">Looks like</td>
                <td className="py-2 font-mono text-xs">{'{T | T in R AND ...}'}</td>
                <td className="py-2 font-mono text-xs">{'{<x,y> | <x,y,z> in R AND ...}'}</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2">Projection</td>
                <td className="py-2 font-mono text-xs">{'T.name'}</td>
                <td className="py-2 font-mono text-xs">{'{<name>}'}</td>
              </tr>
              <tr>
                <td className="py-2">Best for</td>
                <td className="py-2">Thinking about rows</td>
                <td className="py-2">Thinking about columns</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Common Patterns Cheat Sheet */}
      <Card className="border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Copy size={18} className="text-primary-600 dark:text-primary-400" />
          Common Patterns Cheat Sheet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          These are the patterns you will use most often. Copy them and modify for your own queries.
        </p>

        <div className="space-y-3">
          <CheatPattern
            id="cp1"
            title="Simple selection"
            trc={'{T | T in Students AND T.age > 20}'}
            drc={"{<name> | <name, age> in Students AND age > 20}"}
            sql="SELECT * FROM Students WHERE age > 20;"
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />

          <CheatPattern
            id="cp2"
            title="Projection (specific columns)"
            trc={'{T.name | T in Students}'}
            drc="{<name> | <name> in Students}"
            sql="SELECT name FROM Students;"
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />

          <CheatPattern
            id="cp3"
            title="Join (two tables)"
            trc={'{T.name | T in Students AND exists E(E in Enrollment AND T.name = E.student AND E.course = T.course)}'}
            drc="{<s> | <s> in Students AND exists c(<s, c> in Enrolls AND c = 'DBMS')}"
            sql={"SELECT name FROM Students WHERE name IN (SELECT student FROM Enrolls WHERE course = 'DBMS');"}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />

          <CheatPattern
            id="cp4"
            title="Universal quantification (for all)"
            trc={"{T.name | T in Students AND forall E(E in Enrollment AND T.name = E.student implies E.grade = 'A')}"}
            drc="{<s> | <s> in Students AND forall c(<s, c> in Enrolls implies c in RequiredCourses)}"
            sql={"SELECT name FROM Students WHERE NOT EXISTS (SELECT * FROM Enrolls WHERE Enrolls.student = Students.name AND grade != 'A');"}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />

          <CheatPattern
            id="cp5"
            title="Division (all items in a set)"
            trc={'{T.name | T in Students AND forall C(C in Courses implies exists E(E in Enrollment AND T.name = E.student AND E.course = C.name))}'}
            drc="{<s> | <s> in Students AND forall c(<s> in Students implies exists e(<s, c> in Enrolls))}"
            sql={"SELECT name FROM Students WHERE NOT EXISTS (SELECT * FROM Courses WHERE NOT EXISTS (SELECT * FROM Enrolls WHERE Enrolls.student = Students.name AND Enrolls.course = Courses.name));"}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />

          <CheatPattern
            id="cp6"
            title="Comparisons and negation"
            trc={'{T | T in Students AND NOT (T.gpa < 3.0)}'}
            drc="{<name, gpa> | <name, gpa> in Students AND gpa >= 3.0}"
            sql="SELECT * FROM Students WHERE NOT (gpa < 3.0);"
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />
        </div>
      </Card>

      {/* Translation Rules */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Translation Rules at a Glance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 text-slate-700 dark:text-slate-300 font-medium">TRC / DRC</th>
                <th className="text-left py-2 text-primary-600 dark:text-primary-400 font-medium">SQL</th>
                <th className="text-left py-2 text-slate-500 dark:text-slate-400 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 dark:text-slate-300 font-mono text-xs">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-sans">{'{T | P(T)}'}</td>
                <td className="py-2">SELECT * FROM R WHERE P</td>
                <td className="py-2 font-sans">Basic selection</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-sans">{'{T.a | P(T)}'}</td>
                <td className="py-2">SELECT a FROM R WHERE P</td>
                <td className="py-2 font-sans">With projection</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-sans">exists T(P(T))</td>
                <td className="py-2">EXISTS (SELECT * FROM ... WHERE P)</td>
                <td className="py-2 font-sans">Existential</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-sans">forall T(P(T))</td>
                <td className="py-2">NOT EXISTS (SELECT * FROM ... WHERE NOT P)</td>
                <td className="py-2 font-sans">Double negation</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2 font-sans">T implies Q</td>
                <td className="py-2">NOT T OR Q</td>
                <td className="py-2 font-sans">Material implication</td>
              </tr>
              <tr>
                <td className="py-2 font-sans">T iff Q</td>
                <td className="py-2">(T AND Q) OR (NOT T AND NOT Q)</td>
                <td className="py-2 font-sans">Biconditional</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Why this matters */}
      <Card className="bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/10 dark:to-violet-900/10 border-primary-200 dark:border-primary-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          So why does this matter for SQL?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Every SQL query you write has an equivalent TRC and DRC expression. Understanding this connection helps you reason about query correctness, optimize complex queries, and appreciate what the database engine is actually doing under the hood. When you write a subquery with <code className="font-mono">EXISTS</code>, you are implicitly using existential quantification. When you use <code className="font-mono">NOT IN</code> or <code className="font-mono">NOT EXISTS</code>, you are working with universal quantification through its logical equivalent.
        </p>
      </Card>
    </div>
  );
}

function CopyButton({ text, id, copiedId, onClick }: { text: string; id: string; copiedId: string | null; onClick: (text: string, id: string) => void }) {
  return (
    <button
      onClick={() => onClick(text, id)}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      {copiedId === id ? <Check size={12} /> : <Copy size={12} />}
      {copiedId === id ? 'Copied' : 'Copy'}
    </button>
  );
}

function CheatPattern({
  id,
  title,
  trc,
  drc,
  sql,
  copiedId,
  onCopy,
}: {
  id: string;
  title: string;
  trc: string;
  drc: string;
  sql: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
        <CopyButton text={`TRC: ${trc}\nDRC: ${drc}\nSQL: ${sql}`} id={id} copiedId={copiedId} onClick={onCopy} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">TRC</p>
          <code className="font-mono text-slate-700 dark:text-slate-300 break-all">{trc}</code>
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <p className="text-violet-600 dark:text-violet-400 font-medium mb-1">DRC</p>
          <code className="font-mono text-slate-700 dark:text-slate-300 break-all">{drc}</code>
        </div>
        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <p className="text-green-600 dark:text-green-400 font-medium mb-1">SQL</p>
          <code className="font-mono text-slate-700 dark:text-slate-300 break-all">{sql}</code>
        </div>
      </div>
    </div>
  );
}
