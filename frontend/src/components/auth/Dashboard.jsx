import React, { useEffect, useState } from 'react';
import axios from 'axios';

const rolesDisponibles = ['usuario', 'admin', 'guia'];

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🚀 Dashboard cargado - Obteniendo usuarios...');
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Petición a: http://localhost:5000/usuarios');
      
      const response = await axios.get('http://localhost:5000/usuarios');
      
      console.log('✅ Respuesta exitosa:', response.data);
      console.log('📊 Total usuarios:', response.data.length);
      
      setUsuarios(response.data);
      
    } catch (error) {
      console.error('❌ Error:', error);
      
      if (error.response) {
        console.error('❌ Status:', error.response.status);
        console.error('❌ Data:', error.response.data);
        setError(`Error ${error.response.status}: ${error.response.data.message || 'Error del servidor'}`);
      } else if (error.request) {
        console.error('❌ No response received');
        setError('No se pudo conectar con el servidor. ¿Está corriendo en puerto 5000?');
      } else {
        console.error('❌ Error message:', error.message);
        setError('Error inesperado: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }
    
    try {
      console.log(`🗑️ Eliminando usuario ID: ${id}`);
      await axios.delete(`http://localhost:5000/usuarios/${id}`);
      console.log(`✅ Usuario eliminado`);
      fetchUsuarios(); // Recargar lista
    } catch (error) {
      console.error('❌ Error al eliminar:', error);
      alert('Error al eliminar usuario');
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      console.log(`🔄 Cambiando rol de usuario ${id} a: ${nuevoRol}`);
      await axios.put(`http://localhost:5000/usuarios/${id}/rol`, { rol: nuevoRol });
      console.log(`✅ Rol cambiado`);
      fetchUsuarios(); // Recargar lista
    } catch (error) {
      console.error('❌ Error al cambiar rol:', error);
      alert('Error al cambiar rol');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h3 className="mb-4">Gestión de Usuarios</h3>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando usuarios...</span>
          </div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h3 className="mb-4">Gestión de Usuarios</h3>
        <div className="alert alert-danger">
          <h4 className="alert-heading">❌ Error</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger" onClick={fetchUsuarios}>
              🔄 Reintentar
            </button>
            <button 
              className="btn btn-outline-info" 
              onClick={() => window.open('http://localhost:5000/usuarios', '_blank')}
            >
              🔗 Probar API directamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Gestión de Usuarios</h3>
        <button className="btn btn-outline-primary" onClick={fetchUsuarios}>
          🔄 Actualizar
        </button>
      </div>
      
      {usuarios.length === 0 ? (
        <div className="alert alert-warning">
          <h4 className="alert-heading">⚠️ Sin usuarios</h4>
          <p>No se encontraron usuarios registrados.</p>
        </div>
      ) : (
        <>
          <div className="alert alert-success">
            ✅ <strong>{usuarios.length}</strong> usuario(s) encontrado(s)
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="badge bg-secondary">{usuario.id}</span>
                    </td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.correo}</td>
                    <td>
                      <select
                        value={usuario.rol}
                        onChange={e => cambiarRol(usuario.id, e.target.value)}
                        className="form-select form-select-sm"
                        style={{ minWidth: '100px' }}
                      >
                        {rolesDisponibles.map(rol => (
                          <option key={rol} value={rol}>
                            {rol.charAt(0).toUpperCase() + rol.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarUsuario(usuario.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;