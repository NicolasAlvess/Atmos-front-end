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
  const hasAnyData = dimensions.some((dimension) => dimension.classificacao !== 'sem_dados');

  if (!hasAnyData) {
    return (
      <div className="p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center mb-2">
        <p className="text-sm font-semibold text-slate-600">
          Ainda não há respostas suficientes para gerar o diagnóstico por dimensão.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Compartilhe o link da pesquisa com seus colaboradores para começar a ver os resultados aqui.
        </p>
      </div>
    );
  }

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
                  <span className="text-slate-500 font-normal">({dimension.nota || '—'})</span>
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
