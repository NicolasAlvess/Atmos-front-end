export default function SlowLoadingNotice({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 animate-[fadeIn_0.3s_ease-out] ${className}`}>
      Isso está demorando mais que o normal — o servidor pode estar iniciando após um período
      sem uso. Pode levar até 1 minuto na primeira vez.
    </p>
  );
}
