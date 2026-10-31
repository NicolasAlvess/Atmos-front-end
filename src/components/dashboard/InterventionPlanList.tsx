export interface InterventionAction {
  dimensao: string;
  teoria: string;
  prazo: string;
  acao: string;
}

export default function InterventionPlanList({ actions }: { actions: InterventionAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <h4 className="font-bold text-slate-800 mb-3">Plano de Intervenção Priorizado</h4>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={`${action.dimensao}-${index}`}
            className="flex flex-col sm:flex-row items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg shrink-0">
              {action.prazo}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-slate-700">
                <strong>{action.dimensao}:</strong> {action.acao}
              </p>
              <p className="text-xs text-slate-400 italic">{action.teoria}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
