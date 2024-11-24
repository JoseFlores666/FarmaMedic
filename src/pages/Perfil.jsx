import  { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Perfil = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const apiUrl = 'https://localhost:4000/api/perfil';

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPerfiles(response.data);
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de perfiles', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updatePerfil(currentId);
    } else {
      await createPerfil();
    }
    resetForm();
    fetchPerfiles();
  };

  const createPerfil = async () => {
    try {
      await axios.post(apiUrl, { mision, vision });
      MySwal.fire('Éxito', 'Perfil creado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear perfil:', error);
      MySwal.fire('Error', 'No se pudo crear el perfil', 'error');
    }
  };

  const updatePerfil = async (id) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { mision, vision });
      MySwal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      MySwal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
  };

  const deletePerfil = async (id) => {
    const confirm = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
        fetchPerfiles();
      } catch (error) {
        console.error('Error al eliminar perfil:', error);
        MySwal.fire('Error', 'No se pudo eliminar el perfil', 'error');
      }
    }
  };

  const editPerfil = (id, mision, vision) => {
    setCurrentId(id);
    setMision(mision);
    setVision(vision);
    setEditMode(true);
  };

  const resetForm = () => {
    setMision('');
    setVision('');
    setEditMode(false);
    setCurrentId('');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestión de Misión y Visión</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            value={mision}
            onChange={(e) => setMision(e.target.value)}
            placeholder="Ingrese la misión"
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Ingrese la visión"
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
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Misión</th>
            <th>Visión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {perfiles.map((item) => (
            <tr key={item._id}>
              <td>{item.mision}</td>
              <td>{item.vision}</td>
              <td>
                <button
                  onClick={() => editPerfil(item._id, item.mision, item.vision)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Editar
                </button>
                <button onClick={() => deletePerfil(item._id)} className="btn btn-danger btn-sm">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Perfil;
