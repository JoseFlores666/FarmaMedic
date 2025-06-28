import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Auditoria = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const navigate = useNavigate();

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getAuditLogs`);
      
      if (response.status === 404) {
        const errorMessage = await response.text();
        console.log('Respuesta 404:', errorMessage);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Error al obtener los registros de auditoría');
      }

      const logs = await response.json();
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error al obtener los registros de auditoría:', error);
    throw error;
    }
  }, [navigate]); 

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div className="container mb-5">
      <h2>Registro de Auditoría</h2>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Administrador</th>
              <th scope="col">Acción</th>
              <th scope="col">Tabla Modificada</th>
              <th scope="col">Datos anteriores</th>
              <th scope="col">Datos Nuevos</th>
              <th scope="col">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay registros de auditoría</td>
              </tr>
            ) : (
              auditLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.usuario}</td>
                  <td>{log.action_type}</td>
                  <td>{log.table_name}</td>
                  <td>{log.old_data}</td>
                  <td>{log.new_data}</td>
                  <td>{new Date(log.fecha_creacion).toISOString().slice(0, 19).replace('T', ' ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Auditoria;
