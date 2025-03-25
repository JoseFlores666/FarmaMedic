import { Link } from "react-router-dom";
import { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const ServiciosDetalles = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, email, fecha: selectedDate, mensaje });
    alert("Cita médica solicitada con éxito!");
  };

  return (
    <div className="container">
      <nav aria-label="breadcrumb" style={{ margin: "20px 0" }}>
        <ol className="breadcrumb" style={{ display: "flex", gap: "5px", listStyleType: "none", padding: 0 }}>
          <li className="breadcrumb-item">
            <Link to="/Inicio">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/Inicio/servicios1">Servicios</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Solicitar Cita
          </li>
        </ol>
      </nav>

      <h1>Detalles del Servicio</h1>
      <p>Contenido detallado sobre el servicio seleccionado.</p>

      <div className="row">
        <div className="col-md-6">
          <div className="card mt-4">
            <div className="card-header">
              Solicita tu Cita Médica
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mensaje" className="form-label">Motivo de la Consulta</label>
                  <textarea
                    className="form-control"
                    id="mensaje"
                    rows="3"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Solicitar Cita</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mt-4">
            <div className="card-header">
              Elige una Fecha
            </div>
            <div className="card-body">
              <Calendar
                onChange={setSelectedDate} 
                value={selectedDate} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
