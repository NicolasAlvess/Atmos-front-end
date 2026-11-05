// src/pages/SignUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Button from '../components/ui/Button';
import PasswordChecklist from '../components/ui/PasswordChecklist';
import SlowLoadingNotice from '../components/ui/SlowLoadingNotice';
import { useSlowLoading } from '../hooks/useSlowLoading';
import { isEmailValid, isPasswordValid } from '../lib/passwordRules';

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

type Field = 'companyName' | 'email' | 'password';

export default function SignUp() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    companyName: false,
    email: false,
    password: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const isLoadingSlowly = useSlowLoading(isLoading);

  const companyNameError =
    touched.companyName && !companyName.trim() ? 'Informe o nome da empresa.' : '';
  const emailError =
    touched.email && !isEmailValid(email) ? 'Digite um e-mail válido.' : '';
  const passwordError =
    touched.password && !isPasswordValid(password)
      ? 'A senha não atende aos critérios abaixo.'
      : '';

  const markTouched = (field: Field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const inputClass = (hasError: boolean) =>
    `block w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border bg-sky-50/30 text-slate-900 focus:ring-2 disabled:opacity-50 ${
      hasError
        ? 'border-red-300 focus:ring-red-400 bg-red-50/40'
        : 'border-slate-200 focus:ring-blue-500'
    }`;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ companyName: true, email: true, password: true });

    if (!companyName.trim() || !isEmailValid(email) || !isPasswordValid(password)) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error('A variável VITE_API_URL não está configurada.');
      }

      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ name: companyName })
      });

      if (!response.ok) {
        throw new Error('Não foi possível criar o perfil da empresa.');
      }

      setSuccess(true);

      setTimeout(() => {
        void signOut(auth).finally(() => navigate('/login'));
      }, 2000);
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
    <PageBackground variant="auth" className="justify-between">
      <AppHeader onLogoClick={() => navigate('/')} />

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-6 py-10 lg:py-14">
        <div className="w-full max-w-md">
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-indigo-600"></div>

            {success ? (
              <div className="text-center py-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="animate-pop mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h1 className="font-display text-2xl font-semibold text-slate-800 tracking-tight mb-2">
                  Cadastro concluído! 🎉
                </h1>
                <p className="text-sm text-slate-500">
                  Sua empresa foi criada com sucesso. Redirecionando para o login...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-7 mt-2">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </div>
                  <h1 className="font-display text-2xl font-semibold text-slate-800 tracking-tight">Cadastre sua Empresa</h1>
                  <p className="text-sm text-slate-500 mt-2">
                    Crie sua conta para gerar o link da pesquisa e acessar o painel de BI.
                  </p>
                </div>

                {error && <div role="alert" className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-center animate-[fadeIn_0.3s]">{error}</div>}

                <form onSubmit={handleSignUp} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Nome da empresa</label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      onBlur={() => markTouched('companyName')}
                      disabled={isLoading}
                      autoComplete="organization"
                      aria-invalid={!!companyNameError}
                      aria-describedby={companyNameError ? 'companyName-error' : undefined}
                      className={inputClass(!!companyNameError)}
                    />
                    {companyNameError && (
                      <p id="companyName-error" className="mt-1.5 text-xs text-red-600">{companyNameError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">E-mail</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => markTouched('email')}
                      disabled={isLoading}
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? 'signup-email-error' : undefined}
                      className={inputClass(!!emailError)}
                    />
                    {emailError && <p id="signup-email-error" className="mt-1.5 text-xs text-red-600">{emailError}</p>}
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Senha</label>
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => markTouched('password')}
                      disabled={isLoading}
                      autoComplete="new-password"
                      aria-invalid={!!passwordError}
                      aria-describedby="signup-password-rules"
                      className={inputClass(!!passwordError)}
                    />
                    {passwordError && <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>}
                    <PasswordChecklist password={password} id="signup-password-rules" />
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button type="submit" variant="dark" loading={isLoading} className="w-full py-2.5">
                      {isLoading ? 'Criando conta...' : 'Criar conta e gerar link'}
                    </Button>
                    {isLoadingSlowly && <SlowLoadingNotice />}
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
              </>
            )}
          </section>
        </div>
      </main>
    </PageBackground>
  );
}
