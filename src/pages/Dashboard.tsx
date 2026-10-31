
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthUser } from '../hooks/useAuthUser';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Button from '../components/ui/Button';
import StatCard from '../components/dashboard/StatCard';
import DiagnosisSummaryCard from '../components/dashboard/DiagnosisSummaryCard';
import ClimateBarChart from '../components/dashboard/ClimateBarChart';
import DimensionDiagnosisList, {
  type DimensionDiagnosis
} from '../components/dashboard/DimensionDiagnosisList';
import InterventionPlanList, {
  type InterventionAction
} from '../components/dashboard/InterventionPlanList';
import SectorBreakdown, { type SectorAnalysis } from '../components/dashboard/SectorBreakdown';

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
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();

  const fetchAll = useCallback(async (currentUser: User) => {
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
      const idToken = await currentUser.getIdToken();
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
        throw new Error('O servidor retornou um erro ao carregar os dados do painel.');
      }

      const responses: unknown = await responsesRes.json();
      const companyInfo: CompanyInfo = await companyRes.json();
      const diagnosisData: DiagnosisData = await diagnosisRes.json();

      if (!Array.isArray(responses)) {
        throw new Error('A API retornou um formato inesperado. Era esperada uma lista de respostas.');
      }

      setData(responses as ResponseData[]);
      setCompany(companyInfo);
      setDiagnosis(diagnosisData);
    } catch (error) {
      console.error('Erro ao buscar dados do painel:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Não foi possível carregar os dados.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

  const surveyLink = company ? `${window.location.origin}/survey/${company.slug}` : '';

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
    <PageBackground className="print:bg-white print:text-black">
      <AppHeader
        sticky
        title={company ? `Atmos — ${company.name}` : 'Atmos'}
        right={
          <>
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
            <h1 className="text-2xl font-bold text-slate-900">Diagnóstico Organizacional</h1>
            <p className="text-sm text-slate-500 mt-1">
              Análise consolidada das médias de satisfação (Escala 1 a 5).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:flex md:w-auto md:gap-4">
            <StatCard label="Amostragem" value={loading ? '...' : data.length} suffix="respostas" />
            <StatCard
              label="Média Global"
              value={loading ? '...' : diagnosis?.mediaGeral ?? '0.0'}
              suffix="/ 5.0"
              accent
            />
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
                className="flex-grow min-w-0 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              />
              <Button onClick={() => void handleCopyLink()} className="shrink-0">
                {linkCopied ? 'Link copiado!' : 'Copiar link'}
              </Button>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-blue-100 rounded-xl p-5 mb-6 text-sm text-blue-700">
            Carregando respostas do servidor...
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
          <>
            <DiagnosisSummaryCard summary={diagnosis.resumoExecutivo} />

            <ClimateBarChart data={generalClimateData} />

            <div className="bg-white border border-[#dce7f2] rounded-2xl p-6 shadow-sm mb-8 print:break-inside-avoid">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Diagnóstico de Clima &amp; Plano de Intervenção
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Análise por dimensão, fundamentada em teorias científicas de motivação e gestão.
              </p>

              <DimensionDiagnosisList dimensions={diagnosis.dimensoes} />
              <InterventionPlanList actions={diagnosis.planoIntervencao} />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-4 print:mt-10 print:break-before-page">
              Realidade Específica por Setor (Microclima)
            </h3>

            <SectorBreakdown sectors={sectorsAnalysis} />
          </>
        )}
      </main>

      <footer className="relative z-10 w-full border-t border-sky-100/80 bg-white/50 backdrop-blur-sm py-4 text-xs text-slate-500 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Dados consolidados e protegidos por empresa.</span>
          <span className="text-slate-400">© 2026 Atmos Platform</span>
        </div>
      </footer>
    </PageBackground>
  );
}
