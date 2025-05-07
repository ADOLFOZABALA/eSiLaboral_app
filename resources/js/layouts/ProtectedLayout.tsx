import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthUser from '@/hooks/useAuthUser'; // o la ruta donde lo tengas

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = useAuthUser();

  // Si aún está cargando (ajusta esto si implementas loading)
  if (user === null) {
    // También podrías mostrar un spinner de carga
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* Aquí podrías poner un header, sidebar, etc */}
      <header className="bg-dark text-white p-2 d-flex justify-content-between">
        <div>Bienvenido, {user.name}</div>
        <div>{user.role?.name?.toUpperCase()}</div>
      </header>

      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
