export interface InterventionAction {
  dimensao: string;
  teoria: string;
  prazo: string;
  acao: string;
}

const PRAZOS = ['Curto prazo', 'Médio prazo', 'Longo prazo'] as const;

const PRAZO_TONES: Record<(typeof PRAZOS)[number], { badge: string; border: string }> = {
  'Curto prazo': { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-100' },
  'Médio prazo': { badge: 'bg-violet-100 text-violet-700', border: 'border-violet-100' },
  'Longo prazo': { badge: 'bg-slate-200 text-slate-700', border: 'border-slate-200' }
};

export default function InterventionPlanList({ actions }: { actions: InterventionAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <h4 className="font-bold text-slate-800 mb-3">Plano de Intervenção Priorizado</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRAZOS.map((prazo) => {
          const items = actions.filter((action) => action.prazo === prazo);

          if (items.length === 0) {
            return null;
          }

          const tone = PRAZO_TONES[prazo];

          return (
            <div key={prazo} className={`rounded-xl bg-slate-50 border ${tone.border} p-4`}>
              <span
                className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg mb-3 ${tone.badge}`}
              >
                {prazo}
              </span>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li key={`${item.dimensao}-${index}`} className="text-sm">
                    <p className="text-slate-700">
                      <strong>{item.dimensao}:</strong> {item.acao}
                    </p>
                    <p className="text-xs text-slate-500 italic mt-0.5">{item.teoria}</p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
