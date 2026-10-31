export function getClimateBarColor(nota: number) {
  if (nota >= 4.0) return '#10b981';
  if (nota >= 3.0) return '#f59e0b';
  return '#ef4444';
}
