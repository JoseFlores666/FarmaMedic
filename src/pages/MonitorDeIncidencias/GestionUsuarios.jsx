import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/getUsuariosAll`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Error al obtener usuarios');
                }

                const data = await response.json();
                setUsuarios(data);
                setFilteredUsuarios(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                Swal.fire('Error', 'No se pudo obtener la lista de usuarios', 'error');
            }
        };

        fetchUsuarios();
    }, [updated]);

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);

        const now = new Date();
        let filtered = usuarios;

        if (selectedFilter === 'day') {
            filtered = usuarios.filter(usuario => {
                const createdAt = new Date(usuario.created_at);
                return createdAt.toDateString() === now.toDateString();
            });
        } else if (selectedFilter === 'week') {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            filtered = usuarios.filter(usuario => {
                const createdAt = new Date(usuario.created_at);
                return createdAt >= startOfWeek && createdAt <= new Date();
            });
        } else if (selectedFilter === 'month') {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            filtered = usuarios.filter(usuario => {
                const createdAt = new Date(usuario.created_at);
                return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
            });
        }

        setFilteredUsuarios(filtered);
    };

    const handleBloquear = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/bloquearUsuario/${id}`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al bloquear usuario');
            }

            Swal.fire('Éxito', 'Usuario bloqueado exitosamente', 'success');
            setUpdated(!updated);
        } catch (error) {
            console.error('Error al bloquear usuario:', error);
            Swal.fire('Error', 'Ocurrió un error al bloquear el usuario', 'error');
        }
    };

    const handleDesbloquear = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/desbloquearUsuario/${id}`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al desbloquear usuario');
            }

            Swal.fire('Éxito', 'Usuario desbloqueado exitosamente', 'success');
            setUpdated(!updated);
        } catch (error) {
            console.error('Error al desbloquear usuario:', error);
            Swal.fire('Error', 'Ocurrió un error al desbloquear el usuario', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center">Gestión de Usuarios</h1>

            <div className="d-flex justify-content-center gap-2 my-4">
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('all')}
                >
                    Todos
                </button>
                <button
                    className={`btn ${filter === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('day')}
                >
                    Último Día
                </button>
                <button
                    className={`btn ${filter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('week')}
                >
                    Última Semana
                </button>
                <button
                    className={`btn ${filter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterChange('month')}
                >
                    Último Mes
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped mt-4">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Intentos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredUsuarios) && filteredUsuarios.length > 0 ? (
                            filteredUsuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.correo}</td>
                                    <td>{usuario.intentos}</td>
                                    <td>
                                        {usuario.intentos === 5 ? (
                                            <button
                                                onClick={() => handleDesbloquear(usuario.id)}
                                                className="btn btn-success btn-sm me-2"
                                            >
                                                Desbloquear
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleBloquear(usuario.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Bloquear
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No hay usuarios disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;
