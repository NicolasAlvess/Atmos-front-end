
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { auth } from '../firebase';

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

interface DimensionDiagnosis {
  key: string;
  nome: string;
  nota: number;
  classificacao: 'critico' | 'alerta' | 'forte' | 'sem_dados';
  teoria: string;
  diagnostico: string;
}

interface InterventionAction {
  dimensao: string;
  teoria: string;
  prazo: string;
  acao: string;
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

export default function Dashboard() {
  const [data, setData] = useState<ResponseData[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();

  const fetchAll = useCallback(async (user: User) => {
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
      const idToken = await user.getIdToken();
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${idToken}`
      };

      const [responsesRes, companyRes, diagnosisRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/responses`, { headers }),
        fetch(`${API_URL}/api/admin/company`, { headers }),
        fetch(`${API_URL}/api/admin/diagnosis`, { headers })
      ]);

      if (!responsesRes.ok || !companyRes.ok || !diagnosisRes.ok) {
        throw new Error(
          `O servidor retornou um erro ao carregar os dados do painel.`
        );
      }

      const responses: unknown = await responsesRes.json();
      const companyInfo: CompanyInfo = await companyRes.json();
      const diagnosisData: DiagnosisData = await diagnosisRes.json();

      if (!Array.isArray(responses)) {
        throw new Error(
          'A API retornou um formato inesperado. Era esperada uma lista de respostas.'
        );
      }

      setData(responses as ResponseData[]);
      setCompany(companyInfo);
      setDiagnosis(diagnosisData);
    } catch (error) {
      console.error('Erro ao buscar dados do painel:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar os dados.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        void fetchAll(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [fetchAll, navigate]);

  const calcAverage = (
    dataset: ResponseData[],
    key: string
  ): number => {
    const validValues = dataset
      .map((item) => Number(item[key]))
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 1 &&
          value <= 5
      );

    if (validValues.length === 0) {
      return 0;
    }

    const sum = validValues.reduce(
      (acc, value) => acc + value,
      0
    );

    return Number((sum / validValues.length).toFixed(1));
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

  const getSectorAverages = (
    sectorName: string,
    q1Key: string,
    q2Key: string
  ) => {
    const sectorData = data.filter(
      (item) => item.setor === sectorName
    );

    return {
      total: sectorData.length,
      q1Media: calcAverage(sectorData, q1Key),
      q2Media: calcAverage(sectorData, q2Key)
    };
  };

  const sectorsAnalysis = [
    {
      setor: 'Operacional',
      ...getSectorAverages('Operacional', 'q_op_1', 'q_op_2'),
      q1Label: 'Condições Físicas e Segurança',
      q2Label: 'Ferramentas e Orientações'
    },
    {
      setor: 'Administrativo / Backoffice',
      ...getSectorAverages(
        'Administrativo / Backoffice',
        'q_adm_1',
        'q_adm_2'
      ),
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

  const getBarColor = (nota: number) => {
    if (nota >= 4.0) return '#10b981';
    if (nota >= 3.0) return '#f59e0b';
    return '#ef4444';
  };

  const getClassificationBadge = (
    classificacao: DimensionDiagnosis['classificacao']
  ) => {
    switch (classificacao) {
      case 'forte':
        return { label: 'Ponto Forte', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'alerta':
        return { label: 'Alerta', className: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'critico':
        return { label: 'Crítico', className: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: 'Sem dados', className: 'bg-slate-50 text-slate-500 border-slate-200' };
    }
  };

  const surveyLink = company
    ? `${window.location.origin}/survey/${company.slug}`
    : '';

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

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex flex-col font-sans text-slate-800 antialiased print:bg-white print:text-black">
      <div
        className="fixed inset-0 z-0 pointer-events-none print:hidden"
        style={{
          backgroundImage: `radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.4) 0px, transparent 50%),
                            radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.3) 0px, transparent 50%)`
        }}
      />

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dce7f2] shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 17c0-3.87 3.13-7 7-7s7 3.13 7 7" />
                <path d="M8.5 17c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" />
                <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight">
                Atmos{company ? ` — ${company.name}` : ''}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                Diagnóstico &amp; BI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition"
            >
              Exportar Relatório (PDF)
            </button>

            <button
              onClick={() => void handleLogout()}
              className="text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

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
            <h1 className="text-2xl font-bold text-slate-900">
              Diagnóstico Organizacional
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Análise consolidada das médias de satisfação (Escala 1 a 5).
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white border border-[#dce7f2] rounded-xl p-4 shadow-sm flex-1 md:min-w-[160px] print:border-slate-300 print:shadow-none">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Amostragem
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {loading ? '...' : data.length}{' '}
                <span className="text-sm font-normal text-slate-500">respostas</span>
              </p>
            </div>

            <div className="bg-white border border-[#dce7f2] rounded-xl p-4 shadow-sm flex-1 md:min-w-[160px] print:border-slate-300 print:shadow-none">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Média Global
              </p>
              <p className="text-2xl font-bold text-blue-600 print:text-black">
                {loading ? '...' : diagnosis?.mediaGeral ?? '0.0'}{' '}
                <span className="text-sm font-normal text-slate-500">/ 5.0</span>
              </p>
            </div>
          </div>
        </div>

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
                className="flex-grow px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              />
              <button
                onClick={() => void handleCopyLink()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shrink-0"
              >
                {linkCopied ? 'Link copiado!' : 'Copiar link'}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6 text-sm text-blue-700">
            Carregando respostas do servidor...
          </div>
        )}

        {!loading && errorMessage && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-sm text-red-800"
          >
            <p className="font-semibold mb-2">Não foi possível carregar os dados.</p>
            <p className="mb-4">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                const user = auth.currentUser;
                if (user) void fetchAll(user);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !errorMessage && (
          <>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm print:bg-white print:border-slate-300 print:shadow-none">
              <h3 className="text-lg font-bold text-blue-900 mb-3 print:text-slate-900">
                Parecer Técnico: Resumo do Diagnóstico
              </h3>

              <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>{diagnosis?.resumoExecutivo}</p>
              </div>
            </div>

            <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm mb-8 print:border-slate-300 print:shadow-none print:break-inside-avoid">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Mapeamento de Clima (Visão Geral)
                </h3>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generalClimateData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 12, fill: '#475569' }}
                      width={120}
                    />
                    <RechartsTooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="nota" radius={[0, 4, 4, 0]} barSize={24} isAnimationActive={false}>
                      {generalClimateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.nota)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm mb-8 print:border-slate-300 print:shadow-none print:break-inside-avoid">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Diagnóstico de Clima &amp; Plano de Intervenção
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Análise por dimensão, fundamentada em teorias científicas de motivação e gestão.
              </p>

              <div className="space-y-4">
                {diagnosis?.dimensoes.map((dimension) => {
                  const badge = getClassificationBadge(dimension.classificacao);

                  return (
                    <div
                      key={dimension.key}
                      className="p-4 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {dimension.nome}{' '}
                            <span className="text-slate-400 font-normal">
                              ({dimension.nota || '—'})
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 italic">{dimension.teoria}</p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{dimension.diagnostico}</p>
                    </div>
                  );
                })}
              </div>

              {diagnosis && diagnosis.planoIntervencao.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-3">
                    Plano de Intervenção Priorizado
                  </h4>
                  <div className="space-y-3">
                    {diagnosis.planoIntervencao.map((action, index) => (
                      <div
                        key={`${action.dimensao}-${index}`}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg shrink-0">
                          {action.prazo}
                        </span>
                        <div>
                          <p className="text-sm text-slate-700">
                            <strong>{action.dimensao}:</strong> {action.acao}
                          </p>
                          <p className="text-xs text-slate-400 italic">{action.teoria}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4 print:mt-10 print:break-before-page">
              Realidade Específica por Setor (Microclima)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
              {sectorsAnalysis.map((sector) => (
                <div
                  key={sector.setor}
                  className="bg-white border border-[#dce7f2] rounded-xl p-5 shadow-sm print:border-slate-300 print:shadow-none print:break-inside-avoid"
                >
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3 print:border-slate-200">
                    <h4 className="font-bold text-blue-800 print:text-slate-900">
                      {sector.setor}
                    </h4>

                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium print:border print:border-slate-300">
                      {sector.total} respostas
                    </span>
                  </div>

                  {sector.total === 0 ? (
                    <p className="text-sm text-slate-400 italic py-4 text-center">
                      Aguardando dados
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 font-medium truncate pr-4" title={sector.q1Label}>
                            {sector.q1Label}
                          </span>
                          <span className="font-bold text-slate-800">{sector.q1Media}</span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(sector.q1Media / 5) * 100}%`,
                              backgroundColor: getBarColor(sector.q1Media)
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 font-medium truncate pr-4" title={sector.q2Label}>
                            {sector.q2Label}
                          </span>
                          <span className="font-bold text-slate-800">{sector.q2Media}</span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-2 print:border print:border-slate-300">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(sector.q2Media / 5) * 100}%`,
                              backgroundColor: getBarColor(sector.q2Media)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="relative z-10 w-full border-t border-sky-100/80 bg-white/50 backdrop-blur-sm py-4 text-xs text-slate-500 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span>Dados consolidados e protegidos por empresa.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">© 2026 Atmos Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
