// src/pages/ThankYou.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import PageBackground from '../components/layout/PageBackground';
import Button from '../components/ui/Button';

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 35,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#4f46e5', '#f97316', '#f43f5e', '#10b981']
    });
  }, []);

  return (
    <PageBackground variant="auth" className="items-center justify-center p-4">
      <div className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-sky-100 shadow-[0_10px_30px_-5px_rgba(27,54,93,0.07)] p-8 text-center">
        <div className="animate-pop mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/25">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="font-display text-2xl font-semibold text-slate-800 tracking-tight mb-3">
          Pesquisa Concluída! 🎉
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Muito obrigado pela sua participação. As suas respostas foram registadas com sucesso, de forma 100% anónima e segura. O seu feedback é fundamental para o nosso diagnóstico de clima e inclusão.
        </p>

        <Button onClick={() => navigate('/')} variant="celebrate" className="w-full py-3">
          Voltar à Tela Inicial
        </Button>
      </div>
    </PageBackground>
  );
}
