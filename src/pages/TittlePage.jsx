import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PageTitle = () => {
    const [title, setTitle] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        fetchTitle();
        fetchCsrfToken();
    }, []);

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

    const fetchTitle = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getTitle', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Error al obtener el título');
            }
            const data = await response.json();
            setTitle(data[0]?.title || ''); 
            setNewTitle(data[0]?.title || ''); 
        } catch (error) {
            console.error('Error al obtener el título:', error);
            MySwal.fire('Error', 'No se pudo obtener el título', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newTitle.length === 0 || newTitle.length > 255) {
            MySwal.fire('Error', 'El título debe tener entre 1 y 255 caracteres.', 'error');
            return;
        }
        await updateTitle();
    };

    const updateTitle = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/updateTitle/1`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ title: newTitle }),
            });
    
            if (!response.ok) {
                throw new Error('Error al actualizar el título');
            }
    
            await response.json();
            setTitle(newTitle); 
            MySwal.fire('Éxito', 'Título actualizado correctamente', 'success'); 
        } catch (error) {
            console.error('Error al actualizar el título:', error);
            MySwal.fire('Error', 'No se pudo actualizar el título', 'error'); 
        }
    };
    

    return (
        <div className="container mt-5">
            <h1 className="text-center">Configuración del Título de Página</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group mb-3">
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
                <div className="d-flex justify-content-center gap-2">
                    <button type="submit" className="btn btn-primary">
                        Actualizar Título
                    </button>
                </div>
            </form>
            <h3>Título Actual: {title}</h3>
        </div>
    );
};

export default PageTitle;
