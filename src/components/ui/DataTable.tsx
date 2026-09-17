import { ReactNode } from 'react';

interface DataTableProps {
  columns: string[];
  rows: (string | number)[][];
  highlightColumn?: string;
  maxRows?: number;
}

export function DataTable({ columns, rows, maxRows = 50 }: DataTableProps) {
  const displayRows = rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
              >
                No rows to display
              </td>
            </tr>
          ) : (
            displayRows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-mono text-xs"
                  >
                    {typeof cell === 'string' && cell.startsWith("'")
                      ? cell
                      : String(cell)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}
