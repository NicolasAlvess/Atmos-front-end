
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface ResponseData {
  id: string;
  setor: string;
  tempo_empresa: string;
  [key: string]: string;
}

const API_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');

export default function Dashboard() {
  const [data, setData] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const fetchResponses = useCallback(async () => {
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
      const response = await fetch(`${API_URL}/api/admin/responses`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(
          `O servidor retornou o erro HTTP ${response.status}.`
        );
      }

      const responses: unknown = await response.json();

      if (!Array.isArray(responses)) {
        throw new Error(
          'A API retornou um formato inesperado. Era esperada uma lista de respostas.'
        );
      }

      setData(responses as ResponseData[]);
    } catch (error) {
      console.error('Erro ao buscar respostas da API:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar as respostas.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchResponses();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchResponses]);

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
    {
      name: 'Pertencimento',
      nota: calcAverage(data, 'q1_pertencimento')
    },
    {
      name: 'Valorização',
      nota: calcAverage(data, 'q2_valorizacao')
    },
    {
      name: 'Segurança Psicológica',
      nota: calcAverage(data, 'q3_seguranca')
    },
    {
      name: 'Respeito/Diversidade',
      nota: calcAverage(data, 'q4_respeito')
    },
    {
      name: 'Equidade',
      nota: calcAverage(data, 'q5_equidade')
    },
    {
      name: 'Capacitação',
      nota: calcAverage(data, 'q6_capacitacao')
    },
    {
      name: 'Comunicação',
      nota: calcAverage(data, 'q7_comunicacao')
    },
    {
      name: 'Liderança',
      nota: calcAverage(data, 'q8_lideranca')
    }
  ];

  const answeredDimensions = generalClimateData.filter(
    (item) => item.nota > 0
  );

  const mediaGeral =
    answeredDimensions.length > 0
      ? (
          answeredDimensions.reduce(
            (acc, item) => acc + item.nota,
            0
          ) / answeredDimensions.length
        ).toFixed(1)
      : '0.0';

  const pontoForte = [...answeredDimensions].sort(
    (a, b) => b.nota - a.nota
  )[0];

  const pontoCritico = [...answeredDimensions].sort(
    (a, b) => a.nota - b.nota
  )[0];

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
      ...getSectorAverages(
        'Operacional',
        'q_op_1',
        'q_op_2'
      ),
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
      ...getSectorAverages(
        'Comercial / Vendas',
        'q_com_1',
        'q_com_2'
      ),
      q1Label: 'Metas e Distribuição Justa',
      q2Label: 'Suporte contra Pressão'
    },
    {
      setor: 'Liderança / Gestão',
      ...getSectorAverages(
        'Liderança / Gestão',
        'q_lid_1',
        'q_lid_2'
      ),
      q1Label: 'Autonomia para Inclusão',
      q2Label: 'Preparo para Mediar Conflitos'
    }
  ];

  const getBarColor = (nota: number) => {
    if (nota >= 4.0) return '#10b981';
    if (nota >= 3.0) return '#f59e0b';
    return '#ef4444';
  };

  const handleExportPDF = () => {
    window.print();
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
                <circle
                  cx="12"
                  cy="17"
                  r="1.5"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight">
                Atmos
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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a2 2 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar Relatório (PDF)
            </button>

            <button
              onClick={() => navigate('/')}
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
            Gerado automaticamente via Atmos Platform • Data:{' '}
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
                <span className="text-sm font-normal text-slate-500">
                  respostas
                </span>
              </p>
            </div>

            <div className="bg-white border border-[#dce7f2] rounded-xl p-4 shadow-sm flex-1 md:min-w-[160px] print:border-slate-300 print:shadow-none">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Média Global
              </p>
              <p className="text-2xl font-bold text-blue-600 print:text-black">
                {loading ? '...' : mediaGeral}{' '}
                <span className="text-sm font-normal text-slate-500">
                  / 5.0
                </span>
              </p>
            </div>
          </div>
        </div>

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
            <p className="font-semibold mb-2">
              Não foi possível carregar os dados.
            </p>
            <p className="mb-4">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void fetchResponses()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !errorMessage && (
          <>
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-6 shadow-sm print:hidden">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-sky-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="font-semibold text-sky-900 mb-2">
                    Como interpretar este relatório para o Plano de Intervenção
                  </h3>

                  <ul className="text-sm text-sky-800 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong>Métricas por Cores:</strong>{' '}
                      <span className="text-emerald-600 font-semibold">
                        Verde (≥ 4.0)
                      </span>{' '}
                      indica zonas de excelência e engajamento.{' '}
                      <span className="text-amber-600 font-semibold">
                        Amarelo (3.0 a 3.9)
                      </span>{' '}
                      indica alerta e necessidade de monitoramento.{' '}
                      <span className="text-red-600 font-semibold">
                        Vermelho (&lt; 3.0)
                      </span>{' '}
                      aponta criticidade, exigindo prioridade nas ações.
                    </li>
                    <li>
                      <strong>Mapeamento Global:</strong> O gráfico de barras
                      mostra a percepção sistêmica da empresa. Utilize os
                      indicadores mais fracos para propor intervenções.
                    </li>
                    <li>
                      <strong>Microclima por Setor:</strong> Os cards
                      segmentados revelam como cada área vive a cultura.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm print:bg-white print:border-slate-300 print:shadow-none">
              <h3 className="text-lg font-bold text-blue-900 mb-3 print:text-slate-900">
                Parecer Técnico: Resumo do Diagnóstico
              </h3>

              <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                <p>
                  O presente diagnóstico foi construído com base nas percepções
                  de <strong>{data.length} colaboradores</strong>. A média
                  global de favorabilidade organizacional encontra-se em{' '}
                  <strong>{mediaGeral} pontos</strong> (numa escala de 1 a 5).
                </p>

                {answeredDimensions.length > 0 ? (
                  <>
                    <p>
                      <strong>Ponto Forte (Retenção):</strong> A dimensão
                      melhor avaliada pela equipe foi{' '}
                      <strong>{pontoForte?.name}</strong>, com uma média de{' '}
                      <strong>{pontoForte?.nota}</strong>. Esta prática deve
                      ser mantida e reforçada.
                    </p>

                    <p>
                      <strong>Gargalo Cultural (Foco de Intervenção):</strong>{' '}
                      A dimensão com menor média é{' '}
                      <strong>{pontoCritico?.name}</strong>, com média de{' '}
                      <strong>{pontoCritico?.nota}</strong>. Recomenda-se
                      investigar as causas e planejar ações de melhoria.
                    </p>
                  </>
                ) : (
                  <p className="italic text-slate-500">
                    Ainda não há respostas válidas para calcular as médias.
                  </p>
                )}
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 5]}
                      tick={{ fontSize: 12 }}
                    />
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
                    <Bar
                      dataKey="nota"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                      isAnimationActive={false}
                    >
                      {generalClimateData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.nota)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                          <span
                            className="text-slate-600 font-medium truncate pr-4"
                            title={sector.q1Label}
                          >
                            {sector.q1Label}
                          </span>
                          <span className="font-bold text-slate-800">
                            {sector.q1Media}
                          </span>
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
                          <span
                            className="text-slate-600 font-medium truncate pr-4"
                            title={sector.q2Label}
                          >
                            {sector.q2Label}
                          </span>
                          <span className="font-bold text-slate-800">
                            {sector.q2Media}
                          </span>
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
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>
              Dados consolidados e protegidos via k-anonimato.
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">
              © 2026 Atmos Platform
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
