export type LikertTone = 'red' | 'orange' | 'amber' | 'lime' | 'emerald';

export interface LikertOption {
  value: string;
  label: string;
  tone: LikertTone;
}

// Gradiente pastel de vermelho (discordo) a verde (concordo).
export const LIKERT_OPTIONS: LikertOption[] = [
  { value: '1', label: 'Discordo Totalmente', tone: 'red' },
  { value: '2', label: 'Discordo Parcialmente', tone: 'orange' },
  { value: '3', label: 'Neutro', tone: 'amber' },
  { value: '4', label: 'Concordo Parcialmente', tone: 'lime' },
  { value: '5', label: 'Concordo Totalmente', tone: 'emerald' }
];
