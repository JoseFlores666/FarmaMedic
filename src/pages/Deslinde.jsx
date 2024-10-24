import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Deslinde = () => {
  const [deslindes, setDeslindes] = useState([]);
  const [deslinde, setDeslinde] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // Obtiene el token CSRF al cargar el componente
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

  // Función para obtener la lista de deslindes
  const fetchDeslindes = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/getDeslindes`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setDeslindes(result);
    } catch (error) {
      console.error('Error fetching deslindes:', error);
      MySwal.fire('Error', 'No se pudo obtener la lista de deslindes', 'error');
    }
  };

  // Obtiene la lista de deslindes al cargar el componente
  useEffect(() => {
    fetchDeslindes();
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await updateDeslinde(currentId);
    } else {
      await createDeslinde();
    }

    resetForm();
    fetchDeslindes(); // Actualizar la lista después de crear/actualizar
  };

  // Crea un nuevo deslinde
  const createDeslinde = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/add_deslinde`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ deslinde }),
      });

      if (!response.ok) throw new Error('Error al crear deslinde');
      MySwal.fire('Éxito', 'Deslinde creado correctamente', 'success');
    } catch (error) {
      console.error('Error creando deslinde:', error);
      MySwal.fire('Error', 'No se pudo crear el deslinde', 'error');
    }
  };

  const updateDeslinde = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/edit_deslinde/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ deslinde }),
      });

      if (!response.ok) throw new Error('Error al actualizar deslinde');
      MySwal.fire('Éxito', 'Deslinde actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error actualizando deslinde:', error);
      MySwal.fire('Error', 'No se pudo actualizar el deslinde', 'error');
    }
  };

  // Elimina un deslinde
  const deleteDeslinde = async (id) => {
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
        const response = await fetch(`http://localhost:4000/api/delete_deslinde/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Error al eliminar deslinde');
        MySwal.fire('Eliminado', 'Deslinde eliminado correctamente', 'success');
        fetchDeslindes(); // Actualizar la lista después de eliminar
      } catch (error) {
        console.error('Error eliminando deslinde:', error);
        MySwal.fire('Error', 'No se pudo eliminar el deslinde', 'error');
      }
    }
  };

  // Configura el modo de edición
  const editDeslinde = (id, deslinde) => {
    setCurrentId(id);
    setDeslinde(deslinde);
    setEditMode(true);
  };

  // Restablece el formulario
  const resetForm = () => {
    setDeslinde('');
    setEditMode(false);
    setCurrentId('');
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center">Gestión de Deslindes</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className='mb-1' htmlFor="">Ingrese el Deslince:</label>
          <input
            type="text"
            value={deslinde}
            onChange={(e) => setDeslinde(e.target.value)}
            placeholder="Ingrese deslinde"
            required
            className="form-control"
          />
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <button type="submit" className="btn btn-primary">
            {editMode ? 'Actualizar' : 'Agregar'}
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
            <th>ID</th>
            <th>Deslinde</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(deslindes) && deslindes.length > 0 ? (
            deslindes.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.deslinde}</td>
                <td className="text-end ">
                  <button onClick={() => editDeslinde(item.id, item.deslinde)} className="btn btn-warning btn-sm me-2 mb-1">
                    Editar
                  </button>
                  <button onClick={() => deleteDeslinde(item.id)} className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No hay deslindes disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  );
};

export default Deslinde;
