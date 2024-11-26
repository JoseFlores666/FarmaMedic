import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const MySwal = withReactContent(Swal);

const Politicas = () => {
  const [politicas, setPoliticas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [fechaVigencia, setFechaVigencia] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [expandir, setExpandir] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const manejoExpansion = (id) => {
    if (expandir.includes(id)) {
      setExpandir(expandir.filter((policyId) => policyId !== id));
    } else {
      setExpandir([...expandir, id]);
    }
  };

  useEffect(() => {
    fetchPoliticas();
  }, []);

  const fetchPoliticas = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/getPoliticas`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener políticas');
      }
      const data = await response.json();
      setPoliticas(data);
    } catch (error) {
      console.error('Error al obtener políticas:', error);
      MySwal.fire('Error', error.message, 'error');
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
      const response = await fetch(`https://localhost:4000/api/add_politica`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ titulo, contenido, fecha_vigencia: fechaVigencia }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear política');
      }
      MySwal.fire('Éxito', 'Se insertó correctamente', 'success');
    } catch (error) {
      console.error('Error al crear política:', error);
      MySwal.fire('Error', error.message, 'error');
    }
  };

  const updatePolitica = async (id) => {
    try {
      const response = await fetch(`https://localhost:4000/api/edit_politica/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ titulo, contenido, fecha_vigencia: fechaVigencia }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar política');
      }
      MySwal.fire('Éxito', 'Actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar política:', error);
      MySwal.fire('Error', error.message, 'error');
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
        const response = await fetch(`https://localhost:4000/api/delete_politica/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar política');
        }
        MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
        fetchPoliticas();
      } catch (error) {
        console.error('Error al eliminar política:', error);
        MySwal.fire('Error', error.message, 'error');
      }
    }
  };

  const editPolitica = (id, titulo, contenido, fecha_vigencia, vigencia) => {
    if (vigencia === 'Vigente') {
      const formattedDate = new Date(fecha_vigencia).toISOString().split('T')[0];
      setCurrentId(id);
      setTitulo(titulo);
      setContenido(contenido);
      setFechaVigencia(formattedDate);
      setEditMode(true);
    } else {
      MySwal.fire('Error', 'Solo se puede editar una política vigente', 'error');
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

  const politicasFiltradas = politicas.filter((item) => {
    if (filtroEstado === 'Todos') return true;
    return item.vigencia === filtroEstado;
  });

  return (
    <div className="container mt-2">
      <h1 className="text-center mb-4">Gestión de Políticas de Privacidad</h1>
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
          <label htmlFor="filtroEstado">Filtrar por estado:</label>
          <select
            id="filtroEstado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select"
          >
            <option value="Todos">Todos</option>
            <option value="Vigente">Vigente</option>
            <option value="No vigente">No vigente</option>
          </select>
        </div>
        {politicasFiltradas.map((item) => (
          <div className="card mb-5" style={{ borderRadius: '1rem', border: '1px solid' }} key={item.id}>
            <div className="card-header d-flex align-items-center"
              onClick={() => manejoExpansion(item.id)}
              style={{ borderRadius: '1rem', borderBottom: '1px solid', cursor: 'pointer', position: 'relative' }}>
              <strong>{item.titulo}</strong>

              <div style={{ marginLeft: 'auto', position: 'absolute', right: '5px' }}>
                {item.vigencia === 'Vigente' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editPolitica(item.id, item.titulo, item.contenido, item.fecha_vigencia, item.vigencia);
                    }}
                    className="btn btn-warning btn-sm me-1"
                    title="Editar"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                )}

                {item.estado !== 'eliminado' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePolitica(item.id); }}
                    className="btn btn-danger btn-sm"
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
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

export default Politicas;
