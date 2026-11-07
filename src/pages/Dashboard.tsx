
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import { useSlowLoading } from '../hooks/useSlowLoading';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Button from '../components/ui/Button';
import SlowLoadingNotice from '../components/ui/SlowLoadingNotice';
import StatCard from '../components/dashboard/StatCard';
import DiagnosisSummaryCard from '../components/dashboard/DiagnosisSummaryCard';
import ClimateBarChart from '../components/dashboard/ClimateBarChart';
import RoundsTrendChart, { type RoundTrendPoint } from '../components/dashboard/RoundsTrendChart';
import DimensionDiagnosisList, {
  type DimensionDiagnosis
} from '../components/dashboard/DimensionDiagnosisList';
import InterventionPlanList, {
  type InterventionAction
} from '../components/dashboard/InterventionPlanList';
import SectorBreakdown, { type SectorAnalysis } from '../components/dashboard/SectorBreakdown';
import DemographicsBreakdown from '../components/dashboard/DemographicsBreakdown';
import ReportSection from '../components/dashboard/ReportSection';
import RankedDimensionsList from '../components/dashboard/RankedDimensionsList';
import SegmentAveragesList from '../components/dashboard/SegmentAveragesList';
import {
  calcFavorabilityPercent,
  calcSegmentAverages,
  rankDimensions,
  TEMPO_EMPRESA_ORDER
} from '../lib/reportInsights';
import { PUBLIC_SITE_URL } from '../lib/siteUrl';

interface ResponseData {
  id: string;
  setor: string;
  tempo_empresa: string;
  [key: string]: string;
}

interface CompanyInfo {
  companyId: string;
  name: string;
  slug: string;
}

interface SurveyRound {
  id: string;
  label: string;
  startedAt: string;
}

interface DiagnosisData {
  totalRespostas: number;
  mediaGeral: number;
  pontoForte: { dimensao: string; nota: number } | null;
  pontoCritico: { dimensao: string; nota: number } | null;
  resumoExecutivo: string;
  dimensoes: DimensionDiagnosis[];
  planoIntervencao: InterventionAction[];
}

const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');

function calcAverage(dataset: ResponseData[], key: string): number {
  const validValues = dataset
    .map((item) => Number(item[key]))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

  if (validValues.length === 0) {
    return 0;
  }

  const sum = validValues.reduce((acc, value) => acc + value, 0);
  return Number((sum / validValues.length).toFixed(1));
}

export default function Dashboard() {
  const { user } = useAuthUser();
  const [data, setData] = useState<ResponseData[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [rounds, setRounds] = useState<SurveyRound[]>([]);
  const [trendPoints, setTrendPoints] = useState<RoundTrendPoint[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');
  const [previousRoundMedia, setPreviousRoundMedia] = useState<number | null>(null);
  const [isCreatingRound, setIsCreatingRound] = useState(false);
  const [confirmingNewRound, setConfirmingNewRound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();
  const isLoadingSlowly = useSlowLoading(loading);

  const authHeaders = useCallback(async (currentUser: User) => {
    const idToken = await currentUser.getIdToken();
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${idToken}`
    };
  }, []);

  const fetchAll = useCallback(
    async (currentUser: User) => {
      if (!API_URL) {
        setErrorMessage(
          'A variável VITE_API_URL não está configurada. Verifique as variáveis de ambiente da Vercel e faça um novo deploy.'
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      try {
        const headers = await authHeaders(currentUser);

        const [responsesRes, companyRes, diagnosisRes, roundsRes, trendRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/responses`, { headers }),
          fetch(`${API_URL}/api/admin/company`, { headers }),
          fetch(`${API_URL}/api/admin/diagnosis`, { headers }),
          fetch(`${API_URL}/api/admin/rounds`, { headers }),
          fetch(`${API_URL}/api/admin/rounds/trend`, { headers })
        ]);

        if (!responsesRes.ok || !companyRes.ok || !diagnosisRes.ok || !roundsRes.ok || !trendRes.ok) {
          throw new Error('O servidor retornou um erro ao carregar os dados do painel.');
        }

        const responses: unknown = await responsesRes.json();
        const companyInfo: CompanyInfo = await companyRes.json();
        const diagnosisData: DiagnosisData = await diagnosisRes.json();
        const roundsData: SurveyRound[] = await roundsRes.json();
        const trendData: RoundTrendPoint[] = await trendRes.json();

        if (!Array.isArray(responses)) {
          throw new Error('A API retornou um formato inesperado. Era esperada uma lista de respostas.');
        }

        setData(responses as ResponseData[]);
        setCompany(companyInfo);
        setDiagnosis(diagnosisData);
        setRounds(roundsData);
        setTrendPoints(trendData);
      } catch (error) {
        console.error('Erro ao buscar dados do painel:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível carregar os dados.'
        );
      } finally {
        setLoading(false);
      }
    },
    [authHeaders]
  );

  const fetchForRound = useCallback(
    async (currentUser: User, roundId: string, roundsList: SurveyRound[]) => {
      if (!API_URL) return;

      setLoading(true);
      setErrorMessage('');

      try {
        const headers = await authHeaders(currentUser);
        const query = roundId ? `?roundId=${encodeURIComponent(roundId)}` : '';

        const [responsesRes, diagnosisRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/responses${query}`, { headers }),
          fetch(`${API_URL}/api/admin/diagnosis${query}`, { headers })
        ]);

        if (!responsesRes.ok || !diagnosisRes.ok) {
          throw new Error('O servidor retornou um erro ao carregar os dados da rodada.');
        }

        const responses: unknown = await responsesRes.json();
        const diagnosisData: DiagnosisData = await diagnosisRes.json();

        setData(responses as ResponseData[]);
        setDiagnosis(diagnosisData);

        // `roundsList` vem ordenado da mais recente para a mais antiga,
        // então a rodada cronologicamente anterior é a PRÓXIMA do array.
        const roundIndex = roundsList.findIndex((round) => round.id === roundId);
        const previousRound =
          roundIndex !== -1 && roundIndex < roundsList.length - 1 ? roundsList[roundIndex + 1] : null;

        if (previousRound) {
          const previousRes = await fetch(
            `${API_URL}/api/admin/diagnosis?roundId=${encodeURIComponent(previousRound.id)}`,
            { headers }
          );
          const previousData: DiagnosisData = previousRes.ok
            ? await previousRes.json()
            : ({ mediaGeral: 0, totalRespostas: 0 } as DiagnosisData);
          setPreviousRoundMedia(previousData.totalRespostas > 0 ? previousData.mediaGeral : null);
        } else {
          setPreviousRoundMedia(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da rodada:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'Não foi possível carregar os dados da rodada.'
        );
      } finally {
        setLoading(false);
      }
    },
    [authHeaders]
  );

  useEffect(() => {
    if (!user) {
      return;
    }

    const timeoutId = setTimeout(() => {
      void fetchAll(user);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, fetchAll]);

  const handleRoundChange = (roundId: string, roundsList: SurveyRound[] = rounds) => {
    setSelectedRoundId(roundId);
    if (!user) return;

    if (!roundId) {
      setPreviousRoundMedia(null);
      void fetchAll(user);
    } else {
      void fetchForRound(user, roundId, roundsList);
    }
  };

  const handleCreateRound = async () => {
    if (!user || !API_URL) return;

    setConfirmingNewRound(false);
    setIsCreatingRound(true);

    try {
      const headers = await authHeaders(user);
      const response = await fetch(`${API_URL}/api/admin/rounds`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Não foi possível iniciar a nova rodada.');
      }

      const newRound: SurveyRound = await response.json();
      const updatedRounds = [newRound, ...rounds];
      setRounds(updatedRounds);
      handleRoundChange(newRound.id, updatedRounds);

      const trendRes = await fetch(`${API_URL}/api/admin/rounds/trend`, { headers });
      if (trendRes.ok) {
        setTrendPoints(await trendRes.json());
      }
    } catch (error) {
      console.error('Erro ao criar rodada:', error);
      alert('Não foi possível iniciar a nova rodada. Tente novamente.');
    } finally {
      setIsCreatingRound(false);
    }
  };

  const generalClimateData = [
    { name: 'Pertencimento', nota: calcAverage(data, 'q1_pertencimento') },
    { name: 'Valorização', nota: calcAverage(data, 'q2_valorizacao') },
    { name: 'Segurança Psicológica', nota: calcAverage(data, 'q3_seguranca') },
    { name: 'Respeito/Diversidade', nota: calcAverage(data, 'q4_respeito') },
    { name: 'Equidade', nota: calcAverage(data, 'q5_equidade') },
    { name: 'Capacitação', nota: calcAverage(data, 'q6_capacitacao') },
    { name: 'Comunicação', nota: calcAverage(data, 'q7_comunicacao') },
    { name: 'Liderança', nota: calcAverage(data, 'q8_lideranca') }
  ];

  const getSectorAverages = (sectorName: string, q1Key: string, q2Key: string) => {
    const sectorData = data.filter((item) => item.setor === sectorName);

    return {
      total: sectorData.length,
      q1Media: calcAverage(sectorData, q1Key),
      q2Media: calcAverage(sectorData, q2Key)
    };
  };

  const sectorsAnalysis: SectorAnalysis[] = [
    {
      setor: 'Operacional',
      ...getSectorAverages('Operacional', 'q_op_1', 'q_op_2'),
      q1Label: 'Condições Físicas e Segurança',
      q2Label: 'Ferramentas e Orientações'
    },
    {
      setor: 'Administrativo / Backoffice',
      ...getSectorAverages('Administrativo / Backoffice', 'q_adm_1', 'q_adm_2'),
      q1Label: 'Colaboração e Processos',
      q2Label: 'Valorização do Trabalho Invisível'
    },
    {
      setor: 'Comercial / Vendas',
      ...getSectorAverages('Comercial / Vendas', 'q_com_1', 'q_com_2'),
      q1Label: 'Metas e Distribuição Justa',
      q2Label: 'Suporte contra Pressão'
    },
    {
      setor: 'Liderança / Gestão',
      ...getSectorAverages('Liderança / Gestão', 'q_lid_1', 'q_lid_2'),
      q1Label: 'Autonomia para Inclusão',
      q2Label: 'Preparo para Mediar Conflitos'
    }
  ];

  const favorabilidadePercent = calcFavorabilityPercent(data);
  const dimensoesRankeadas = diagnosis ? rankDimensions(diagnosis.dimensoes) : [];
  const segmentosPorSetor = calcSegmentAverages(data, 'setor');
  const segmentosPorTempo = calcSegmentAverages(data, 'tempo_empresa', TEMPO_EMPRESA_ORDER);

  const periodoColeta = (() => {
    const timestamps = data
      .map((item) => item.timestamp)
      .filter((value): value is string => Boolean(value))
      .sort();

    if (timestamps.length === 0) return null;

    const inicio = new Date(timestamps[0]).toLocaleDateString('pt-BR');
    const fim = new Date(timestamps[timestamps.length - 1]).toLocaleDateString('pt-BR');
    return inicio === fim ? `Coletado em ${inicio}` : `Coletado entre ${inicio} e ${fim}`;
  })();

  const surveyLink = company ? `${PUBLIC_SITE_URL}/survey/${company.slug}` : '';

  const handleCopyLink = async () => {
    if (!surveyLink) return;

    try {
      await navigator.clipboard.writeText(surveyLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar o link:', error);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const preferredOrder = [
      'id',
      'timestamp',
      'setor',
      'tempo_empresa',
      'faixa_etaria',
      'genero',
      'raca_cor',
      'q1_pertencimento',
      'q2_valorizacao',
      'q3_seguranca',
      'q4_respeito',
      'q5_equidade',
      'q6_capacitacao',
      'q7_comunicacao',
      'q8_lideranca',
      'q_op_1',
      'q_op_2',
      'q_adm_1',
      'q_adm_2',
      'q_com_1',
      'q_com_2',
      'q_lid_1',
      'q_lid_2'
    ];
    const excludedKeys = new Set(['companyId', 'companySlug']);

    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!excludedKeys.has(key)) allKeys.add(key);
      });
    });

    const orderedKeys = [
      ...preferredOrder.filter((key) => allKeys.has(key)),
      ...Array.from(allKeys)
        .filter((key) => !preferredOrder.includes(key))
        .sort()
    ];

    const escapeCsvValue = (value: unknown) => {
      const str = String(value ?? '');
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = [
      orderedKeys.join(','),
      ...data.map((item) => orderedKeys.map((key) => escapeCsvValue(item[key])).join(','))
    ];

    const csvContent = '﻿' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atmos-respostas-${company?.slug ?? 'empresa'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <PageBackground className="print:bg-white print:text-black">
      <AppHeader
        sticky
        title={company ? `Atmos — ${company.name}` : 'Atmos'}
        right={
          <>
            <button
              onClick={() => navigate('/admin/teorias')}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg shadow-sm transition"
            >
              Teorias do Diagnóstico
            </button>
            <button
              onClick={() => navigate('/admin/teorias')}
              className="sm:hidden inline-flex items-center justify-center text-blue-700 bg-blue-50 border border-blue-200 w-9 h-9 rounded-lg shadow-sm transition"
              aria-label="Teorias do Diagnóstico"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={data.length === 0}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Exportar CSV
            </button>
            <button
              onClick={handleExportCSV}
              disabled={data.length === 0}
              className="sm:hidden inline-flex items-center justify-center text-slate-700 bg-white border border-slate-200 w-9 h-9 rounded-lg shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Exportar CSV"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a2 2 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <button
              onClick={handleExportPDF}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition"
            >
              Exportar Relatório (PDF)
            </button>
            <button
              onClick={handleExportPDF}
              className="sm:hidden inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 w-9 h-9 rounded-lg shadow-sm transition"
              aria-label="Exportar Relatório (PDF)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a2 2 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>

            <button
              onClick={() => void handleLogout()}
              className="text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition"
            >
              Sair
            </button>
          </>
        }
      />

      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:px-0">
        <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Relatório de Diagnóstico de Clima Organizacional
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {company?.name} • Gerado automaticamente via Atmos Platform • Data:{' '}
            {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 print:mb-8">
          <div className="print:hidden">
            <h1 className="font-display text-2xl font-semibold text-slate-900">Diagnóstico Organizacional</h1>
            <p className="text-sm text-slate-500 mt-1">
              Análise consolidada das médias de satisfação (Escala 1 a 5).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:flex md:w-auto md:gap-4 print:hidden">
            <StatCard
              label="Amostragem"
              value={loading ? '...' : data.length}
              suffix="respostas"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 2a4 4 0 10-8 0" />
                </svg>
              }
            />
            <StatCard
              label="Média Global"
              value={loading ? '...' : diagnosis?.mediaGeral ?? '0.0'}
              suffix="/ 5.0"
              accent
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>
        </div>

        {!loading && previousRoundMedia !== null && diagnosis && diagnosis.totalRespostas > 0 && (
          <div className="mb-6 -mt-3 print:hidden">
            {(() => {
              const delta = Number((diagnosis.mediaGeral - previousRoundMedia).toFixed(1));
              const isUp = delta > 0;
              const isFlat = delta === 0;
              return (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                    isFlat
                      ? 'bg-slate-50 text-slate-600 border-slate-200'
                      : isUp
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {!isFlat && (
                    <svg
                      className={`w-3.5 h-3.5 ${isUp ? '' : 'rotate-180'}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                  {isFlat
                    ? 'Média estável em relação à rodada anterior'
                    : `${isUp ? '+' : ''}${delta} vs. rodada anterior (${previousRoundMedia.toFixed(1)})`}
                </span>
              );
            })()}
          </div>
        )}

        {!loading && rounds.length > 0 && (
          <div className="bg-white border border-[#dce7f2] rounded-2xl p-5 mb-6 shadow-sm print:hidden">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Rodada de pesquisa
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedRoundId}
                onChange={(e) => handleRoundChange(e.target.value)}
                className="flex-grow min-w-0 px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as respostas</option>
                {rounds.map((round) => (
                  <option key={round.id} value={round.id}>
                    {round.label} — {new Date(round.startedAt).toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </select>
              {!confirmingNewRound ? (
                <Button
                  variant="secondary"
                  onClick={() => setConfirmingNewRound(true)}
                  className="shrink-0"
                >
                  Iniciar nova rodada
                </Button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    onClick={() => setConfirmingNewRound(false)}
                    disabled={isCreatingRound}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => void handleCreateRound()} loading={isCreatingRound}>
                    {!isCreatingRound && 'Confirmar nova rodada'}
                  </Button>
                </div>
              )}
            </div>
            {confirmingNewRound && (
              <p className="text-xs text-slate-500 mt-2">
                A partir de agora, as novas respostas passam a contar para uma nova rodada.
              </p>
            )}
          </div>
        )}

        {!loading && rounds.length === 0 && company && (
          <div className="bg-white border border-dashed border-[#dce7f2] rounded-2xl p-5 mb-6 text-center print:hidden">
            <p className="text-sm text-slate-600 mb-3">
              Quer acompanhar a evolução do clima ao longo do tempo? Inicie rodadas de pesquisa
              para comparar os resultados de cada período.
            </p>
            <Button
              variant="secondary"
              onClick={() => void handleCreateRound()}
              loading={isCreatingRound}
            >
              {!isCreatingRound && 'Iniciar primeira rodada'}
            </Button>
          </div>
        )}

        {!loading && company && (
          <div className="bg-white border border-[#dce7f2] rounded-2xl p-5 mb-6 shadow-sm print:hidden">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Link da pesquisa para seus colaboradores
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                readOnly
                value={surveyLink}
                className="flex-grow min-w-0 px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              />
              <Button onClick={() => void handleCopyLink()} className="shrink-0">
                {linkCopied ? 'Link copiado!' : 'Copiar link'}
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6 text-sm text-blue-700 space-y-2">
            <p>Carregando respostas do servidor...</p>
            {isLoadingSlowly && <SlowLoadingNotice />}
          </div>
        )}

        {!loading && errorMessage && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-sm text-red-800">
            <p className="font-semibold mb-2">Não foi possível carregar os dados.</p>
            <p className="mb-4">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                if (user) void fetchAll(user);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !errorMessage && diagnosis && (
          <div className="mt-2">
            <ReportSection number={1} title="Introdução e Objetivos" breakBefore={false}>
              <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  Este relatório apresenta o diagnóstico de clima organizacional e inclusão da{' '}
                  <strong className="text-slate-800">{company?.name}</strong>, com base nas respostas
                  coletadas através da plataforma Atmos.
                </p>
                <p>
                  <strong className="text-slate-800">Objetivo:</strong> mapear a percepção dos
                  colaboradores sobre pertencimento, valorização, segurança psicológica, respeito e
                  diversidade, equidade, capacitação, comunicação e liderança, identificando pontos
                  fortes e oportunidades de melhoria para orientar ações concretas de gestão de
                  pessoas.
                </p>
                <p>
                  <strong className="text-slate-800">Período:</strong>{' '}
                  {periodoColeta ?? 'Ainda não há respostas registradas.'}
                  {selectedRoundId && rounds.length > 0 && (
                    <> — Rodada: {rounds.find((r) => r.id === selectedRoundId)?.label}</>
                  )}
                </p>
                <p>
                  <strong className="text-slate-800">Abrangência:</strong> todos os colaboradores da{' '}
                  {company?.name} que responderam voluntariamente ao link único de pesquisa
                  distribuído pela empresa.
                </p>
              </div>
            </ReportSection>

            <ReportSection number={2} title="Metodologia">
              <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none space-y-3 text-sm text-slate-600 leading-relaxed mb-6 print:break-inside-avoid">
                <p>
                  <strong className="text-slate-800">Amostragem:</strong> {data.length} resposta(s)
                  coletada(s) de forma voluntária e anônima. O sistema não mantém uma lista de
                  colaboradores convidados, portanto a taxa de adesão (respondentes vs. elegíveis)
                  deve ser acompanhada manualmente pela empresa, se desejado.
                </p>
                <p>
                  <strong className="text-slate-800">Instrumento:</strong> escala Likert de 1
                  (discordo totalmente) a 5 (concordo totalmente), com 8 perguntas gerais de clima e
                  inclusão, mais 2 perguntas específicas por setor de atuação, além de dados
                  sociodemográficos (tempo de empresa, setor, faixa etária, gênero e raça/cor).
                </p>
                <p>
                  <strong className="text-slate-800">Garantia de sigilo:</strong> as respostas são
                  100% anônimas — não são coletados nome, e-mail ou qualquer dado de identificação
                  direta. Os dados sociodemográficos são analisados apenas de forma agregada.
                </p>
              </div>

              <h4 className="font-bold text-slate-800 mb-1">Perfil da Amostra</h4>
              <p className="text-sm text-slate-500 mb-4">
                Distribuição demográfica das {data.length} respostas recebidas.
              </p>
              <DemographicsBreakdown data={data} total={data.length} />
            </ReportSection>

            <ReportSection
              number={3}
              title="Resultados Gerais (Visão Macro)"
              description="Índice de favorabilidade geral e indicadores-chave avaliados na pesquisa."
            >
              <DiagnosisSummaryCard summary={diagnosis.resumoExecutivo} />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <StatCard label="Amostragem" value={data.length} suffix="respostas" />
                <StatCard label="Média Global" value={diagnosis.mediaGeral} suffix="/ 5.0" accent />
                <StatCard label="Favorabilidade" value={favorabilidadePercent} suffix="% (notas 4-5)" />
                <StatCard
                  label="Ponto Crítico"
                  value={diagnosis.pontoCritico?.nota ?? '—'}
                  suffix={diagnosis.pontoCritico?.dimensao ?? ''}
                />
              </div>

              <RoundsTrendChart points={trendPoints} />

              <ClimateBarChart data={generalClimateData} />
            </ReportSection>

            <ReportSection
              number={4}
              title="Destaques: Pontos Fortes e Pontos de Atenção"
              description="Ranking das dimensões avaliadas, diagnóstico detalhado e segmentação por perfil."
            >
              <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none mb-6 print:break-inside-avoid">
                <h4 className="font-bold text-slate-800 mb-4">Ranking das Dimensões</h4>
                <RankedDimensionsList dimensions={dimensoesRankeadas} />
              </div>

              <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none mb-6">
                <h4 className="font-bold text-slate-800 mb-1">Diagnóstico Detalhado por Dimensão</h4>
                <p className="text-sm text-slate-500 mb-5">
                  Análise fundamentada em teorias científicas de motivação e gestão.
                </p>
                <DimensionDiagnosisList dimensions={diagnosis.dimensoes} />
              </div>

              <h4 className="font-bold text-slate-800 mb-4 print:break-before-page">
                Segmentação por Perfil
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 mb-6">
                <div className="bg-white border border-[#dce7f2] rounded-2xl p-5 shadow-sm print:border-slate-300 print:shadow-none print:break-inside-avoid">
                  <h5 className="font-bold text-slate-800 mb-4">Favorabilidade por Setor</h5>
                  <SegmentAveragesList segments={segmentosPorSetor} />
                </div>
                <div className="bg-white border border-[#dce7f2] rounded-2xl p-5 shadow-sm print:border-slate-300 print:shadow-none print:break-inside-avoid">
                  <h5 className="font-bold text-slate-800 mb-4">Favorabilidade por Tempo de Empresa</h5>
                  <SegmentAveragesList segments={segmentosPorTempo} />
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-4 print:break-before-page">
                Detalhamento por Setor (Microclima)
              </h4>
              <SectorBreakdown sectors={sectorsAnalysis} />
            </ReportSection>

            <ReportSection number={5} title="Análise Qualitativa (Comentários Abertos)">
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-sm text-slate-600 print:break-inside-avoid">
                <p>
                  Este ciclo de pesquisa não incluiu perguntas abertas, portanto não há comentários
                  livres para analisar nesta rodada. Para habilitar essa análise em futuras rodadas,
                  é possível adicionar um campo de comentário aberto ao questionário.
                </p>
              </div>
            </ReportSection>

            <ReportSection
              number={6}
              title="Plano de Ação Priorizado"
              description="Para cada ponto crítico identificado, ações objetivas de curto, médio e longo prazo."
            >
              <InterventionPlanList actions={diagnosis.planoIntervencao} />
            </ReportSection>
          </div>
        )}
      </main>

      <footer className="relative z-10 w-full border-t border-sky-100/80 bg-white/50 backdrop-blur-sm py-4 text-xs text-slate-500 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Dados consolidados e protegidos por empresa.</span>
          <span className="flex items-center gap-3">
            <span className="text-slate-500">© 2026 Atmos Platform</span>
            <span className="text-slate-500">Desenvolvido por PsicoStudent</span>
          </span>
        </div>
      </footer>
    </PageBackground>
  );
}
