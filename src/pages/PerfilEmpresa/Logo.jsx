import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Logo = () => {
    const preset_name = "FarmaciaMedic";
    const cloud_name = "dzppbjrlm";

    const [selectedFile, setSelectedFile] = useState(null); 
    const [image, setImage] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [logos, setLogos] = useState([]);

    const fetchLogos = async () => {
        try {
            const response = await fetch('https://localhost:4000/api/getAllLogos');
            if (!response.ok) throw new Error("Error fetching logos");
            const data = await response.json();
            setLogos(data);
        } catch (error) {
            console.error("Error fetching logos:", error);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];

            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                MySwal.fire('Error', 'Solo se permiten archivos de tipo JPEG o PNG.', 'error');
                setSelectedFile(null);
                return;
            }

            if (file.size > 2 * 1024 * 1024) { 
                MySwal.fire('Error', 'El archivo excede el tamaño máximo permitido de 2 MB.', 'error');
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) {
            MySwal.fire('Error', 'Por favor, selecciona una imagen primero.', 'error');
            return;
        }

        const data = new FormData();
        data.append('file', selectedFile);
        data.append('upload_preset', preset_name);

        setLoading(true);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                throw new Error("Failed to upload image");
            }

            const file = await response.json();
            setImage(file.secure_url);

            await fetch('https://localhost:4000/api/uploadLogo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: file.secure_url })
            });
            MySwal.fire('Éxito', 'Imagen subida y guardada correctamente.', 'success');
            fetchLogos();
        } catch (error) {
            console.error('Error uploading image:', error);
            MySwal.fire('Error', 'No se pudo cargar la imagen. Inténtalo de nuevo.', 'error');
        } finally {
            setLoading(false);
            setSelectedFile(null); 
        }
    };

    const deleteLogo = async (id) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez eliminada, no podrás recuperar esta imagen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`https://localhost:4000/api/deleteLogo/${id}`, { method: 'DELETE' });
                    MySwal.fire('Eliminado', 'Logo eliminado correctamente.', 'success');
                    fetchLogos();
                } catch (error) {
                    console.error("Error deleting logo:", error);
                    MySwal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
                }
            }
        });
    };

    const activateLogo = async (id, url) => {
        if (!url) {
            MySwal.fire('Error', 'No se ha asignado una URL a este logo.', 'error');
            return;
        }
        try {
            await fetch(`https://localhost:4000/api/updateLogo/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: true, url }) 
            });
            MySwal.fire('Éxito', 'Logo activado correctamente.', 'success');
            fetchLogos();
        } catch (error) {
            console.error("Error activating logo:", error);
            MySwal.fire('Error', 'No se pudo activar el logo.', 'error');
        }
    };

    useEffect(() => {
        fetchLogos();
    }, []);

    return (
        <div className="container text-center mt-5">
            <h1>Gestión de Logos</h1>
            <input
                type="file"
                name="file"
                onChange={handleFileSelect}
                className="form-control mt-3"
            />
            <button
                onClick={uploadImage}
                className="btn btn-primary mt-3"
                disabled={!selectedFile || loading}
            >
                {loading ? "Subiendo..." : "Subir Imagen"}
            </button>
            {image && (
                <img src={image} alt="Imagen subida" className="img-fluid mt-3" />
            )}

            <div className="mt-5">
                <h2>Lista de Logos</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>URL</th>
                            <th>Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logos.map((logo) => (
                            <tr key={logo.id}>
                                <td>{logo.id}</td>
                                <td>
                                    <img src={logo.url} alt="Logo" width="50" />
                                </td>
                                <td>{logo.isActive ? "Sí" : "No"}</td>
                                <td>
                                    <button
                                        onClick={() => activateLogo(logo.id, logo.url)}
                                        className="btn btn-success btn-sm me-2"
                                        disabled={logo.isActive}
                                    >
                                        Activar
                                    </button>
                                    <button
                                        onClick={() => deleteLogo(logo.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Logo;
