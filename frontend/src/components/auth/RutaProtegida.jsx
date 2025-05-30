
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const RutaProtegida = ({ children, requiredRole = null }) => {
  const { user, loading } = useUser();

  // Si aún está cargando el usuario, mostrar loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/inicio-sesion" replace />;
  }

  // Si se requiere un rol específico, verificarlo
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
};

export default RutaProtegida;