import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Eslogan = () => {
    const [eslogan, setEslogan] = useState('');
    // const [csrfToken, setCsrfToken] = useState('');
    const [esloganId, setEsloganId] = useState(null); 

    // useEffect(() => {
    //     const fetchCsrfToken = async () => {
    //         try {
    //             const response = await fetch('https://back-farmam.onrender.com/api/csrf-token', {
    //                 credentials: 'include',
    //             });
    //             const data = await response.json();
    //             setCsrfToken(data.csrfToken);
    //         } catch (error) {
    //             console.error('Error obteniendo el token CSRF:', error);
    //         }
    //     };
    //     fetchCsrfToken();
    // }, []);

    useEffect(() => {
        const fetchEslogan = async () => {
            try {
                const response = await fetch('https://back-farmam.onrender.com/api/getEslogan');
                if (!response.ok) {
                    throw new Error('Error al obtener el eslogan');
                }
                const data = await response.json();
                setEslogan(data.eslogan || ''); 
                setEsloganId(data.id); 
            } catch (error) {
                console.error('Error al obtener el eslogan:', error);
                MySwal.fire('Error', 'No se pudo obtener el eslogan', 'error');
            }
        };
        fetchEslogan();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (eslogan.length > 25) {
            MySwal.fire('Error', 'El eslogan no puede tener más de 255 caracteres', 'error');
            return;
        }

        try {
            const method = esloganId ? 'PUT' : 'POST'; 
            const url = esloganId
                ? `https://back-farmam.onrender.com/api/updateEslogan/${esloganId}`
                : 'https://back-farmam.onrender.com/api/createEslogan';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ eslogan }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el eslogan');
            }
            MySwal.fire('Éxito', 'Eslogan guardado correctamente', 'success');
        } catch (error) {
            console.error('Error al guardar el eslogan:', error);
            MySwal.fire('Error', 'No se pudo guardar el eslogan', 'error');
        }
    };

    const handleDelete = async () => {
        if (!esloganId) {
            MySwal.fire('Error', 'No hay eslogan para eliminar', 'error');
            return;
        }

        try {
            const response = await fetch(`https://back-farmam.onrender.com/api/deleteEslogan/${esloganId}`, {
                method: 'DELETE',
                headers: {
                    // 'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el eslogan');
            }

            setEslogan(''); 
            setEsloganId(null); 
            MySwal.fire('Éxito', 'Eslogan eliminado correctamente', 'success');
        } catch (error) {
            console.error('Error al eliminar el eslogan:', error);
            MySwal.fire('Error', 'No se pudo eliminar el eslogan', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center">Gestión del Eslogan</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="mb-1" htmlFor="">
                        Ingrese el Eslogan:
                    </label>
                    <input
                        type="text"
                        value={eslogan}
                        onChange={(e) => setEslogan(e.target.value)}
                        placeholder="Ingrese el eslogan"
                        required
                        className="form-control"
                        maxLength="25"
                    />
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>
                        Eliminar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Eslogan;
