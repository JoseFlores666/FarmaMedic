import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';


const Enlaces = () => {
    const [enlaces, setEnlaces] = useState([]);
    const [newLink, setNewLink] = useState({ id: null, nombre: '', url: '' });
    const [editMode, setEditMode] = useState(false);
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

    // Obtiene los enlaces de la API
    useEffect(() => {
        fetchEnlaces();
    }, []);

    const fetchEnlaces = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getEnlaces');
            const data = await response.json();
            setEnlaces(data);
        } catch (error) {
            console.error('Error al obtener enlaces:', error);
            Swal.fire('Error', 'No se pudo obtener la lista de enlaces', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLink({ ...newLink, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editMode ? 'PUT' : 'POST';
        const url = editMode ? `http://localhost:4000/api/updateEnlace/${newLink.id}` : 'http://localhost:4000/api/createEnlace';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(newLink),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el enlace');
            }

            Swal.fire('Éxito', editMode ? 'Enlace actualizado correctamente' : 'Enlace agregado correctamente', 'success');
            resetForm();
            fetchEnlaces();
        } catch (error) {
            console.error('Error al guardar enlace:', error);
            Swal.fire('Error', 'Ocurrió un error al guardar el enlace', 'error');
        }
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
                const response = await fetch(`http://localhost:4000/api/deleteEnlace/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-Token': csrfToken,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el enlace');
                }

                Swal.fire('Eliminado', 'Enlace eliminado correctamente', 'success');
                fetchEnlaces();
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

    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center">Gestión de Enlaces de Redes Sociales</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className='mb-1' htmlFor="">Nombre de la red social:</label>
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
                    <label className='mb-1' htmlFor="">URL:</label>
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
                                <td className="text-end ">
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
    );
};

export default Enlaces;
