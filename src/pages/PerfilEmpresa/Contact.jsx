import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Contact = () => {
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [title, setTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [eslogan, setEslogan] = useState('');
  const [esloganId, setEsloganId] = useState(null);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    fetchContactInfo();
    fetchEslogan();
    fetchTitle();
  }, [updated]);

  const fetchContactInfo = async () => {
    const response = await fetch('https://back-farmam.onrender.com/api/getContactInfo');
    if (!response.ok) throw new Error('No se pudo obtener la información de contacto');
    const data = await response.json();
    setDireccion(data.direccion);
    setEmail(data.email);
    setTelefono(data.telefono);
  };

  const fetchEslogan = async () => {
    const response = await fetch('https://back-farmam.onrender.com/api/getEslogan');
    if (!response.ok) throw new Error('Error al obtener el eslogan');
    const data = await response.json();
    setEslogan(data.eslogan || '');
    setEsloganId(data.id);
  };

  const fetchTitle = async () => {
    const response = await fetch('https://back-farmam.onrender.com/api/getTitle', { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener el título');
    const data = await response.json();
    setTitle(data[0]?.title || '');
    setNewTitle(data[0]?.title || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateInputs()) return;
    try {
      let response = await fetch('https://back-farmam.onrender.com/api/upsertContactInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direccion, email, telefono }),
      });
      if (!response.ok) throw new Error('Error al guardar los datos de contacto');
      await fetchContactInfo(); 
  
      if (!esloganId) {
        MySwal.fire('Error', 'No hay eslogan para eliminar', 'error');
        return;
      }
  
      response = await fetch('https://back-farmam.onrender.com/api/updateTitle/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) throw new Error('Error al actualizar el título');

      MySwal.fire('¡Éxito!', 'Todos los datos han sido actualizados correctamente.', 'success');

      setTitle(newTitle); 
  
      const esloganMethod = esloganId ? 'PUT' : 'POST';
      const esloganUrl = esloganId
        ? `https://back-farmam.onrender.com/api/updateEslogan/${esloganId}`
        : 'https://back-farmam.onrender.com/api/createEslogan';
      response = await fetch(esloganUrl, {
        method: esloganMethod,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eslogan }),
      });
      if (!response.ok) throw new Error('Error al guardar el eslogan');
  
      if (!response.ok) throw new Error('Error al guardar el enlace');
  
      setUpdated(!updated);
  
      await Promise.all([
        fetchContactInfo(),
        fetchEslogan(),
        fetchTitle(),
        console.log(title)
      ]);
    } catch (error) {
      MySwal.fire('Error', error.message, 'error');
    }
  };
  
  const validateInputs = () => {
    if (newTitle.length === 0 || newTitle.length > 255) {
      MySwal.fire('Error', 'El título debe tener entre 1 y 255 caracteres.', 'error');
      return false;
    }
    if (eslogan.length > 255) {
      MySwal.fire('Error', 'El eslogan no puede tener más de 255 caracteres', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      MySwal.fire('Error', 'Formato de correo electrónico inválido', 'error');
      return false;
    }
    if (!/^[0-9]{10,15}$/.test(telefono)) {
      MySwal.fire('Error', 'Formato de número de teléfono inválido', 'error');
      return false;
    }
    return true;
  };

  return (
    <div className="container mt-5">
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="tittle" className="form-label">Titulo de la empresa</label>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ingrese nuevo título"
          required
          className="form-control"
          maxLength={25}
        />
      </div>
  
      <div className="mb-3">
        <label className="mb-1" htmlFor="">
          Ingrese el Eslogan:
        </label>
        <input
          type="text"
          value={eslogan}
          onChange={(e) => setEslogan(e.target.value)}
          placeholder="Ingrese el eslogan"
          required
          className="form-control"
          maxLength="25"
        />
      </div>
  
      <div className="mb-3">
        <label htmlFor="direccion" className="form-label">Dirección Física de la empresa</label>
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
          maxLength={10}
        />
      </div>
  
      <div className="d-flex align-items-center justify-content-center gap-2">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </div>
    </form>
  
  </div>
  
  );
};

export default Contact;
