import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Dot
} from 'recharts';
import Card from '../ui/Card';

export interface RoundTrendPoint {
  id: string;
  label: string;
  startedAt: string | null;
  mediaGeral: number;
  totalRespostas: number;
}

export default function RoundsTrendChart({ points }: { points: RoundTrendPoint[] }) {
  const chartData = points
    .filter((point) => point.totalRespostas > 0)
    .map((point) => ({ name: point.label, media: point.mediaGeral }));

  if (chartData.length < 2) {
    return null;
  }

  return (
    <Card className="p-6 mb-8 print:break-inside-avoid">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Evolução do Clima entre Rodadas</h3>
        <p className="text-sm text-slate-500 mt-1">
          Média geral de favorabilidade (escala 1 a 5) em cada rodada de pesquisa.
        </p>
      </div>

      {/* Na impressão, o Recharts não mede o contêiner de forma confiável (gráfico
          sai em branco/cortado no PDF); por isso fica oculto e é substituído pela
          versão em CSS puro abaixo. */}
      <div className="h-72 w-full print:hidden" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            tabIndex={-1}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <RechartsTooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value) => [`${value} / 5.0`, 'Média geral']}
            />
            <Line
              type="monotone"
              dataKey="media"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={<Dot r={5} fill="#4f46e5" stroke="#fff" strokeWidth={2} />}
              activeDot={{ r: 7 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="hidden print:block space-y-3">
        {chartData.map((point) => (
          <div key={point.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{point.name}</span>
              <span className="font-bold text-slate-900">{point.media.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-full h-3 border border-slate-300 rounded-full overflow-hidden bg-slate-50">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${(point.media / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Evolução da média geral de favorabilidade por rodada de pesquisa, escala 1 a 5</caption>
        <thead>
          <tr>
            <th scope="col">Rodada</th>
            <th scope="col">Média geral</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((point) => (
            <tr key={point.name}>
              <th scope="row">{point.name}</th>
              <td>{point.media} de 5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
