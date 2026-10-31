import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Card from '../ui/Card';
import { getClimateBarColor } from '../../lib/climateColor';

export default function ClimateBarChart({
  data
}: {
  data: { name: string; nota: number }[];
}) {
  return (
    <Card className="p-6 mb-8 print:break-inside-avoid">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Mapeamento de Clima (Visão Geral)</h3>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12, fill: '#475569' }}
              width={120}
            />
            <RechartsTooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="nota" radius={[0, 4, 4, 0]} barSize={24} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getClimateBarColor(entry.nota)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
