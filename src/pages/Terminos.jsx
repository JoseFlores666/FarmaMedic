import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Terminos = () => {
    const [terminos, setTerminos] = useState([]);
    const [termino, setTermino] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        fetchTerminos();
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

    const fetchTerminos = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getTerminos');
            if (!response.ok) {
                throw new Error('Error al obtener términos');
            }
            const data = await response.json();
            setTerminos(data);
        } catch (error) {
            console.error('Error al obtener términos:', error);
            MySwal.fire('Error', 'No se pudo obtener la lista de términos', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await updateTermino(currentId);
        } else {
            await createTermino();
        }
        resetForm();
        fetchTerminos();
    };

    const createTermino = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/add_termino', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ termino }),
            });
            if (!response.ok) {
                throw new Error('Error al crear término');
            }
            MySwal.fire('Éxito', 'Término creado correctamente', 'success');
        } catch (error) {
            console.error('Error al crear término:', error);
            MySwal.fire('Error', 'No se pudo crear el término', 'error');
        }
    };

    const updateTermino = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/edit_termino/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ termino }), 
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.message || 'Error al actualizar término');
            }

            await response.json(); 
            MySwal.fire('Éxito', 'Término actualizado correctamente', 'success');
        } catch (error) {
            console.error('Error al actualizar término:', error);
            MySwal.fire('Error', 'No se pudo actualizar el término', 'error');
        }
    };


    const deleteTermino = async (id) => {
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
                if (!id) {
                    console.error('ID no definido al intentar eliminar el término');
                    return;
                }
                const response = await fetch(`http://localhost:4000/api/delete_termino/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar término');
                }
                MySwal.fire('Eliminado', 'Eliminado correctamente', 'success');
                fetchTerminos();
            } catch (error) {
                console.error('Error al eliminar término:', error);
                MySwal.fire('Error', 'No se pudo eliminar el término', 'error');
            }
        }
    };

    const editTermino = (id, termino) => {
        setCurrentId(id);
        setTermino(termino);
        setEditMode(true);
    };

    const resetForm = () => {
        setTermino('');
        setEditMode(false);
        setCurrentId('');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestión de Términos y Condiciones</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        value={termino}
                        onChange={(e) => setTermino(e.target.value)}
                        placeholder="Ingrese término"
                        required
                        className="form-control"
                    />
                    <button type="submit" className="btn btn-primary">
                        {editMode ? 'Actualizar' : 'Crear'}
                    </button>
                    {editMode && (
                        <button type="button" onClick={resetForm} className="btn btn-secondary ms-2">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Términos y Condiciones</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {terminos.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.termino}</td>
                            <td className="text-end">
                                <button onClick={() => editTermino(item.id, item.termino)} className="btn btn-warning btn-sm me-2">
                                    Editar
                                </button>
                                <button onClick={() => deleteTermino(item.id)} className="btn btn-danger btn-sm">
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

export default Terminos;
