import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Container, Row, Col, Button, Form, Table, Image } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUpload, FaTrash, FaCheck, FaTimes } from "react-icons/fa"
const MySwal = withReactContent(Swal);

const Logo = () => {
    const preset_name = "FarmaciaMedic";
    const cloud_name = "dzppbjrlm";
    const folderName = "logotipos";

    const [selectedFile, setSelectedFile] = useState(null);
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [logos, setLogos] = useState([]);

    const fetchLogos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getAllLogos`);
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
        const authData = JSON.parse(localStorage.getItem("authData"));
        const userId = authData ? authData.id : null;

        if (!selectedFile) {
            MySwal.fire('Error', 'Por favor, selecciona una imagen primero.', 'error');
            return;
        }

        const data = new FormData();
        data.append('file', selectedFile);
        data.append('upload_preset', preset_name);
        data.append('folder', folderName);

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

            await fetch(`${import.meta.env.VITE_API_URL}/uploadLogo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    url: file.secure_url,
                    public_id: file.public_id,
                    id_usuario: userId
                }),
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
        const authData = JSON.parse(localStorage.getItem("authData"));
        const userId = authData ? authData.id : null;

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
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/deleteLogo/${id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                        body: JSON.stringify({ id_usuario: userId }),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const data = await response.json();

                    if (response.ok) {
                        MySwal.fire('Eliminado', 'Logo eliminado correctamente.', 'success');
                        fetchLogos();
                    } else {
                        MySwal.fire('Error', data.message || 'No se pudo eliminar el logo de la base de datos.', 'error');
                    }
                } catch (error) {
                    console.error("Error deleting logo:", error);
                    MySwal.fire('Error', 'No se pudo eliminar el logo.', 'error');
                }
            }
        });
    };

    const activateLogo = async (id, url) => {
        const authData = JSON.parse(localStorage.getItem("authData"));
        const userId = authData ? authData.id : null;
        if (!url) {
            MySwal.fire('Error', 'No se ha asignado una URL a este logo.', 'error');
            return;
        }
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/updateLogo/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: true, url, id_usuario: userId }),
                credentials: 'include',
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

        <Container className="mb-5">
            <h2 className="text-center text-primary fw-bold">Gestión de Logos</h2>

            <div className="d-flex justify-content-center">
                <Form.Group controlId="formFile" className="d-flex flex-column align-items-center">
                    <Form.Control
                        type="file"
                        onChange={handleFileSelect}
                        className="my-3 w-100"
                        style={{ maxWidth: "300px" }}
                    />
                    <Button
                        variant="success"
                        onClick={uploadImage}
                        disabled={!selectedFile || loading}
                        className="d-flex align-items-center"
                    >
                        <FaUpload className="me-2" />
                        {loading ? "Subiendo..." : "Subir Imagen"}
                    </Button>
                </Form.Group>
            </div>

            {image && (
                <Row className="justify-content-center mt-4">
                    <Col md={4}>
                        <Image src={image} alt="Imagen subida" fluid rounded className="shadow" />
                    </Col>
                </Row>
            )}

            <motion.div
                className="table-responsive mt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Table striped bordered hover responsive className="text-center">
                    <thead className="table-primary">
                        <tr>
                            <th style={{ minWidth: "100px" }}>ID</th>
                            <th style={{ minWidth: "150px" }}>Logo</th>
                            <th style={{ minWidth: "100px" }}>Activo</th>
                            <th style={{ minWidth: "200px" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logos.length > 0 ? (
                            logos.map((logo) => (
                                <motion.tr
                                    key={logo.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <td>{logo.id}</td>
                                    <td>
                                        <Image
                                            src={logo.url}
                                            alt="Logo"
                                            width="60"
                                            height="60"
                                            style={{ objectFit: "contain", borderRadius: "4px" }}
                                        />
                                    </td>
                                    <td>{logo.isActive ? <FaCheck className="text-success" /> : <FaTimes className="text-danger" />
                                    }</td>
                                    <td className="text-center">
                                        <Row className="justify-content-center g-2">
                                            <Col xs="auto">
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="px-3 py-2 shadow-sm"
                                                        disabled={logo.isActive}
                                                        onClick={() => activateLogo(logo.id, logo.url)}
                                                    >
                                                        Activar
                                                    </Button>
                                                </motion.div>
                                            </Col>
                                            <Col xs="auto">
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="px-3 py-2 shadow-sm"
                                                        onClick={() => deleteLogo(logo.id, logo.public_id)}
                                                    >
                                                        <FaTrash className="me-2 fs-6" /> Eliminar
                                                    </Button>
                                                </motion.div>
                                            </Col>
                                        </Row>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">No hay logos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </motion.div>
        </Container>
    );
};

export default Logo;
