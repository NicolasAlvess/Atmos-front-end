import type { ReactNode } from 'react';

export default function ReportSection({
  number,
  title,
  description,
  children,
  breakBefore = true
}: {
  number: number;
  title: string;
  description?: string;
  children: ReactNode;
  breakBefore?: boolean;
}) {
  return (
    <section className={`mb-10 ${breakBefore ? 'print:break-before-page print:mt-10' : ''}`}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display text-sm font-bold text-blue-600 print:text-slate-900">
          {number}.
        </span>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      <div className={description ? '' : 'mt-4'}>{children}</div>
    </section>
  );
}
