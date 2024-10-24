import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fechaActivacion, setFechaActivacion] = useState(''); 
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetchPoliticas();
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error obteniendo el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const fetchPoliticas = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/getPoliticas`);
      if (!response.ok) {
        throw new Error('Error al obtener políticas');
      }
      const data = await response.json();
      setPoliticas(data);
    } catch (error) {
      console.error('Error al obtener políticas:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de políticas', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updatePolitica(currentId);
    } else {
      await createPolitica();
    }
    resetForm();
    fetchPoliticas();
  };

  const createPolitica = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/add_politica`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ titulo, contenido, fecha_activacion: fechaActivacion }),
      });
      if (!response.ok) {
        throw new Error('Error al crear política');
      }
      MySwal.fire('Éxito', 'Se insertó correctamente', 'success');
    } catch (error) {
      console.error('Error al crear política:', error);
      MySwal.fire('Error', 'No se pudo crear la política', 'error');
    }
  };

  const updatePolitica = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/edit_politica/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ titulo, contenido, fecha_activacion: fechaActivacion }),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar política');
      }
      MySwal.fire('Éxito', 'Actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar política:', error);
      MySwal.fire('Error', 'No se pudo actualizar la política', 'error');
    }
  };

  const deletePolitica = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/delete_politica/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar política');
        }
        MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
        fetchPoliticas();
      } catch (error) {
        console.error('Error al eliminar política:', error);
        MySwal.fire('Error', 'No se pudo eliminar la política', 'error');
      }
    }
  };

  const editPolitica = (id, titulo, contenido, fecha_activacion) => {
    const formattedDate = new Date(fecha_activacion).toISOString().split('T')[0]; 
    setCurrentId(id);
    setTitulo(titulo);
    setContenido(contenido);
    setFechaActivacion(formattedDate); 
    setEditMode(true);
  };

  const resetForm = () => {
    setTitulo('');
    setContenido('');
    setFechaActivacion(''); 
    setEditMode(false);
    setCurrentId('');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestión de Políticas</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group mb-3">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ingrese título"
            required
            className="form-control"
          />
        </div>
        <div className="input-group mb-3">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Ingrese contenido"
            required
            className="form-control"
            rows="4"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="date"
            value={fechaActivacion}
            onChange={(e) => setFechaActivacion(e.target.value)}
            placeholder="Ingrese fecha de activación"
            required
            className="form-control"
          />
        </div>
        <div className="d-flex justify-content-center gap-2">
          <button type="submit" className="btn btn-primary">
            {editMode ? 'Actualizar' : 'Crear'}
          </button>
          {editMode && (
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Título</th>
            <th>Contenido</th>
            <th>Versión</th>
            <th>Vigente</th>
            <th>Eliminado</th>
            <th>Fecha de creación</th>
            <th>Fecha de vigencia</th>

            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {politicas.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.titulo}</strong></td>
              <td><p >{item.contenido}</p></td>
              <td><p >{item.version}.0</p></td>
              <td><p >{item.vigencia}</p></td>
              <td><p >{item.estado}</p></td>
              <td><p>{new Date(item.fecha_creacion).toISOString().split('T')[0]}</p></td>
              <td><p>{new Date(item.fecha_activacion).toISOString().split('T')[0]}</p></td>

              <td>
                <div className="d-flex justify-content-between">
                  <div>
                    <button
                      onClick={() => editPolitica(item.id, item.titulo, item.contenido, item.fecha_activacion,)}
                      className="btn btn-warning btn-sm me-2 mb-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletePolitica(item.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Politicas;
