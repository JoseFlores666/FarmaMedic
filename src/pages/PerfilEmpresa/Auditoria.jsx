import { useState, useEffect } from 'react';

const Auditoria = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getAuditLogs'); 
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
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID Administrador</th>
            <th scope="col">Acción</th>
            <th scope="col">Tabla</th>
            <th scope="col">ID Registro</th>
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
                <td>{log.admin_id}</td>
                <td>{log.action_type}</td>
                <td>{log.table_name}</td>
                <td>{log.record_id}</td>
                <td>
                  <pre>{log.new_data}</pre>
                </td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Auditoria;
