import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface SheetData {
  name: string;
  rows: (string | number | boolean | null)[][];
}

export default function DocumentViewer({ docKey }: { docKey: string }) {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileMap: Record<string, { url: string; title: string }> = {
    'synthese-xlsx': {
      url: '/tableausynthese.xlsx',
      title: 'Tableau de synthèse BTS SIO (Format Tableur)',
    },
  };

  const docInfo = fileMap[docKey] || {
    url: '/tableausynthese.xlsx',
    title: 'Document de synthèse',
  };

  useEffect(() => {
    let cancelled = false;

    async function loadWorkbook() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(docInfo.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const buffer = await res.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });

        const parsed: SheetData[] = workbook.SheetNames.map((name) => {
          const sheet = workbook.Sheets[name];
          const rawRows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
            header: 1,
            defval: '',
          });
          // Trim trailing empty rows
          const nonEmptyRows = rawRows.filter((row) =>
            row.some((cell) => cell !== null && String(cell).trim() !== '')
          );
          return { name, rows: nonEmptyRows };
        });

        if (!cancelled) {
          setSheets(parsed);
          setActiveSheet(0);
        }
      } catch {
        if (!cancelled) {
          setError('Impossible de charger ce document pour le moment.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWorkbook();
    return () => {
      cancelled = true;
    };
  }, [docInfo.url]);

  const currentSheet = sheets[activeSheet];

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-zinc-100 flex flex-col">
      {/* Barre supérieure */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white">{docInfo.title}</h1>
              <p className="text-xs text-zinc-400">Muslim Bayschanov · Consultation en ligne</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {sheets.length > 1 && (
              <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
                {sheets.map((s, idx) => (
                  <button
                    key={s.name}
                    onClick={() => setActiveSheet(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeSheet === idx
                        ? 'bg-white text-zinc-950'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Retour au portfolio</span>
            </a>
          </div>
        </div>
      </header>

      {/* Contenu du tableur */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 size={28} className="animate-spin text-white" />
            <span className="text-sm">Chargement du tableau de synthèse...</span>
          </div>
        ) : error ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <AlertCircle size={28} className="text-amber-400" />
            <span className="text-sm">{error}</span>
          </div>
        ) : currentSheet && currentSheet.rows.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <tbody>
                  {currentSheet.rows.map((row, rIdx) => {
                    const isHeaderRow = rIdx <= 2;
                    return (
                      <tr
                        key={rIdx}
                        className={`border-b border-white/5 ${
                          isHeaderRow
                            ? 'bg-zinc-900 font-semibold text-white'
                            : 'hover:bg-white/[0.03] text-zinc-300'
                        }`}
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-3.5 py-2.5 border-r border-white/5 whitespace-pre-wrap min-w-[90px] max-w-[320px] align-top"
                          >
                            {cell !== null && cell !== undefined ? String(cell) : ''}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-sm text-zinc-400">
            Cette feuille est vide.
          </div>
        )}
      </main>
    </div>
  );
}
