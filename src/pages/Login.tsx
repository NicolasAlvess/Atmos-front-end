// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
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

function getResetErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case 'auth/invalid-email':
      return 'Informe um e-mail válido.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um momento e tente novamente.';
    default:
      return 'Não foi possível enviar o e-mail de redefinição. Tente novamente.';
  }
}

export default function Login() {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSent, setResetSent] = useState(false);
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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      const code = (err as { code?: string })?.code;

      if (code === 'auth/user-not-found') {
        // Não confirmamos se o e-mail existe, para não vazar quais empresas estão cadastradas.
        setResetSent(true);
      } else {
        console.error('Erro ao enviar e-mail de redefinição:', err);
        setResetError(getResetErrorMessage(err));
      }
    } finally {
      setIsResetting(false);
    }
  };

  const switchToReset = () => {
    setMode('reset');
    setResetEmail(email);
    setResetError('');
    setResetSent(false);
  };

  const switchToLogin = () => {
    setMode('login');
    setError('');
  };

  return (
    <PageBackground variant="auth" className="justify-between">
      <AppHeader
        onLogoClick={() => navigate('/')}
        badge={
          <>
            <span className="hidden sm:inline-block h-5 w-[1px] bg-slate-200 ml-2 mr-1"></span>
            <Badge tone="violet">Módulo de Gestão &amp; BI</Badge>
          </>
        }
      />

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-10 lg:py-14">
        <div className="w-full max-w-md">
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-indigo-600"></div>

            <div className="text-center mb-7 mt-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              </div>
              <h1 className="font-display text-2xl font-semibold text-slate-800 tracking-tight">
                {mode === 'login' ? 'Acesso da Empresa' : 'Redefinir Senha'}
              </h1>
              {mode === 'reset' && (
                <p className="text-sm text-slate-500 mt-2">
                  Informe o e-mail cadastrado e enviaremos um link para você criar uma nova senha.
                </p>
              )}
            </div>

            {mode === 'login' ? (
              <>
                {error && <div role="alert" className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center animate-[fadeIn_0.3s]">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">E-mail</label>
                    <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="block w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Senha</label>
                      <button
                        type="button"
                        onClick={switchToReset}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <div className="relative">
                      <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} autoComplete="current-password" className="block w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} aria-pressed={showPassword} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-600">
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
              </>
            ) : resetSent ? (
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Se existir uma conta com o e-mail <strong className="text-slate-800">{resetEmail}</strong>,
                  enviamos um link para você redefinir a senha. Confira também a caixa de spam.
                </p>
                <Button type="button" variant="dark" onClick={switchToLogin} className="w-full py-2.5">
                  Voltar para o login
                </Button>
              </div>
            ) : (
              <>
                {resetError && <div role="alert" className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center animate-[fadeIn_0.3s]">{resetError}</div>}

                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">E-mail</label>
                    <input id="reset-email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required disabled={isResetting} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="block w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-sky-50/30 text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="dark" loading={isResetting} className="w-full py-2.5">
                      {!isResetting && <span>Enviar link de redefinição</span>}
                    </Button>
                  </div>
                </form>

                <p className="text-center text-xs text-slate-500 mt-6">
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Voltar para o login
                  </button>
                </p>
              </>
            )}
          </section>
        </div>
      </main>
    </PageBackground>
  );
}
