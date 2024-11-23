import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Deslinde = () => {
  const [deslindes, setDeslindes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fechaVigencia, setFechaVigencia] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [expandir, setExpandir] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const manejoExpansion = (id) => {
    if (expandir.includes(id)) {
      setExpandir(expandir.filter((deslindeId) => deslindeId !== id));
    } else {
      setExpandir([...expandir, id]);
    }
  };

  useEffect(() => {
    fetchDeslindes();
  }, []);

  const fetchDeslindes = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/getDeslindesLegales`);
      if (!response.ok) {
        const errorData = await response.json();  // Captura el mensaje de error
        throw new Error(errorData.message || 'Error al obtener deslinde legal');
      }
      const data = await response.json();
      setDeslindes(data);
    } catch (error) {
      console.error('Error al obtener deslinde legal:', error);
      MySwal.fire('Error', error.message || 'No se pudo obtener la lista de deslindes legales', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDeslinde(currentId);
    } else {
      await createDeslinde();
    }
    resetForm();
    fetchDeslindes();
  };

  const createDeslinde = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/createDeslindeLegal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ titulo, contenido, fecha_vigencia: fechaVigencia }),
      });

      if (!response.ok) {
        const errorData = await response.json();  // Captura el mensaje de error
        throw new Error(errorData.message || 'Error al crear deslinde legal');
      }
      MySwal.fire('Éxito', 'Deslinde legal agregado correctamente', 'success');
    } catch (error) {
      console.error('Error al crear deslinde legal:', error);
      MySwal.fire('Error', error.message || 'No se pudo crear el deslinde legal', 'error');
    }
  };

  const updateDeslinde = async (id) => {
    try {
      const response = await fetch(`https://localhost:4000/api/updateDeslindeLegal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ titulo, contenido, fecha_vigencia: fechaVigencia }),
      });

      if (!response.ok) {
        const errorData = await response.json();  // Captura el mensaje de error
        throw new Error(errorData.message || 'Error al actualizar deslinde legal');
      }
      MySwal.fire('Éxito', 'Deslinde legal actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar deslinde legal:', error);
      MySwal.fire('Error', error.message || 'No se pudo actualizar el deslinde legal', 'error');
    }
  };

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
        const response = await fetch(`https://localhost:4000/api/deleteDeslindeLegal/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();  // Captura el mensaje de error
          throw new Error(errorData.message || 'Error al eliminar deslinde legal');
        }

        MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
        fetchDeslindes();
      } catch (error) {
        console.error('Error al eliminar deslinde legal:', error);
        MySwal.fire('Error', error.message || 'No se pudo eliminar el deslinde legal', 'error');
      }
    }
  };

  const editDeslinde = (id, titulo, contenido, fecha_vigencia, vigencia) => {
    if (vigencia === 'Vigente') {
      const formattedDate = new Date(fecha_vigencia).toISOString().split('T')[0];
      setCurrentId(id);
      setTitulo(titulo);
      setContenido(contenido);
      setFechaVigencia(formattedDate);
      setEditMode(true);
    } else {
      MySwal.fire('Error', 'Solo se puede editar un deslinde legal vigente', 'error');
    }
  };

  const resetForm = () => {
    setTitulo('');
    setContenido('');
    setFechaVigencia('');
    setEditMode(false);
    setCurrentId('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filtrar deslindes según el estado seleccionado
  const deslindesFiltrados = deslindes.filter(item => {
    if (filtroEstado === 'Todos') return true;
    return item.vigencia === filtroEstado;
  });

  return (
    <div className="container mt-2">
      <h1 className="text-center mb-4">Gestión de Deslinde Legal</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="">Título</label>
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
        <label htmlFor="">Contenido</label>
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
        <div className="">
          <label htmlFor="fechaVigencia">Fecha de Vigencia</label>
          <input
            id="fechaVigencia"
            type="date"
            value={fechaVigencia}
            onChange={(e) => setFechaVigencia(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-center gap-2 mt-3">
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

      <div className="container mb-5">
        <div className="mb-3">
          <label htmlFor="filtroEstado">Filtrar por Estado</label>
          <select
            id="filtroEstado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select"
          >
            <option value="Todos">Todos</option>
            <option value="Vigente">Vigente</option>
            <option value="No Vigente">No Vigente</option>
          </select>
        </div>
        {deslindesFiltrados.map((item) => (
          <div className="card mb-5" style={{ borderRadius: '1rem', border: '1px solid' }} key={item.id}>
            <div className="card-header d-flex align-items-center"
              onClick={() => manejoExpansion(item.id)}
              style={{ borderRadius: '1rem', borderBottom: '1px solid', cursor: 'pointer', position: 'relative' }}>
              <strong className="me-2">Título:</strong>{item.titulo}

              <div style={{ marginLeft: 'auto', position: 'absolute', right: '10px' }}>
                {item.vigencia === 'Vigente' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); editDeslinde(item.id, item.titulo, item.contenido, item.fecha_vigencia, item.vigencia); }}
                    className="btn btn-warning btn-sm me-1"
                  >
                    Editar
                  </button>
                )}
                {item.estado !== 'eliminado' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteDeslinde(item.id); }}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>

            {expandir.includes(item.id) && (
              <div className="card-body">
                <label htmlFor="">Contenido: </label>
                <p className="form-control-plaintext">{item.contenido}</p>
                <div className="row mt-4">
                  <div className="col-md-4 text-center">
                    <label>Versión</label>
                    <p className="form-control-plaintext">{item.version}.0</p>
                  </div>
                  <div className="col-md-4 text-center">
                    <label>Vigencia</label>
                    <p className="form-control-plaintext">{item.vigencia}</p>
                  </div>
                  <div className="col-md-4 text-center">
                    <label>Estado</label>
                    <p className="form-control-plaintext">{item.estado}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 text-center">
                    <label>Fecha de Creación</label>
                    <p className="form-control-plaintext">{formatDate(item.fecha_creacion)}</p>
                  </div>
                  <div className="col-md-4 text-center">
                    <label>Fecha de Vigencia</label>
                    <p className="form-control-plaintext">{formatDate(item.fecha_vigencia)}</p>
                  </div>
                  <div className="col-md-4 text-center">
                    <label>Fecha de Actualizacion</label>
                    <p className="form-control-plaintext">{formatDate(item.fecha_actualizacion)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deslinde;
