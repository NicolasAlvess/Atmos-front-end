
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import AtmosLogo from '../components/icons/AtmosLogo';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import DemographicsStep from '../components/survey/DemographicsStep';
import LikertQuestion from '../components/survey/LikertQuestion';
import SurveyProgress from '../components/survey/SurveyProgress';
import SlowLoadingNotice from '../components/ui/SlowLoadingNotice';
import { useSlowLoading } from '../hooks/useSlowLoading';
import { LIKERT_OPTIONS, type LikertTone } from '../lib/likertOptions';

const LEGEND_TEXT_CLASSES: Record<LikertTone, string> = {
  red: 'text-red-700',
  orange: 'text-orange-700',
  amber: 'text-amber-700',
  lime: 'text-lime-700',
  emerald: 'text-emerald-700'
};

const LEGEND_DOT_CLASSES: Record<LikertTone, string> = {
  red: 'bg-red-400',
  orange: 'bg-orange-400',
  amber: 'bg-amber-400',
  lime: 'bg-lime-400',
  emerald: 'bg-emerald-500'
};

const LIKERT_QUESTIONS = [
  {
    name: 'q1_pertencimento',
    text: 'Sinto que posso ser eu mesmo(a) no ambiente de trabalho sem medo de julgamentos.'
  },
  {
    name: 'q2_valorizacao',
    text: 'Acredito que a empresa valoriza opiniões e perspectivas diferentes.'
  },
  {
    name: 'q3_seguranca',
    text: 'Sinto-me confortável para apontar erros ou sugerir melhorias sem medo de retaliação.'
  },
  {
    name: 'q4_respeito',
    text: 'Percebo que há respeito e colaboração entre colegas de diferentes perfis e origens.'
  },
  {
    name: 'q5_equidade',
    text: 'As oportunidades de promoção e crescimento são justas e baseadas no mérito.'
  },
  {
    name: 'q6_capacitacao',
    text: 'Tenho acesso igualitário a treinamentos e capacitações em comparação aos meus colegas.'
  },
  {
    name: 'q7_comunicacao',
    text: 'A comunicação oficial da empresa utiliza uma linguagem que respeita e inclui a todos.'
  },
  {
    name: 'q8_lideranca',
    text: 'Minha liderança direta demonstra atitudes inclusivas no dia a dia.'
  }
];

const SECTOR_SPECIFIC_QUESTIONS: Record<string, { name: string; text: string }[]> = {
  Operacional: [
    {
      name: 'q_op_1',
      text: 'Sinto que as condições físicas e ergonômicas do meu ambiente de trabalho são seguras e adequadas.'
    },
    {
      name: 'q_op_2',
      text: 'Recebo orientações claras e ferramentas adequadas para executar minhas rotinas operacionais diárias.'
    }
  ],
  'Administrativo / Backoffice': [
    {
      name: 'q_adm_1',
      text: 'Os processos corporativos permitem uma colaboração eficiente e sem burocracias excessivas.'
    },
    {
      name: 'q_adm_2',
      text: 'Sinto que o trabalho invisível e as demandas administrativas são devidamente valorizados.'
    }
  ],
  'Comercial / Vendas': [
    {
      name: 'q_com_1',
      text: 'Sinto que as metas comerciais e a distribuição de carteiras são estabelecidas de forma justa.'
    },
    {
      name: 'q_com_2',
      text: 'Tenho o suporte adequado para lidar com a pressão por resultados e gestão de clientes.'
    }
  ],
  'Liderança / Gestão': [
    {
      name: 'q_lid_1',
      text: 'Tenho autonomia e suporte da alta gestão para promover ações de inclusão na minha equipe.'
    },
    {
      name: 'q_lid_2',
      text: 'Sinto-me preparado(a) e apoiado(a) pela organização para mediar conflitos interpessoais.'
    }
  ]
};

export default function Survey() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [companyName, setCompanyName] = useState('');
  const [companyStatus, setCompanyStatus] = useState<'loading' | 'ready' | 'not_found'>('loading');
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const resolveCompany = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl || !slug) {
        setCompanyStatus('not_found');
        return;
      }

      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/companies/${slug}`);

        if (!response.ok) {
          setCompanyStatus('not_found');
          return;
        }

        const company = await response.json();
        setCompanyName(company.name);
        setCompanyStatus('ready');
      } catch (error) {
        console.error('Erro ao validar o link da pesquisa:', error);
        setCompanyStatus('not_found');
      }
    };

    void resolveCompany();
  }, [slug]);

  const draftKey = `atmos_survey_draft_${slug ?? ''}`;

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const defaults = {
      tempo_empresa: '',
      setor: '',
      faixa_etaria: '',
      genero: '',
      raca_cor: '',
      q1_pertencimento: '',
      q2_valorizacao: '',
      q3_seguranca: '',
      q4_respeito: '',
      q5_equidade: '',
      q6_capacitacao: '',
      q7_comunicacao: '',
      q8_lideranca: ''
    };

    try {
      const saved = localStorage.getItem(`atmos_survey_draft_${slug ?? ''}`);
      return saved ? { ...defaults, ...(JSON.parse(saved) as Record<string, string>) } : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(formData));
    } catch {
      // Armazenamento indisponível (ex: navegação privada); segue sem rascunho.
    }
  }, [draftKey, formData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error('A variável VITE_API_URL não está configurada na Vercel.');
      }

      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, slug })
      });

      if (response.ok) {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          // Armazenamento indisponível; nada a limpar.
        }
        navigate('/thank-you');
      } else {
        const errorText = await response.text().catch(() => '');
        console.error('Erro ao enviar pesquisa:', response.status, errorText);
        alert(`Não foi possível enviar suas respostas. Erro: ${response.status}. Tente novamente.`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error);
      alert(
        error instanceof Error
          ? `Erro ao enviar a pesquisa: ${error.message}`
          : 'Ocorreu um erro ao enviar a pesquisa. Tente novamente.'
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const currentSectorQuestions = SECTOR_SPECIFIC_QUESTIONS[formData.setor] || [];
  const allFieldNames = [
    'tempo_empresa',
    'setor',
    'faixa_etaria',
    'genero',
    'raca_cor',
    ...LIKERT_QUESTIONS.map((q) => q.name),
    ...currentSectorQuestions.map((q) => q.name)
  ];
  const answeredFields = allFieldNames.filter((name) => formData[name]).length;
  const isResolvingCompanySlowly = useSlowLoading(companyStatus === 'loading');
  const isSubmittingSlowly = useSlowLoading(isSubmitting);

  if (companyStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#f4f8fc] flex flex-col items-center justify-center text-slate-500 text-sm gap-4 px-4">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Carregando pesquisa...</span>
        </div>
        {isResolvingCompanySlowly && (
          <SlowLoadingNotice className="max-w-sm text-center" />
        )}
      </div>
    );
  }

  if (companyStatus === 'not_found') {
    return (
      <div className="min-h-screen bg-[#f4f8fc] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-3">Link de pesquisa inválido</h1>
          <p className="text-sm text-slate-500 mb-6">
            Este link não corresponde a nenhuma pesquisa ativa. Verifique com a sua empresa se o
            endereço está correto.
          </p>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  if (!hasConsented) {
    return (
      <PageBackground>
        <AppHeader title={companyName || 'Atmos'} />

        <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 my-8">
          <Card className="max-w-2xl w-full p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
                Pesquisa de Clima &amp; Inclusão
              </h1>
              <p className="text-sm text-slate-500 mt-1">{companyName}</p>
            </div>

            <div className="text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p>
                <strong className="text-slate-800">Bem-vindo(a) à pesquisa de {companyName}.</strong>
              </p>
              <p>
                Esta pesquisa tem um propósito estritamente diagnóstico, visando entender como as
                práticas de gestão de pessoas impactam o ambiente de trabalho, as relações
                interpessoais e a inclusão na empresa.
              </p>
              <p>
                A sua participação é voluntária. Garantimos o{' '}
                <strong className="text-blue-700">absoluto anonimato e sigilo</strong> das suas
                respostas; não coletamos seu nome, e-mail ou qualquer dado de identificação direta.
                Os dados sociodemográficos solicitados serão analisados apenas em bloco.
              </p>
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-slate-200 text-xs sm:text-sm italic text-slate-500">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>
                  Ao clicar em "Concordo e quero participar", você confirma que compreende o
                  propósito do estudo e concorda em participar de forma livre e esclarecida.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="secondary"
                className="w-full sm:flex-1 whitespace-nowrap"
                onClick={() => navigate('/sobre')}
              >
                Não quero participar
              </Button>
              <Button className="w-full sm:flex-1 whitespace-nowrap" onClick={() => setHasConsented(true)}>
                Concordo e quero participar
              </Button>
            </div>
          </Card>
        </main>
      </PageBackground>
    );
  }

  return (
    <PageBackground className="selection:bg-blue-100 selection:text-blue-900">
      {/* Cabeçalho + barra de progresso (fixos juntos no topo) */}
      <div className="sticky top-0 z-40">
      <header className="bg-white/95 backdrop-blur-md border-b border-[#dce7f2] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <AtmosLogo />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Atmos</span>
                <Badge tone="emerald" dot>
                  Ambiente Seguro
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                Questionário de Clima &amp; Inclusão
              </p>
              <h1 className="font-display text-base font-semibold text-slate-800 leading-tight truncate">
                <span className="sm:hidden">{companyName}</span>
                <span className="hidden sm:inline">
                  Questionário de Clima &amp; Inclusão — {companyName}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span className="font-medium">100% Anônimo</span>
            </div>

            <button
              onClick={() => navigate('/sobre')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg bg-white transition shadow-sm"
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <SurveyProgress answered={answeredFields} total={allFieldNames.length} />
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Banner */}
          <div className="bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 border border-[#dce7f2] rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-700 shrink-0 hidden sm:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                  Sua percepção molda o nosso futuro coletivo
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  Este questionário tem como objetivo compreender a vivência, segurança
                  psicológica e equidade em nosso ambiente de trabalho. Seja sincero(a): nenhuma
                  resposta é identificada individualmente.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 1: Dados Gerais */}
          <DemographicsStep formData={formData} onChange={handleChange} />

          {/* Seção 2: Avaliação Likert */}
          <section className="bg-white border border-[#dce7f2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Passo 2
                </span>
                <span className="text-xs font-semibold text-slate-500">Percepção &amp; Clima</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                2. Avaliação de Práticas e Ambiente
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Indique o quanto você concorda com cada afirmação.
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 hidden sm:flex items-center justify-between text-xs font-medium">
                {LIKERT_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`flex items-center gap-2 ${LEGEND_TEXT_CLASSES[opt.tone]}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${LEGEND_DOT_CLASSES[opt.tone]}`} />
                    <span>
                      {opt.value} = {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {LIKERT_QUESTIONS.map((q, index) => (
                <LikertQuestion
                  key={q.name}
                  name={q.name}
                  text={q.text}
                  index={index + 1}
                  value={formData[q.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>

          {/* Seção 3: Avaliação Específica do Setor */}
          {currentSectorQuestions.length > 0 && (
            <section className="bg-white border border-[#dce7f2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    Passo 3
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Realidade Específica</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Perguntas sobre: {formData.setor}
                </h3>
              </div>

              <div className="space-y-5">
                {currentSectorQuestions.map((q, index) => (
                  <LikertQuestion
                    key={q.name}
                    name={q.name}
                    text={q.text}
                    index={index + 1}
                    prefix="S"
                    value={formData[q.name]}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Rodapé de Ações */}
          {isSubmittingSlowly && <SlowLoadingNotice />}

          <footer className="bg-white border border-[#dce7f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/sobre')}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Cancelar e sair</span>
            </Button>

            <Button
              type="submit"
              variant="celebrate"
              loading={isSubmitting}
              className="w-full sm:w-auto py-3"
            >
              {isSubmitting ? (
                <span>Enviando dados...</span>
              ) : (
                <>
                  <span>Finalizar e Enviar Respostas</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </Button>
          </footer>

          <div className="text-center pb-8">
            <p className="text-xs text-slate-500 inline-flex items-center justify-center gap-1.5 w-full">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Suas respostas são confidenciais e registradas de forma anônima.</span>
            </p>
          </div>
        </form>
      </main>
    </PageBackground>
  );
}
