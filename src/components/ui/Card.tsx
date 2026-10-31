import type { HTMLAttributes } from 'react';

export default function Card({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border border-[#dce7f2] rounded-2xl shadow-sm print:border-slate-300 print:shadow-none ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
