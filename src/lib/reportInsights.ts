export const GENERAL_QUESTION_KEYS = [
  'q1_pertencimento',
  'q2_valorizacao',
  'q3_seguranca',
  'q4_respeito',
  'q5_equidade',
  'q6_capacitacao',
  'q7_comunicacao',
  'q8_lideranca'
];

export const TEMPO_EMPRESA_ORDER = [
  'Menos de 6 meses',
  '6 meses a 1 ano',
  '1 a 3 anos',
  '3 a 5 anos',
  'Mais de 5 anos'
];

/**
 * Índice de favorabilidade "top-two-box": percentual de respostas (entre todas as
 * perguntas gerais de todos os respondentes) que marcaram nota 4 ou 5 — métrica
 * padrão em pesquisas de clima, mais robusta que converter a média linear em %.
 */
export function calcFavorabilityPercent(data: Record<string, string>[]): number {
  let total = 0;
  let favoraveis = 0;

  data.forEach((item) => {
    GENERAL_QUESTION_KEYS.forEach((key) => {
      const value = Number(item[key]);
      if (Number.isFinite(value) && value >= 1 && value <= 5) {
        total += 1;
        if (value >= 4) favoraveis += 1;
      }
    });
  });

  if (total === 0) return 0;
  return Math.round((favoraveis / total) * 100);
}

/** Média geral (das 8 dimensões) calculada por respondente individual, depois agregada. */
function respondentAverage(item: Record<string, string>): number | null {
  const values = GENERAL_QUESTION_KEYS.map((key) => Number(item[key])).filter(
    (value) => Number.isFinite(value) && value >= 1 && value <= 5
  );

  if (values.length === 0) return null;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

export interface SegmentAverage {
  label: string;
  total: number;
  media: number;
}

/** Agrupa as respostas por um campo (setor, tempo_empresa, etc.) e calcula a média geral de cada grupo. */
export function calcSegmentAverages(
  data: Record<string, string>[],
  groupKey: string,
  order?: string[]
): SegmentAverage[] {
  const groups = new Map<string, number[]>();

  data.forEach((item) => {
    const label = item[groupKey];
    const avg = respondentAverage(item);
    if (!label || avg === null) return;

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(avg);
  });

  const result: SegmentAverage[] = Array.from(groups.entries()).map(([label, values]) => ({
    label,
    total: values.length,
    media: Number((values.reduce((acc, v) => acc + v, 0) / values.length).toFixed(1))
  }));

  if (order) {
    return result.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  }

  return result.sort((a, b) => b.media - a.media);
}

export interface RankedDimension {
  key: string;
  nome: string;
  nota: number;
  classificacao: 'critico' | 'alerta' | 'forte' | 'sem_dados';
}

export function rankDimensions<T extends RankedDimension>(dimensoes: T[]): T[] {
  return [...dimensoes]
    .filter((d) => d.classificacao !== 'sem_dados')
    .sort((a, b) => b.nota - a.nota);
}
