// src/pages/ThankYou.tsx
import { useNavigate } from 'react-router-dom';
import PageBackground from '../components/layout/PageBackground';
import Button from '../components/ui/Button';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <PageBackground variant="auth" className="items-center justify-center p-4">
      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">Pesquisa Concluída!</h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Muito obrigado pela sua participação. As suas respostas foram registadas com sucesso, de forma 100% anónima e segura. O seu feedback é fundamental para o nosso diagnóstico de clima e inclusão.
        </p>

        <Button onClick={() => navigate('/')} className="w-full py-3">
          Voltar à Tela Inicial
        </Button>
      </div>
    </PageBackground>
  );
}
