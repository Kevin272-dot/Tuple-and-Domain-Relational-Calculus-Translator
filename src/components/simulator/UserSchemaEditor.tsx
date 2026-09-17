import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, Table, Database } from 'lucide-react';
import { useApp, UserTable } from '../../context/AppContext';

export function UserSchemaEditor() {
  const { userSchema, setUserSchema } = useApp();
  const [newTableName, setNewTableName] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(userSchema[0]?.name || null);
  const [newColName, setNewColName] = useState('');

  const currentTable = userSchema.find((t) => t.name === selectedTable);

  const addTable = () => {
    if (!newTableName.trim()) return;
    if (userSchema.some((t) => t.name.toLowerCase() === newTableName.toLowerCase())) return;
    const newTable: UserTable = {
      name: newTableName.trim(),
      columns: ['col1'],
      rows: [],
    };
    setUserSchema([...userSchema, newTable]);
    setSelectedTable(newTable.name);
    setNewTableName('');
  };

  const removeTable = (name: string) => {
    setUserSchema(userSchema.filter((t) => t.name !== name));
    if (selectedTable === name) setSelectedTable(userSchema[0]?.name || null);
  };

  const addColumn = () => {
    if (!currentTable || !newColName.trim()) return;
    if (currentTable.columns.some((c) => c.toLowerCase() === newColName.toLowerCase())) return;
    setUserSchema(
      userSchema.map((t) =>
        t.name === currentTable.name
          ? { ...t, columns: [...t.columns, newColName.trim()], rows: t.rows.map((r) => [...r, '']) }
          : t
      )
    );
    setNewColName('');
  };

  const removeColumn = (colIndex: number) => {
    if (!currentTable) return;
    setUserSchema(
      userSchema.map((t) =>
        t.name === currentTable.name
          ? {
              ...t,
              columns: t.columns.filter((_, i) => i !== colIndex),
              rows: t.rows.map((r) => r.filter((_, i) => i !== colIndex)),
            }
          : t
      )
    );
  };

  const addRow = () => {
    if (!currentTable) return;
    setUserSchema(
      userSchema.map((t) =>
        t.name === currentTable.name
          ? { ...t, rows: [...t.rows, currentTable.columns.map(() => '')] }
          : t
      )
    );
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    if (!currentTable) return;
    setUserSchema(
      userSchema.map((t) => {
        if (t.name !== currentTable.name) return t;
        const newData = t.rows.map((r) => [...r]);
        newData[rowIdx][colIdx] = value;
        return { ...t, rows: newData };
      })
    );
  };

  const removeRow = (rowIdx: number) => {
    if (!currentTable) return;
    setUserSchema(
      userSchema.map((t) =>
        t.name === currentTable.name
          ? { ...t, rows: t.rows.filter((_, i) => i !== rowIdx) }
          : t
      )
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Database size={20} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Define Your Schema
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Create tables, add columns, and populate data. Then run queries against your schema.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTable()}
          placeholder="New table name"
          className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Button onClick={addTable} disabled={!newTableName.trim()} size="sm">
          <Plus size={14} className="mr-1" /> Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {userSchema.map((t) => (
          <button
            key={t.name}
            onClick={() => setSelectedTable(t.name)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
              selectedTable === t.name
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary-400'
            }`}
          >
            <Table size={14} />
            {t.name}
            <span className="text-xs opacity-70">({t.rows.length} rows)</span>
          </button>
        ))}
      </div>

      {currentTable && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{currentTable.name}</h4>
            <button
              onClick={() => removeTable(currentTable.name)}
              className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {currentTable.columns.map((col, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                {col}
                <button onClick={() => removeColumn(idx)} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={10} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addColumn()}
              placeholder="Column name"
              className="flex-1 px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={addColumn} disabled={!newColName.trim()} size="sm" variant="secondary">
              <Plus size={14} />
            </Button>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Data ({currentTable.rows.length} rows)</span>
            <Button onClick={addRow} size="sm" variant="secondary">
              <Plus size={12} className="mr-1" /> Row
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                <tr>
                  {currentTable.columns.map((col, i) => (
                    <th key={i} className="px-2 py-1.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                      {col}
                    </th>
                  ))}
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {currentTable.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-t border-slate-100 dark:border-slate-800">
                    {row.map((cell, colIdx) => (
                      <td key={colIdx} className="px-0.5 py-0.5">
                        <input
                          type="text"
                          value={String(cell)}
                          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                          className="w-full px-1.5 py-1 text-xs font-mono bg-transparent border border-transparent rounded focus:border-primary-500 focus:outline-none text-slate-700 dark:text-slate-300"
                        />
                      </td>
                    ))}
                    <td className="px-1">
                      <button onClick={() => removeRow(rowIdx)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
