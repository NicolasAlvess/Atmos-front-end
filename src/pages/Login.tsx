// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

function getLoginErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Credenciais inválidas. Verifique o e-mail e a senha.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um momento e tente novamente.';
    default:
      return 'Não foi possível entrar. Tente novamente.';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erro ao entrar:', err);
      setError(getLoginErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <PageBackground variant="auth" className="justify-between">
      <AppHeader
        onLogoClick={() => navigate('/')}
        badge={
          <>
            <span className="hidden sm:inline-block h-5 w-[1px] bg-slate-200 ml-2 mr-1"></span>
            <Badge tone="blue">Módulo de Gestão &amp; BI</Badge>
          </>
        }
      />

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-10 lg:py-14">
        <div className="w-full max-w-md">
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-600 to-sky-400"></div>

            <div className="text-center mb-7 mt-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Acesso da Empresa</h1>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-[fadeIn_0.3s]">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="block w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
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
                <Button type="submit" variant="dark" loading={isLoading} className="w-full py-2.5">
                  {!isLoading && (
                    <>
                      <span>Entrar no Painel BI</span>
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Cadastre sua empresa
              </button>
            </p>
          </section>
        </div>
      </main>
    </PageBackground>
  );
}
