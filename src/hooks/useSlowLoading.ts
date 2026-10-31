import { useEffect, useState } from 'react';

/**
 * Fica `true` quando `isLoading` permanece ativo por mais que `thresholdMs`.
 * Usado para avisar o usuário quando o backend (Render free tier) está
 * "acordando" de hibernação e a resposta demora mais que o normal.
 */
export function useSlowLoading(isLoading: boolean, thresholdMs = 4000): boolean {
  const [isSlow, setIsSlow] = useState(false);
  const [trackedIsLoading, setTrackedIsLoading] = useState(isLoading);

  // Reinicia o estado assim que `isLoading` muda, seguindo o padrão do React
  // de ajustar estado durante a renderização em vez de usar um efeito para isso.
  if (isLoading !== trackedIsLoading) {
    setTrackedIsLoading(isLoading);
    setIsSlow(false);
  }

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setTimeout(() => setIsSlow(true), thresholdMs);

    return () => clearTimeout(timer);
  }, [isLoading, thresholdMs]);

  return isLoading && isSlow;
}
