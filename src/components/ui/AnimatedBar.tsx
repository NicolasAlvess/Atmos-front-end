import { useEffect, useState } from 'react';

export default function AnimatedBar({
  percent,
  color,
  className = ''
}: {
  percent: number;
  color: string;
  className?: string;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div className={`w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300 overflow-hidden ${className}`}>
      <div
        className="h-2 rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}
