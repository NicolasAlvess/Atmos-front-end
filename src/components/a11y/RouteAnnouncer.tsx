import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteTitle {
  test: (pathname: string) => boolean;
  title: string;
}

const ROUTE_TITLES: RouteTitle[] = [
  { test: (p) => p === '/', title: 'Página inicial — Atmos' },
  { test: (p) => p === '/login', title: 'Login — Atmos' },
  { test: (p) => p === '/signup', title: 'Cadastro de empresa — Atmos' },
  { test: (p) => p === '/admin/dashboard', title: 'Painel de diagnóstico — Atmos' },
  { test: (p) => p === '/admin/teorias', title: 'Teorias do diagnóstico — Atmos' },
  { test: (p) => p === '/sobre', title: 'Sobre a Atmos' },
  { test: (p) => p === '/thank-you', title: 'Pesquisa concluída — Atmos' },
  { test: (p) => p.startsWith('/survey/'), title: 'Pesquisa de clima — Atmos' }
];

function getTitleForPath(pathname: string): string {
  return ROUTE_TITLES.find((route) => route.test(pathname))?.title ?? 'Atmos | Diagnóstico Organizacional';
}

/**
 * Em uma SPA a troca de rota não recarrega a página, então leitores de tela não
 * percebem a navegação sozinhos. Este componente atualiza o <title> e anuncia
 * a nova página via uma região aria-live, como um app com navegação tradicional faria.
 */
export default function RouteAnnouncer() {
  const location = useLocation();
  const title = getTitleForPath(location.pathname);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div aria-live="polite" role="status" className="sr-only">
      {title}
    </div>
  );
}
