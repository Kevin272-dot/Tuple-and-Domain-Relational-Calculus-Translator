import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Table, Database, Save } from 'lucide-react';
import { SAMPLE_DATABASE_SCHEMA } from '../../engine/constants';

interface Column {
  name: string;
  type: string;
}

interface TableSchema {
  name: string;
  columns: Column[];
  sampleData: (string | number)[][];
}

export function SchemaEditor() {
  const [tables, setTables] = useState<TableSchema[]>(() =>
    Object.entries(SAMPLE_DATABASE_SCHEMA).map(([name, schema]) => ({
      name,
      columns: schema.columns.map((c, i) => ({ name: c, type: schema.types[i] })),
      sampleData: schema.sampleData.map(row => [...row]),
    }))
  );
  const [newTableName, setNewTableName] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(tables[0]?.name || null);
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('VARCHAR');

  const currentTable = tables.find((t) => t.name === selectedTable);

  const addTable = () => {
    if (!newTableName.trim()) return;
    if (tables.some((t) => t.name.toLowerCase() === newTableName.toLowerCase())) return;
    const newTable: TableSchema = {
      name: newTableName.trim(),
      columns: [{ name: 'id', type: 'INT' }],
      sampleData: [],
    };
    setTables([...tables, newTable]);
    setSelectedTable(newTable.name);
    setNewTableName('');
  };

  const removeTable = (name: string) => {
    setTables(tables.filter((t) => t.name !== name));
    if (selectedTable === name) setSelectedTable(tables[0]?.name || null);
  };

  const addColumn = () => {
    if (!currentTable || !newColName.trim()) return;
    if (currentTable.columns.some((c) => c.name.toLowerCase() === newColName.toLowerCase())) return;
    const updated = tables.map((t) => {
      if (t.name === currentTable.name) {
        return {
          ...t,
          columns: [...t.columns, { name: newColName.trim(), type: newColType }],
          sampleData: t.sampleData.map((row) => [...row, '']),
        };
      }
      return t;
    });
    setTables(updated);
    setNewColName('');
  };

  const removeColumn = (colIndex: number) => {
    if (!currentTable) return;
    const updated = tables.map((t) => {
      if (t.name === currentTable.name) {
        return {
          ...t,
          columns: t.columns.filter((_, i) => i !== colIndex),
          sampleData: t.sampleData.map((row) => row.filter((_, i) => i !== colIndex)),
        };
      }
      return t;
    });
    setTables(updated);
  };

  const addRow = () => {
    if (!currentTable) return;
    const emptyRow = currentTable.columns.map(() => '' as string | number);
    const updated = tables.map((t) => {
      if (t.name === currentTable.name) {
        return { ...t, sampleData: [...t.sampleData, emptyRow] };
      }
      return t;
    });
    setTables(updated);
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    if (!currentTable) return;
    const updated = tables.map((t) => {
      if (t.name === currentTable.name) {
        const newData = t.sampleData.map((row) => [...row]);
        newData[rowIdx][colIdx] = value;
        return { ...t, sampleData: newData };
      }
      return t;
    });
    setTables(updated);
  };

  const removeRow = (rowIdx: number) => {
    if (!currentTable) return;
    const updated = tables.map((t) => {
      if (t.name === currentTable.name) {
        return { ...t, sampleData: t.sampleData.filter((_, i) => i !== rowIdx) };
      }
      return t;
    });
    setTables(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Schema Editor
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Create and edit database schemas. Define tables, columns, data types, and populate with sample data.
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            value={newTableName}
            onChange={setNewTableName}
            placeholder="New table name"
            className="flex-1"
          />
          <Button onClick={addTable} disabled={!newTableName.trim()} size="sm">
            <Plus size={14} className="mr-1" />
            Add Table
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tables.map((t) => (
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
              <span className="text-xs opacity-70">({t.columns.length} cols)</span>
            </button>
          ))}
        </div>
      </Card>

      {currentTable && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-slate-900 dark:text-white">
              {currentTable.name}
            </h4>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeTable(currentTable.name)}
            >
              <Trash2 size={14} className="mr-1" />
              Delete Table
            </Button>
          </div>

          <div className="mb-4">
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Columns</h5>
            <div className="space-y-2">
              {currentTable.columns.map((col, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1">
                    {col.name}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {col.type}
                  </span>
                  <button
                    onClick={() => removeColumn(idx)}
                    className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Input
                value={newColName}
                onChange={setNewColName}
                placeholder="Column name"
                className="flex-1"
              />
              <select
                value={newColType}
                onChange={(e) => setNewColType(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="FLOAT">FLOAT</option>
                <option value="DATE">DATE</option>
                <option value="BOOLEAN">BOOLEAN</option>
              </select>
              <Button onClick={addColumn} disabled={!newColName.trim()} size="sm">
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">Data</h5>
              <Button onClick={addRow} size="sm" variant="secondary">
                <Plus size={14} className="mr-1" />
                Add Row
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    {currentTable.columns.map((col, i) => (
                      <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                        {col.name}
                      </th>
                    ))}
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentTable.sampleData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-t border-slate-100 dark:border-slate-800">
                      {row.map((cell, colIdx) => (
                        <td key={colIdx} className="px-1 py-0.5">
                          <input
                            type="text"
                            value={String(cell)}
                            onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                            className="w-full px-2 py-1 text-xs font-mono bg-transparent border border-transparent rounded focus:border-primary-500 focus:outline-none text-slate-700 dark:text-slate-300"
                          />
                        </td>
                      ))}
                      <td className="px-1 py-0.5">
                        <button
                          onClick={() => removeRow(rowIdx)}
                          className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
