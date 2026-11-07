import Badge from '../ui/Badge';
import { getClimateBarColor } from '../../lib/climateColor';
import type { DimensionDiagnosis } from './DimensionDiagnosisList';

const BADGE_BY_CLASSIFICACAO = {
  forte: { label: 'Ponto Forte', tone: 'emerald' as const },
  alerta: { label: 'Alerta', tone: 'amber' as const },
  critico: { label: 'Crítico', tone: 'red' as const },
  sem_dados: { label: 'Sem dados', tone: 'slate' as const }
};

export default function RankedDimensionsList({
  dimensions,
  highlightTop = 3,
  highlightBottom = 3
}: {
  dimensions: DimensionDiagnosis[];
  highlightTop?: number;
  highlightBottom?: number;
}) {
  if (dimensions.length === 0) {
    return <p className="text-sm text-slate-500 italic">Aguardando dados.</p>;
  }

  const total = dimensions.length;

  return (
    <div className="space-y-2.5">
      {dimensions.map((dimension, index) => {
        const isTop = index < highlightTop;
        const isBottom = index >= total - highlightBottom;
        const badge = BADGE_BY_CLASSIFICACAO[dimension.classificacao];

        return (
          <div
            key={dimension.key}
            className={`flex items-center gap-3 p-2.5 rounded-lg ${
              isTop ? 'bg-emerald-50 print:bg-white print:border print:border-emerald-200' : isBottom ? 'bg-red-50 print:bg-white print:border print:border-red-200' : ''
            }`}
          >
            <span className="w-5 text-xs font-bold text-slate-400 shrink-0">{index + 1}º</span>
            <span className="text-sm font-medium text-slate-700 flex-1 min-w-0 truncate" title={dimension.nome}>
              {dimension.nome}
            </span>
            <div className="w-28 shrink-0 hidden sm:block">
              <div className="w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${(dimension.nota / 5) * 100}%`, backgroundColor: getClimateBarColor(dimension.nota) }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-800 w-10 text-right shrink-0">{dimension.nota.toFixed(1)}</span>
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
        );
      })}
    </div>
  );
}
