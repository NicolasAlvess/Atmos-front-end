// src/pages/SignUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function getSignUpErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente fazer login.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    default:
      return 'Não foi possível criar a conta. Tente novamente.';
  }
}

export default function SignUp() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error('A variável VITE_API_URL não está configurada.');
      }

      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await credential.user.getIdToken();

      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/companies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ name: companyName })
        }
      );

      if (!response.ok) {
        throw new Error('Não foi possível criar o perfil da empresa.');
      }

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erro ao cadastrar empresa:', err);
      setError(
        err instanceof Error && (err as { code?: string }).code
          ? getSignUpErrorMessage(err)
          : err instanceof Error
            ? err.message
            : 'Não foi possível criar a conta. Tente novamente.'
      );
      setIsLoading(false);
    }
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
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-10 lg:py-14">
        <div className="w-full max-w-md">
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-sky-400"></div>

            <div className="text-center mb-7 mt-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cadastre sua Empresa</h1>
              <p className="text-sm text-slate-500 mt-2">
                Crie sua conta para gerar o link da pesquisa e acessar o painel de BI.
              </p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-[fadeIn_0.3s]">{error}</div>}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Nome da empresa</label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required disabled={isLoading} className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isLoading} className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-medium text-sm bg-[#162235] hover:bg-slate-900 shadow-md transition-all disabled:opacity-80 disabled:cursor-not-allowed">
                  {isLoading ? 'Criando conta...' : 'Criar conta e gerar link'}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Entrar
              </button>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
