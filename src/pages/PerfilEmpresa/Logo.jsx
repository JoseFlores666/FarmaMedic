import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Logo = () => {
    const [logo, setLogo] = useState(null);  // Contendrá la URL del logo
    const [file, setFile] = useState(null);  // Contendrá el archivo del logo

    useEffect(() => {
        fetchLogo();  // Llamada para obtener el logo al montar el componente
    }, []);

    // Función para obtener el logo actual
    const fetchLogo = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/getAllLogos', {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Error al obtener el logo');
            const data = await response.json();

            // Suponiendo que `data` es una lista y quieres el primer logo, ajusta según sea necesario
            if (data.length > 0 && data[0].path) {
                setLogo(data[0].path);  // Asegura que `data[0].path` tenga la URL completa
            } else {
                throw new Error('No se encontró un logo válido');
            }
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo obtener el logo', 'error');
        }
    };

    // Función que captura el archivo subido por el usuario
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Función para subir un nuevo logo
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            MySwal.fire('Error', 'Por favor selecciona un archivo', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('logo', file);

        try {
            const response = await fetch('http://localhost:4000/api/uploadLogo', {
                method: 'POST',  // Usamos POST para la carga inicial
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Error al subir el logo');

            const data = await response.json();
            MySwal.fire('Éxito', 'Logo actualizado correctamente', 'success');
            setLogo(data.path);  // Actualiza con la nueva URL del logo en Cloudinary
        } catch (error) {
            MySwal.fire('Error', error.message || 'No se pudo subir el logo', 'error');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h1 className="text-center">Gestión del Logo</h1>
            <form onSubmit={handleUpload} className="mb-4">
                <div className="mb-3">
                    <label className="mb-1" htmlFor="logoInput">Selecciona un nuevo Logo:</label>
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
                    <button type="submit" className="btn btn-primary">Cambiar Logo</button>
                </div>
            </form>
            {logo && (
                <div className="text-center">
                    <h2>Logo Actual</h2>
                    <img src={logo} alt="Logo" className="img-fluid" />
                </div>
            )}
        </div>
    );
};

export default Logo;
