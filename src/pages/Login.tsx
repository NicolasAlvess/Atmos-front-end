// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulando tempo de resposta do servidor
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        navigate('/admin/dashboard');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f1f6fb] flex flex-col justify-between text-slate-700 antialiased font-sans animate-[fadeIn_0.3s_ease-out]">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.6) 0px, transparent 50%),
                          radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.5) 0px, transparent 50%),
                          radial-gradient(at 50% 100%, rgba(219, 234, 254, 0.4) 0px, transparent 50%)`
      }}></div>

      <header className="relative z-30 w-full border-b border-sky-100/70 bg-white/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 17c0-3.87 3.13-7 7-7s7 3.13 7 7" /><path d="M8.5 17c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" /><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-800 leading-tight">Atmos</span>
                <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">Diagnóstico & BI</span>
              </div>
            </div>
            <span className="hidden sm:inline-block h-5 w-[1px] bg-slate-200"></span>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
              Módulo de Gestão & BI
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-10 lg:py-14">
        <div className="w-full max-w-md">
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-sky-400"></div>
            
            <div className="text-center mb-7 mt-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Acesso do Pesquisador</h1>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-[fadeIn_0.3s]">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Usuário</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Senha</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-medium text-sm bg-[#162235] hover:bg-slate-900 shadow-md transition-all disabled:opacity-80 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <><span>Entrar no Painel BI</span><svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path></svg></>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}