// src/pages/About.tsx
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import AtmosLogo from '../components/icons/AtmosLogo';
import { THEORIES } from '../lib/theories';
import { getClimateBarColor } from '../lib/climateColor';
import AnimatedBar from '../components/ui/AnimatedBar';

const WHY_IT_MATTERS = [
  {
    title: 'Mostra o que ninguém diz em voz alta',
    description:
      'Respostas 100% anônimas captam problemas reais de convivência, liderança e inclusão que raramente surgem em conversas diretas, por medo de retaliação.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    )
  },
  {
    title: 'Reduz a rotatividade e o retrabalho',
    description:
      'Equipes que se sentem ouvidas e respeitadas tendem a permanecer mais tempo e a se engajar mais, reduzindo os custos escondidos de recontratar e retreinar.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 7a4 4 0 100 8 4 4 0 000-8zM3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M17 11l2 2 4-4"
      />
    )
  },
  {
    title: 'Transforma percepção em decisão',
    description:
      'Em vez de depender só da intuição da liderança, a empresa passa a agir com base em dados reais sobre como as pessoas realmente vivem o dia a dia no trabalho.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    )
  }
];

const HOW_IT_WORKS = [
  {
    title: 'A empresa se cadastra',
    description: 'Cria uma conta em minutos e recebe um link exclusivo de pesquisa para distribuir aos colaboradores.'
  },
  {
    title: 'Colaboradores respondem, de forma anônima',
    description: 'Sem nome ou e-mail: só perguntas de clima numa escala de 1 a 5 e dados demográficos agregados.'
  },
  {
    title: 'O diagnóstico é gerado automaticamente',
    description: 'Cada dimensão recebe uma nota, uma classificação (forte, alerta ou crítica) e a teoria científica que explica o resultado.'
  },
  {
    title: 'O gestor acompanha tudo em um painel',
    description: 'Ranking das dimensões, plano de intervenção priorizado e evolução do clima entre rodadas de pesquisa.'
  }
];

const SAMPLE_DIMENSIONS = [
  { nome: 'Pertencimento', nota: 4.1 },
  { nome: 'Respeito e Diversidade', nota: 4.1 },
  { nome: 'Comunicação', nota: 3.5 },
  { nome: 'Equidade', nota: 2.6 },
  { nome: 'Segurança Psicológica', nota: 2.5 }
];

function sampleClassification(nota: number): { label: string; tone: 'emerald' | 'amber' | 'red' } {
  if (nota >= 4.0) return { label: 'Ponto Forte', tone: 'emerald' };
  if (nota >= 3.0) return { label: 'Alerta', tone: 'amber' };
  return { label: 'Crítico', tone: 'red' };
}

const CURIOSITIES = [
  'O estudo de clima organizacional tem raízes nos experimentos de Hawthorne, na década de 1930, que mostraram que fatores sociais afetam a produtividade tanto quanto fatores físicos do ambiente de trabalho.',
  '"Segurança psicológica" é um termo popularizado pela pesquisadora Amy Edmondson, de Harvard, e hoje é apontado como um dos fatores mais citados em equipes de alta performance.',
  'Pesquisas de clima verdadeiramente anônimas tendem a revelar problemas que dificilmente apareceriam em conversas individuais com a liderança.',
  'Pequenas melhorias de clima, sustentadas de forma contínua, costumam gerar mais engajamento do que grandes mudanças pontuais e isoladas.'
];

export default function About() {
  return (
    <PageBackground>
      <AppHeader />

      <main className="relative z-10 flex-grow">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            O que é a{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Atmos
            </span>
            ?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A Atmos é uma plataforma de diagnóstico de clima organizacional e inclusão. Empresas
            usam a Atmos para entender, de forma 100% anônima, como os colaboradores percebem o
            dia a dia no trabalho — e para transformar essas respostas em um plano de ação real.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Badge tone="blue">8 dimensões avaliadas</Badge>
            <Badge tone="violet">4 teorias científicas</Badge>
            <Badge tone="emerald">100% anônimo</Badge>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <div className="text-center mb-8">
            <Badge tone="blue">Como funciona</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mt-3">
              Da resposta ao plano de ação, em quatro passos
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl mx-auto">
              Nenhuma planilha manual: o sistema cuida de tudo, da coleta à interpretação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ol className="space-y-5">
              {HOW_IT_WORKS.map((item, index) => (
                <li
                  key={item.title}
                  className="flex gap-4 animate-[fadeIn_0.5s_ease-out_backwards]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-display font-semibold flex items-center justify-center shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Card className="p-6 animate-[fadeIn_0.6s_ease-out_backwards]" style={{ animationDelay: '200ms' }}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Exemplo de diagnóstico gerado
              </p>
              <div className="space-y-3">
                {SAMPLE_DIMENSIONS.map((dimension) => {
                  const classification = sampleClassification(dimension.nota);
                  return (
                    <div key={dimension.nome}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-medium text-slate-700 truncate" title={dimension.nome}>
                          {dimension.nome}
                        </span>
                        <Badge tone={classification.tone}>{classification.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <AnimatedBar percent={(dimension.nota / 5) * 100} color={getClimateBarColor(dimension.nota)} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 w-9 text-right shrink-0">
                          {dimension.nota.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-4">Dados ilustrativos, só para exemplificar o formato do diagnóstico.</p>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
          <div className="text-center mb-8">
            <Badge tone="blue">Por que isso importa</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mt-3">
              A pesquisa de clima é fundamental para um ambiente melhor
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl mx-auto">
              Um bom ambiente de trabalho não acontece por acaso — ele é construído a partir de
              escuta real, continuada e sem medo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WHY_IT_MATTERS.map((item, index) => (
              <Card
                key={item.title}
                hoverable
                className="p-6 animate-[fadeIn_0.5s_ease-out_backwards]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white/70 border-y border-[#dce7f2] backdrop-blur-sm py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <Badge tone="violet">Base científica</Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mt-3">
                Teorias por trás do diagnóstico
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl mx-auto">
                Cada resposta da sua pesquisa é interpretada à luz de quatro teorias clássicas de
                motivação e gestão, não apenas de uma média numérica.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {THEORIES.map((theory, index) => (
                <Card
                  key={theory.id}
                  hoverable
                  className="p-6 flex gap-4 animate-[fadeIn_0.5s_ease-out_backwards]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div
                    className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-display font-semibold shadow-sm ${
                      ['bg-gradient-to-tr from-blue-600 to-indigo-600',
                        'bg-gradient-to-tr from-indigo-500 to-violet-600',
                        'bg-gradient-to-tr from-violet-500 to-fuchsia-600',
                        'bg-gradient-to-tr from-orange-500 to-rose-500'][index % 4]
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-800">{theory.name}</h3>
                    <p className="text-xs font-medium text-blue-600 mb-2">{theory.author}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{theory.tagline}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <Badge tone="amber">Curiosidades</Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 mt-3">
              Um pouco sobre clima organizacional
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CURIOSITIES.map((fact, index) => (
              <div
                key={index}
                className="bg-white border border-[#dce7f2] rounded-2xl p-5 shadow-sm flex gap-3 animate-[fadeIn_0.5s_ease-out_backwards]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <span className="shrink-0 w-7 h-7 rounded-full bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 text-center">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Se você respondeu a uma pesquisa pela Atmos, muito obrigado — sua participação é{' '}
              <strong className="text-slate-800">voluntária</strong> e{' '}
              <strong className="text-slate-800">100% anônima</strong>: nenhuma resposta é
              identificada individualmente.
            </p>
          </Card>
        </section>
      </main>

      <footer className="relative z-10 w-full border-t border-sky-100/80 bg-white/70 backdrop-blur-sm py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
              <AtmosLogo />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-slate-800">Atmos</p>
              <p className="text-xs text-slate-500">Diagnóstico de clima &amp; inclusão</p>
              <p className="text-xs text-slate-500">Desenvolvido por PsicoStudent</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Fale com a gente</p>
            <a
              href="mailto:nicolasoliveira.alves@gmail.com"
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              nicolasoliveira.alves@gmail.com
            </a>
            <span className="text-slate-500">© 2026 Atmos Platform</span>
          </div>
        </div>
      </footer>
    </PageBackground>
  );
}
