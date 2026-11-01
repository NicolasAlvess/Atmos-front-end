import type { ReactNode } from 'react';
import Card from '../ui/Card';

export default function StatCard({
  label,
  value,
  suffix,
  accent = false,
  icon
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <Card hoverable className="p-3 sm:p-4 min-w-0 flex items-center gap-2 sm:gap-3">
      {icon && (
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md print:hidden ${
            accent
              ? 'bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-violet-500/20'
              : 'bg-gradient-to-tr from-blue-500 to-cyan-500 shadow-blue-500/20'
          }`}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide sm:tracking-wider leading-tight">
          {label}
        </p>
        <p className={`text-xl sm:text-2xl font-bold ${accent ? 'text-indigo-600 print:text-black' : 'text-slate-800'}`}>
          {value}{' '}
          {suffix && <span className="text-sm font-normal text-slate-500">{suffix}</span>}
        </p>
      </div>
    </Card>
  );
}
