import { useState, useEffect } from 'react';

const Auditoria = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch('https://localhost:4000/api/getAuditLogs'); 
        if (!response.ok) {
          throw new Error('Error al obtener los registros de auditoría');
        }
        const logs = await response.json();
        setAuditLogs(logs);
      } catch (error) {
        console.error('Error al obtener los registros de auditoría:', error);
      }
    };

    fetchAuditLogs();
  }, []);

  return (
    <div className="container mt-5">
    <h2>Registro de Auditoría</h2>
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Administrador</th>
            <th scope="col">Acción</th>
            <th scope="col">Tabla Modificada</th>
            <th scope="col">Datos Anteriores</th>
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
                <td>{log.admin_usuario}</td>
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
