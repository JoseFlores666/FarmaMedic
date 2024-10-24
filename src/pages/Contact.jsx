import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Contact = () => {
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/contact');
      const data = await response.json();
      setDireccion(data.direccion);
      setEmail(data.email);
      setTelefono(data.telefono);
    } catch (error) {
      console.error('Error al obtener datos de contacto:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación en el lado del cliente
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(email)) {
      MySwal.fire('Error', 'Formato de correo electrónico inválido', 'error');
      return;
    }

    if (!phoneRegex.test(telefono)) {
      MySwal.fire('Error', 'Formato de número de teléfono inválido', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direccion, email, telefono }),
      });

      if (response.ok) {
        MySwal.fire('Éxito', 'Datos de contacto guardados correctamente', 'success');
        fetchContactInfo();
      } else {
        MySwal.fire('Error', 'Error al guardar los datos de contacto', 'error');
      }
    } catch (error) {
      console.error('Error al guardar los datos de contacto:', error);
      MySwal.fire('Error', 'Error al guardar los datos de contacto', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Datos de Contacto</h1>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
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
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
};
