import Card from '../ui/Card';

interface DemographicField {
  key: string;
  label: string;
}

const FIELDS: DemographicField[] = [
  { key: 'tempo_empresa', label: 'Tempo de Empresa' },
  { key: 'faixa_etaria', label: 'Faixa Etária' },
  { key: 'genero', label: 'Gênero' },
  { key: 'raca_cor', label: 'Raça/Cor' }
];

function distribution(data: Record<string, string>[], key: string) {
  const counts = new Map<string, number>();

  data.forEach((item) => {
    const value = item[key];
    if (!value) return;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export default function DemographicsBreakdown({
  data,
  total
}: {
  data: Record<string, string>[];
  total: number;
}) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
      {FIELDS.map((field) => {
        const items = distribution(data, field.key);

        return (
          <Card key={field.key} className="p-5 print:break-inside-avoid">
            <h4 className="font-bold text-slate-800 mb-4">{field.label}</h4>
            <div className="space-y-3">
              {items.map((item) => {
                const pct = Math.round((item.count / total) * 100);

                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium truncate pr-4" title={item.label}>
                        {item.label}
                      </span>
                      <span className="font-bold text-slate-800">
                        {pct}%<span className="text-slate-400 font-normal"> ({item.count})</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
