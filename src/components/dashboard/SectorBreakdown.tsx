import { getClimateBarColor } from '../../lib/climateColor';

export interface SectorAnalysis {
  setor: string;
  total: number;
  q1Media: number;
  q2Media: number;
  q1Label: string;
  q2Label: string;
}

function SectorMetric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 font-medium truncate pr-4" title={label}>
          {label}
        </span>
        <span className="font-bold text-slate-800">{value}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300">
        <div
          className="h-2 rounded-full"
          style={{ width: `${(value / 5) * 100}%`, backgroundColor: getClimateBarColor(value) }}
        />
      </div>
    </div>
  );
}

export default function SectorBreakdown({ sectors }: { sectors: SectorAnalysis[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
      {sectors.map((sector) => (
        <div
          key={sector.setor}
          className="bg-white border border-[#dce7f2] rounded-xl p-5 shadow-sm print:border-slate-300 print:shadow-none print:break-inside-avoid"
        >
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3 print:border-slate-200">
            <h4 className="font-bold text-blue-800 print:text-slate-900">{sector.setor}</h4>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium print:border print:border-slate-300">
              {sector.total} respostas
            </span>
          </div>

          {sector.total === 0 ? (
            <p className="text-sm text-slate-400 italic py-4 text-center">Aguardando dados</p>
          ) : (
            <div className="space-y-4">
              <SectorMetric label={sector.q1Label} value={sector.q1Media} />
              <SectorMetric label={sector.q2Label} value={sector.q2Media} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
