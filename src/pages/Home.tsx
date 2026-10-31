// src/pages/Home.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStart = () => {
    setIsNavigating(true);
    // Aumentamos o tempo para 1.5s para a animação do card ser apreciada
    setTimeout(() => {
      navigate('/signup');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex flex-col font-sans text-slate-800 antialiased animate-[fadeIn_0.4s_ease-out]">
      
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.4) 0px, transparent 50%),
                          radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.3) 0px, transparent 50%)`
      }}></div>

      {/* Cabeçalho Atmos */}
      <header className="relative z-40 bg-white/95 backdrop-blur-md border-b border-[#dce7f2] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Ícone Atmos */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 17c0-3.87 3.13-7 7-7s7 3.13 7 7" />
                <path d="M8.5 17c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" />
                <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            {/* Nome e Badge */}
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight">Atmos</span>
              <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">Diagnóstico & BI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')} 
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition px-2 py-1"
            >
              Acesso Restrito
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-8 sm:p-10 min-h-[450px] flex flex-col justify-center">
          
          {isNavigating ? (
            // Card Dinâmico de Carregamento
            <div className="flex flex-col items-center justify-center py-10 animate-[fadeIn_0.3s_ease-out]">
              <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                {/* Anéis de carregamento */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                {/* Ícone central pulsante */}
                <div className="absolute inset-0 flex items-center justify-center text-blue-600 animate-pulse">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Preparando ambiente seguro...</h2>
              <p className="text-slate-500 text-sm animate-pulse">Estabelecendo conexão criptografada com a Atmos.</p>
            </div>
          ) : (
            // Conteúdo Padrão
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  Diagnóstico de Clima Organizacional
                </h1>
              </div>

              <div className="text-slate-600 space-y-4 mb-8 text-sm sm:text-base leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p>
                  <strong className="text-slate-800">Bem-vindo(a) à Atmos.</strong>
                </p>
                <p>
                  Cadastre sua empresa para gerar um link exclusivo de pesquisa, enviá-lo aos colaboradores e acompanhar em tempo real o diagnóstico de clima e inclusão da sua organização.
                </p>
                <p>
                  As respostas dos colaboradores são <strong className="text-blue-700">100% anônimas</strong> e os dados de cada empresa ficam isolados e visíveis apenas para ela. O sistema gera automaticamente um diagnóstico e um plano de intervenção fundamentado em teorias científicas de gestão (Vroom, Herzberg, Maslow e Hackman & Oldham).
                </p>
              </div>

              <button
                onClick={handleStart}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span>Cadastrar minha Empresa</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="relative z-10 w-full border-t border-sky-100/80 bg-white/50 backdrop-blur-sm py-4 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
            </svg>
            <span>Criptografia TLS 256-bit • Dados Consolidados & Anônimos</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">© 2026 Atmos Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}