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

      {/* Na tela: gráfico interativo (Recharts/SVG). Recharts mede o contêiner via
          ResizeObserver, o que não é confiável no momento da impressão do navegador
          (o gráfico sai em branco ou cortado no PDF) — por isso ele é ocultado na
          impressão e substituído pela versão abaixo, feita só com CSS. */}
      <div className="h-80 w-full print:hidden" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            tabIndex={-1}
          >
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

      {/* Na impressão/PDF: versão estática em CSS puro, sem medição de contêiner,
          garantindo que o gráfico sempre apareça corretamente no relatório. */}
      <div className="hidden print:block space-y-3">
        {data.map((entry) => (
          <div key={entry.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700">{entry.name}</span>
              <span className="font-bold text-slate-900">{entry.nota.toFixed(1)} / 5.0</span>
            </div>
            <div className="w-full h-3 border border-slate-300 rounded-full overflow-hidden bg-slate-50">
              <div
                className="h-full rounded-full"
                style={{ width: `${(entry.nota / 5) * 100}%`, backgroundColor: getClimateBarColor(entry.nota) }}
              />
            </div>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Mapeamento de clima por dimensão, nota de 0 a 5</caption>
        <thead>
          <tr>
            <th scope="col">Dimensão</th>
            <th scope="col">Nota</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.name}>
              <th scope="row">{entry.name}</th>
              <td>{entry.nota} de 5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
