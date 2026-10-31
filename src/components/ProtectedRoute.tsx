import { Navigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, checking } = useAuthUser();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f8fc] text-slate-500 text-sm">
        Verificando sessão...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
