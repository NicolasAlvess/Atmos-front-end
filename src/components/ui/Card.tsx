import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({
  className = '',
  hoverable = false,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`bg-white border border-[#dce7f2] rounded-2xl shadow-sm print:border-slate-300 print:shadow-none transition-all ${
        hoverable ? 'hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
