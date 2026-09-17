import { QueryHistoryEntry } from '../engine/types';

export function generateReport(history: QueryHistoryEntry[]): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const trcQueries = history.filter(h => h.calculusType === 'TRC');
  const drcQueries = history.filter(h => h.calculusType === 'DRC');
  const successful = history.filter(h => !h.outputSql.includes('Error'));
  const failed = history.filter(h => h.outputSql.includes('Error'));

  let report = `
================================================================================
          TRC/DRC TRANSLATOR - TRANSLATION ACTIVITY REPORT
================================================================================
  Generated: ${dateStr} at ${timeStr}
  Student:   Kevin Daniel (25BCE1823)
  Course:    Database Systems - VIT University
  Mentor:    Dr. Swaminathan A, Assistant Professor
================================================================================


1. SUMMARY
--------------------------------------------------------------------------------
  Total Translations:  ${history.length}
  TRC Queries:         ${trcQueries.length}
  DRC Queries:         ${drcQueries.length}
  Successful:          ${successful.length}
  Failed:              ${failed.length}
  Success Rate:        ${history.length > 0 ? Math.round((successful.length / history.length) * 100) : 0}%
  Session:             ${now.toLocaleString()}
`.trim();

  if (history.length === 0) {
    report += `

2. TRANSLATION HISTORY
--------------------------------------------------------------------------------
  No translations recorded yet.

  To generate a report with data:
  1. Go to the Simulator tab
  2. Enter a TRC or DRC query
  3. Click Translate
  4. Come back and click Download

  The report will include all your translations with full details.
`;
    return report;
  }

  report += `

2. TRANSLATION HISTORY
================================================================================`;

  history.forEach((entry, index) => {
    const ts = new Date(entry.timestamp);
    const time = ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const date = ts.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' });

    report += `
  ${String(index + 1).padStart(2, ' ')}. [${date} ${time}] ${entry.calculusType} Query
  ${'─'.repeat(70)}
  Input:
    ${entry.inputQuery}

  Output SQL:
    ${entry.outputSql.replace(/\n/g, '\n    ')}

  Translation Steps:
`;
    if (entry.steps && entry.steps.length > 0) {
      entry.steps.forEach((step) => {
        report += `    Step ${step.step}: ${step.description}
`;
        if (step.outputFragment) {
          report += `      -> ${step.outputFragment}
`;
        }
      });
    } else {
      report += `    (No steps recorded)
`;
    }

    if (entry.outputSql.includes('Error')) {
      report += `  Status: FAILED
`;
    } else {
      report += `  Status: SUCCESS
`;
    }
  });

  report += `

3. TRANSLATION PATTERNS ANALYSIS
================================================================================`;

  const operators = new Map<string, number>();
  history.forEach(entry => {
    const text = entry.inputQuery.toLowerCase();
    if (text.includes('exists')) operators.set('exists (existential)', (operators.get('exists (existential)') || 0) + 1);
    if (text.includes('forall')) operators.set('forall (universal)', (operators.get('forall (universal)') || 0) + 1);
    if (text.includes('implies')) operators.set('implies', (operators.get('implies') || 0) + 1);
    if (text.includes(' and ')) operators.set('AND (conjunction)', (operators.get('AND (conjunction)') || 0) + 1);
    if (text.includes(' or ')) operators.set('OR (disjunction)', (operators.get('OR (disjunction)') || 0) + 1);
    if (text.includes('not ')) operators.set('NOT (negation)', (operators.get('NOT (negation)') || 0) + 1);
  });

  if (operators.size > 0) {
    report += `
  Operators Used:
`;
    const sorted = [...operators.entries()].sort((a, b) => b[1] - a[1]);
    sorted.forEach(([op, count]) => {
      const bar = '#'.repeat(Math.min(count * 3, 30));
      report += `    ${op.padEnd(30)} ${String(count).padStart(3)}x  ${bar}
`;
    });
  }

  const difficultyMap = new Map<string, number>();
  history.forEach(entry => {
    const text = entry.inputQuery.toLowerCase();
    let diff = 'basic';
    if (text.includes('exists') || text.includes('forall') || text.includes('implies')) diff = 'intermediate';
    if ((text.includes('exists') && text.includes('forall')) || text.includes('not exists')) diff = 'advanced';
    difficultyMap.set(diff, (difficultyMap.get(diff) || 0) + 1);
  });

  report += `
  Complexity Distribution:
`;
  ['basic', 'intermediate', 'advanced'].forEach(d => {
    const count = difficultyMap.get(d) || 0;
    const bar = '#'.repeat(Math.min(count * 3, 30));
    report += `    ${d.padEnd(15)} ${String(count).padStart(3)}x  ${bar}
`;
  });

  report += `

4. TECHNICAL REFERENCE
================================================================================

  TRC/DRC to SQL Mapping Rules:
  ┌─────────────────────────────┬──────────────────────────────────────────────┐
  │ TRC/DRC                     │ SQL Equivalent                               │
  ├─────────────────────────────┼──────────────────────────────────────────────┤
  │ {T | P(T)}                  │ SELECT * FROM R WHERE P                      │
  │ {T.name | P(T)}             │ SELECT name FROM R WHERE P                   │
  │ exists X(P(X))              │ EXISTS (SELECT * FROM R WHERE P)             │
  │ forall X(P(X))              │ NOT EXISTS (SELECT * FROM R WHERE NOT P)     │
  │ P implies Q                 │ NOT P OR Q                                   │
  │ T in R                      │ FROM R / IN R                                │
  │ <x,y> in R                  │ FROM R (DRC domain variables)                │
  └─────────────────────────────┴──────────────────────────────────────────────┘

  Supported Operators:
    and   = Conjunction (AND)        or  = Disjunction (OR)
    not   = Negation (NOT)           in  = Membership (IN / FROM)
    exists = Existential (∃)         forall = Universal (∀)
    implies = Implication (→)        iff = Biconditional (↔)


5. REPORT FOOTER
================================================================================
  This report was auto-generated by the TRC/DRC Translator application.
  Tool: Tuple & Domain Relational Calculus Translator v1.0
  Built with: React + TypeScript + Vite + Tailwind CSS

  For more information, refer to the Help section in the application.
================================================================================
`.trim();

  return report;
}

export function generatePDFReport(history: QueryHistoryEntry[]): void {
  const reportContent = generateReport(history);

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>TRC/DRC Translation Report</title>
  <style>
    body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5; padding: 20px; white-space: pre-wrap; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>${reportContent.replace(/\n/g, '<br>')}</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}
