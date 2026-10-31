export interface LikertOption {
  value: string;
  label: string;
}

export const LIKERT_OPTIONS: LikertOption[] = [
  { value: '1', label: 'Discordo Totalmente' },
  { value: '2', label: 'Discordo Parcialmente' },
  { value: '3', label: 'Neutro' },
  { value: '4', label: 'Concordo Parcialmente' },
  { value: '5', label: 'Concordo Totalmente' }
];
