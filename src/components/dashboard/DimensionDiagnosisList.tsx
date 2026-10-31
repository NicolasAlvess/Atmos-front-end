import Badge from '../ui/Badge';

export interface DimensionDiagnosis {
  key: string;
  nome: string;
  nota: number;
  classificacao: 'critico' | 'alerta' | 'forte' | 'sem_dados';
  teoria: string;
  diagnostico: string;
}

function getClassificationBadge(classificacao: DimensionDiagnosis['classificacao']) {
  switch (classificacao) {
    case 'forte':
      return { label: 'Ponto Forte', tone: 'emerald' as const };
    case 'alerta':
      return { label: 'Alerta', tone: 'amber' as const };
    case 'critico':
      return { label: 'Crítico', tone: 'red' as const };
    default:
      return { label: 'Sem dados', tone: 'slate' as const };
  }
}

export default function DimensionDiagnosisList({
  dimensions
}: {
  dimensions: DimensionDiagnosis[];
}) {
  return (
    <div className="space-y-4">
      {dimensions.map((dimension) => {
        const badge = getClassificationBadge(dimension.classificacao);

        return (
          <div key={dimension.key} className="p-4 rounded-xl border border-slate-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">
                  {dimension.nome}{' '}
                  <span className="text-slate-400 font-normal">({dimension.nota || '—'})</span>
                </p>
                <p className="text-xs text-slate-500 italic">{dimension.teoria}</p>
              </div>
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </div>
            <p className="text-sm text-slate-600">{dimension.diagnostico}</p>
          </div>
        );
      })}
    </div>
  );
}
