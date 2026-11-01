// src/pages/Theories.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackground from '../components/layout/PageBackground';
import AppHeader from '../components/layout/AppHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { THEORIES } from '../lib/theories';

export default function Theories() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(THEORIES[0].id);
  const selected = THEORIES.find((theory) => theory.id === selectedId) ?? THEORIES[0];

  return (
    <PageBackground>
      <AppHeader
        sticky
        title="Atmos — Teorias do Diagnóstico"
        right={
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition"
          >
            Voltar ao painel
          </button>
        }
      />

      <main className="relative z-10 flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-slate-900">
            Teorias usadas no diagnóstico
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            O diagnóstico de clima da Atmos é fundamentado em quatro teorias científicas de
            motivação e gestão. Selecione uma abaixo para entender como ela funciona e como é
            usada para interpretar as suas respostas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {THEORIES.map((theory) => {
              const isActive = theory.id === selectedId;
              return (
                <button
                  key={theory.id}
                  onClick={() => setSelectedId(theory.id)}
                  className={`shrink-0 text-left px-4 py-3 rounded-xl border transition w-full md:w-auto ${
                    isActive
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-[#dce7f2] hover:border-blue-200'
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${
                      isActive ? 'text-blue-700' : 'text-slate-800'
                    }`}
                  >
                    {theory.name}
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">{theory.author}</span>
                </button>
              );
            })}
          </div>

          <Card className="p-6 sm:p-8">
            <div className="mb-5">
              <Badge tone="blue">{selected.author}</Badge>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 mt-3">
                {selected.name}
              </h2>
              <p className="text-sm text-slate-500 mt-1 italic">{selected.tagline}</p>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              {selected.summary.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Pontos-chave
              </p>
              <ul className="space-y-2">
                {selected.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                Como usamos isso no seu diagnóstico
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">{selected.useInAtmos}</p>
            </div>
          </Card>
        </div>
      </main>
    </PageBackground>
  );
}
