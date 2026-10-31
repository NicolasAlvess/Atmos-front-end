import Card from '../ui/Card';

export default function StatCard({
  label,
  value,
  suffix,
  accent = false
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-4 min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
        {label}
      </p>
      <p className={`text-2xl font-bold ${accent ? 'text-blue-600 print:text-black' : 'text-slate-800'}`}>
        {value}{' '}
        {suffix && <span className="text-sm font-normal text-slate-500">{suffix}</span>}
      </p>
    </Card>
  );
}
