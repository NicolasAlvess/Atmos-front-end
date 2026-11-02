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

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
    </Card>
  );
}
