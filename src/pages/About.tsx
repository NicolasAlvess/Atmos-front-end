// src/pages/About.tsx
import { useNavigate } from 'react-router-dom';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Card from '../components/ui/Card';

export default function About() {
  const navigate = useNavigate();

  return (
    <PageBackground>
      <AppHeader onLogoClick={() => navigate('/')} />

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 my-8">
        <Card className="max-w-2xl w-full p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
              O que é a{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Atmos
              </span>
              ?
            </h1>
          </div>

          <div className="text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
            <p>
              A <strong className="text-slate-800">Atmos</strong> é uma plataforma de diagnóstico de
              clima organizacional e inclusão. Empresas usam a Atmos para entender, de forma anônima,
              como os colaboradores percebem o ambiente de trabalho — pertencimento, segurança
              psicológica, equidade, liderança e muito mais.
            </p>
            <p>
              Com base nas respostas, o sistema gera automaticamente um{' '}
              <strong className="text-blue-700">diagnóstico de clima</strong> e um{' '}
              <strong className="text-blue-700">plano de intervenção</strong>, fundamentado em teorias
              científicas de gestão e motivação (Vroom, Herzberg, Maslow e Hackman &amp; Oldham), para
              ajudar a empresa a melhorar o ambiente de trabalho de todos.
            </p>
            <p>
              Se você respondeu a uma pesquisa pela Atmos, muito obrigado — sua participação é
              voluntária e <strong className="text-slate-800">100% anônima</strong>: nenhuma resposta é
              identificada individualmente.
            </p>
          </div>
        </Card>
      </main>
    </PageBackground>
  );
}
