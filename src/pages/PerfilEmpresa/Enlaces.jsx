import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { fetchEnlaces } from './../../Api/apiEnlaces';

const Enlaces = () => {
    const [enlaces, setEnlaces] = useState([]);
    const [newLink, setNewLink] = useState({ id: null, nombre: '', url: '' });
    const [editMode, setEditMode] = useState(false);
    const [updated, setUpdated] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchEnlaces();
                setEnlaces(data);
            } catch (error) {
                console.error('Error al obtener enlaces:', error);
                Swal.fire('Error', 'No se pudo obtener la lista de enlaces', 'error');
            }
        };
        fetchData();
    }, [updated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLink({ ...newLink, [name]: value });
    };

    const handleEdit = (link) => {
        setNewLink(link);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`https://back-farmam.onrender.com/api/deleteEnlace/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el enlace');
                }

                Swal.fire('Eliminado', 'Enlace eliminado correctamente', 'success');
                setUpdated(!updated);
            } catch (error) {
                console.error('Error al eliminar enlace:', error);
                Swal.fire('Error', 'Ocurrió un error al eliminar el enlace', 'error');
            }
        }
    };

    const resetForm = () => {
        setNewLink({ id: null, nombre: '', url: '' });
        setEditMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `https://back-farmam.onrender.com/api/updateEnlace/${newLink.id}` : 'https://back-farmam.onrender.com/api/createEnlace';
       
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newLink),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el enlace');
            }

            Swal.fire('Éxito', editMode ? 'Enlace actualizado correctamente' : 'Enlace agregado correctamente', 'success');
            resetForm();
            setUpdated(!updated);

        } catch (error) {
            console.error('Error al guardar enlace:', error);
            Swal.fire('Error', 'Ocurrió un error al guardar el enlace', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5">
        <h1 className="text-center">Gestión de Enlaces de Redes Sociales</h1>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label mb-1" htmlFor="nombre">Nombre de la red social:</label>
            <input
              type="text"
              name="nombre"
              value={newLink.nombre}
              onChange={handleChange}
              placeholder="Ingrese nombre de la red social"
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label mb-1" htmlFor="url">URL:</label>
            <input
              type="url"
              name="url"
              value={newLink.url}
              onChange={handleChange}
              placeholder="Ingrese URL de la red social"
              required
              className="form-control"
            />
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-center">
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
      
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>URL</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(enlaces) && enlaces.length > 0 ? (
                enlaces.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center">
                        {item.nombre === 'Facebook' && <FaFacebook className="me-2" />}
                        {item.nombre === 'Twitter' && <FaTwitter className="me-2" />}
                        {item.nombre === 'LinkedIn' && <FaLinkedin className="me-2" />}
                        {item.nombre === 'Instagram' && <FaInstagram className="me-2" />}
                        {item.nombre}
                      </a>
                    </td>
                    <td>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                    </td>
                    <td className="text-end">
                      <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm me-2">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No hay enlaces disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    );
};

export default Enlaces;
