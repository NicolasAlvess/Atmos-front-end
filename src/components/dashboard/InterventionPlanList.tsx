export interface InterventionAction {
  dimensao: string;
  teoria: string;
  prazo: string;
  acao: string;
}

const PRAZO_TONES: Record<string, string> = {
  'Curto prazo': 'bg-blue-100 text-blue-700',
  'Médio prazo': 'bg-violet-100 text-violet-700',
  'Longo prazo': 'bg-slate-200 text-slate-700'
};

interface DimensionGroup {
  dimensao: string;
  teoria: string;
  acoes: { prazo: string; acao: string }[];
}

function groupByDimension(actions: InterventionAction[]): DimensionGroup[] {
  const groups: DimensionGroup[] = [];

  for (const action of actions) {
    let group = groups.find((g) => g.dimensao === action.dimensao);

    if (!group) {
      group = { dimensao: action.dimensao, teoria: action.teoria, acoes: [] };
      groups.push(group);
    }

    group.acoes.push({ prazo: action.prazo, acao: action.acao });
  }

  return groups;
}

export default function InterventionPlanList({ actions }: { actions: InterventionAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  const groups = groupByDimension(actions);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.dimensao}
            className="rounded-xl bg-slate-50 border border-slate-100 p-4 print:border-slate-300 print:break-inside-avoid"
          >
            <p className="font-semibold text-slate-800">{group.dimensao}</p>
            <p className="text-xs text-slate-500 italic mb-3">{group.teoria}</p>

            <div className="space-y-3">
              {group.acoes.map((item, index) => (
                <div key={index}>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded-lg mb-1 ${
                      PRAZO_TONES[item.prazo] ?? 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.prazo}
                  </span>
                  <p className="text-sm text-slate-700">{item.acao}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
