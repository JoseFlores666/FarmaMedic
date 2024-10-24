import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Logo = () => {
    const [logo, setLogo] = useState(null);
    const [file, setFile] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        fetchLogo(); // Cargar el logo al inicio
        fetchCsrfToken(); // Obtener el token CSRF al inicio
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

    const fetchLogo = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getLogo', {
                credentials: 'include', // Asegúrate de incluir las credenciales para manejar sesiones
            });
            
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                // Lanza un error si la respuesta no es exitosa
                throw new Error(`Error al obtener el logo: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json();
    
            // Establece la ruta del logo; verifica que haya datos
            if (data.path) {
                setLogo(data.path); // Actualiza el estado con la ruta del logo
            } else {
                throw new Error('La respuesta no contiene una ruta de logo válida.');
            }
        } catch (error) {
            console.error('Error al obtener el logo:', error);
            // Muestra un mensaje de error al usuario
            MySwal.fire('Error', error.message || 'No se pudo obtener el logo', 'error');
        }
    };
    

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            MySwal.fire('Error', 'Por favor selecciona un archivo', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('logo', file); // Asegúrate de que el nombre coincida con el campo en multer

        try {
            const response = await fetch('http://localhost:4000/api/uploadLogo', {
                method: 'PUT',
                body: formData, // Enviar el FormData
                headers: {
                    'X-CSRF-Token': csrfToken, // Incluir el token CSRF
                },
                credentials: 'include', // Incluir credenciales para CSRF
            });

            if (!response.ok) {
                throw new Error('Error al subir el logo');
            }

            MySwal.fire('Éxito', 'Logo actualizado correctamente', 'success');
            fetchLogo(); // Recargar el logo después de la subida
        } catch (error) {
            console.error('Error al subir el logo:', error);
            MySwal.fire('Error', 'No se pudo subir el logo', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center">Gestión del Logo</h1>
            <form onSubmit={handleUpload} className="mb-4">
                <div className="mb-3">
                    <label className="mb-1" htmlFor="logoInput">
                        Selecciona un nuevo Logo:
                    </label>
                    <input
                        type="file"
                        id="logoInput"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <button type="submit" className="btn btn-primary">
                        Cambiar Logo
                    </button>
                </div>
            </form>
            {logo && (
                <div className="text-center">
                    <h2>Logo Actual</h2>
                    <img src={`http://localhost:4000${logo}`} alt="Logo" className="img-fluid" />
                </div>
            )}
        </div>
    );
};

export default Logo;
