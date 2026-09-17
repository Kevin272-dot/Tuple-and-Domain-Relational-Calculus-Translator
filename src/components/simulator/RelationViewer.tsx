import { useState } from 'react';
import { Card } from '../ui/Card';
import { Database, Table, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { SAMPLE_DATABASE_SCHEMA } from '../../engine/constants';
import { DataTable } from '../ui/DataTable';

export function RelationViewer() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tables = Object.entries(SAMPLE_DATABASE_SCHEMA);

  const filteredTables = tables.filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Database size={20} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Interactive Relation Viewer
        </h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Browse the sample database. Click a table to view its data.
      </p>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tables..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="space-y-2">
        {filteredTables.map(([name, schema]) => {
          const isOpen = selectedTable === name;
          return (
            <div key={name}>
              <button
                onClick={() => setSelectedTable(isOpen ? null : name)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Table size={16} className="text-primary-500" />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{name}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    ({schema.columns.length} cols, {schema.sampleData.length} rows)
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {isOpen && (
                <div className="mt-2 animate-slide-up">
                  <div className="mb-2 flex flex-wrap gap-1">
                    {schema.columns.map((col, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">
                        {col} <span className="text-primary-400 dark:text-primary-500">({schema.types[i]})</span>
                      </span>
                    ))}
                  </div>
                  <DataTable
                    columns={[...schema.columns]}
                    rows={schema.sampleData.map(r => [...r])}
                    maxRows={20}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
