
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Survey() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Record<string, string>>({
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error(
          'A variável VITE_API_URL não está configurada na Vercel.'
        );
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/survey`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        navigate('/thank-you');
      } else {
        const errorText = await response.text().catch(() => '');

        console.error(
          'Erro ao enviar pesquisa:',
          response.status,
          errorText
        );

        alert(
          `Não foi possível enviar suas respostas. Erro: ${response.status}. Tente novamente.`
        );

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
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const likertQuestions = [
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

  const sectorSpecificQuestions: Record<
    string,
    { name: string; text: string }[]
  > = {
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

  const currentSectorQuestions =
    sectorSpecificQuestions[formData.setor] || [];

  const likertOptions = [
    { value: '1', label: 'Discordo Totalmente' },
    { value: '2', label: 'Discordo Parcialmente' },
    { value: '3', label: 'Neutro' },
    { value: '4', label: 'Concordo Parcialmente' },
    { value: '5', label: 'Concordo Totalmente' }
  ];

  return (
    <div className="min-h-screen bg-[#f4f8fc] font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col animate-[fadeIn_0.4s_ease-out]">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dce7f2] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
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

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
                  Atmos
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ambiente Seguro
                </span>
              </div>

              <h1 className="text-base font-bold text-slate-800 leading-tight">
                Questionário de Clima &amp; Inclusão
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-sm">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg bg-white transition shadow-sm"
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Banner */}
          <div className="bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 border border-[#dce7f2] rounded-2xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-700 shrink-0 hidden sm:block">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                  Este questionário tem como objetivo compreender a vivência,
                  segurança psicológica e equidade em nosso ambiente de
                  trabalho. Seja sincero(a): nenhuma resposta é identificada
                  individualmente.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 1: Dados Gerais */}
          <section className="bg-white border border-[#dce7f2] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Passo 1
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Demografia
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Dados Gerais
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                As respostas demográficas abaixo não serão cruzadas de modo
                individual. Grupos são agregados para total sigilo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Tempo de Empresa
                </label>
                <select
                  name="tempo_empresa"
                  value={formData.tempo_empresa}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Menos de 6 meses">Menos de 6 meses</option>
                  <option value="6 meses a 1 ano">6 meses a 1 ano</option>
                  <option value="1 a 3 anos">1 a 3 anos</option>
                  <option value="3 a 5 anos">3 a 5 anos</option>
                  <option value="Mais de 5 anos">Mais de 5 anos</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Setor
                </label>
                <select
                  name="setor"
                  value={formData.setor}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Administrativo / Backoffice">
                    Administrativo / Backoffice
                  </option>
                  <option value="Comercial / Vendas">Comercial / Vendas</option>
                  <option value="Liderança / Gestão">Liderança / Gestão</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Faixa Etária
                </label>
                <select
                  name="faixa_etaria"
                  value={formData.faixa_etaria}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Até 24 anos">Até 24 anos</option>
                  <option value="25 a 34 anos">25 a 34 anos</option>
                  <option value="35 a 44 anos">35 a 44 anos</option>
                  <option value="45 a 54 anos">45 a 54 anos</option>
                  <option value="55 anos ou mais">55 anos ou mais</option>
                  <option value="Prefiro não responder">
                    Prefiro não responder
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Gênero
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Não binário">Não binário</option>
                  <option value="Prefiro não responder">
                    Prefiro não responder
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Raça/Cor
                </label>
                <select
                  name="raca_cor"
                  value={formData.raca_cor}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Parda">Parda</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Indígena">Indígena</option>
                  <option value="Prefiro não responder">
                    Prefiro não responder
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* Seção 2: Avaliação Likert */}
          <section className="bg-white border border-[#dce7f2] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Passo 2
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Percepção &amp; Clima
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                2. Avaliação de Práticas e Ambiente
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Indique o quanto você concorda com cada afirmação.
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/70 hidden sm:flex items-center justify-between text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span>1 = Discordo Totalmente</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>2 = Discordo Parcialmente</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>3 = Neutro</span>
                </div>
                <div className="flex items-center gap-2 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span>4 = Concordo Parcialmente</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>5 = Concordo Totalmente</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {likertQuestions.map((q, index) => (
                <article
                  key={q.name}
                  className="p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-200 bg-[#fbfdff] transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                        {index + 1}
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                        {q.text}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                      {likertOptions.map((opt) => (
                        <div key={`${q.name}_${opt.value}`}>
                          <input
                            type="radio"
                            id={`${q.name}_${opt.value}`}
                            name={q.name}
                            value={opt.value}
                            checked={formData[q.name] === opt.value}
                            onChange={handleChange}
                            className="peer sr-only"
                            required
                          />
                          <label
                            htmlFor={`${q.name}_${opt.value}`}
                            className="flex sm:flex-col items-center justify-between sm:justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-center text-xs font-semibold text-slate-700 transition peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-1 peer-checked:ring-blue-600"
                          >
                            <span className="text-slate-400 sm:mb-1 font-bold peer-checked:text-blue-700">
                              {opt.value}
                            </span>
                            <span className="text-[10px] sm:text-xs leading-tight">
                              {opt.label}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
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
                  <span className="text-xs font-semibold text-slate-500">
                    Realidade Específica
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Perguntas sobre: {formData.setor}
                </h3>
              </div>

              <div className="space-y-5">
                {currentSectorQuestions.map((q, index) => (
                  <article
                    key={q.name}
                    className="p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-200 bg-[#fbfdff] transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs">
                          S{index + 1}
                        </span>
                        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                          {q.text}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                        {likertOptions.map((opt) => (
                          <div key={`${q.name}_${opt.value}`}>
                            <input
                              type="radio"
                              id={`${q.name}_${opt.value}`}
                              name={q.name}
                              value={opt.value}
                              checked={formData[q.name] === opt.value}
                              onChange={handleChange}
                              className="peer sr-only"
                              required
                            />
                            <label
                              htmlFor={`${q.name}_${opt.value}`}
                              className="flex sm:flex-col items-center justify-between sm:justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-center text-xs font-semibold text-slate-700 transition peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-1 peer-checked:ring-blue-600"
                            >
                              <span className="text-slate-400 sm:mb-1 font-bold peer-checked:text-blue-700">
                                {opt.value}
                              </span>
                              <span className="text-[10px] sm:text-xs leading-tight">
                                {opt.label}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Rodapé de Ações */}
          <footer className="bg-white border border-[#dce7f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Voltar ao Início</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-2.647z"
                    />
                  </svg>
                  <span>Enviando dados...</span>
                </>
              ) : (
                <>
                  <span>Finalizar e Enviar Respostas</span>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </footer>

          <div className="text-center pb-8">
            <p className="text-xs text-slate-500 inline-flex items-center justify-center gap-1.5 w-full">
              <svg
                className="w-3.5 h-3.5 text-emerald-600"
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
                Suas respostas são confidenciais e registradas de forma anônima.
              </span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
