// Domínio público e estável do app (ex: https://atmos-front-end-plum.vercel.app).
// Usado para montar o link da pesquisa, em vez de window.location.origin, que
// pode ser uma URL de deployment congelada em um build antigo quando o painel
// é acessado por um link de preview específico da Vercel.
export const PUBLIC_SITE_URL =
  import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '') || window.location.origin;
