import { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { FaMapMarkedAlt, FaRegPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const Contactanos = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        titulo: '',
        mensaje: ''
    });

    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaActual = diasSemana[new Date().getDay()];

    const convertirHora = (hora24) => {
        const [hora, minutos] = hora24.split(':');
        let h = parseInt(hora, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${minutos} ${ampm}`;
    };

    const fetchHorarios = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getHorarioEmpresa`);
            const data = await response.json();
            const formatted = data.map(item => ({
                dia: item.dia,
                horario: item.activo === 1 ? `${convertirHora(item.hora_inicio)} - ${convertirHora(item.hora_fin)}` : '',
                disponible: item.activo === 1
            }));
            setHorarios(formatted);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            Swal.fire('Error', 'No se pudieron cargar los horarios de atención', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHorarios();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/enviarMensaje`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire('Mensaje enviado correctamente', '', 'success');
                setFormData({ nombre: '', correo: '', titulo: '', mensaje: '' });
            } else {
                Swal.fire('Error al enviar mensaje', data.message, 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error al enviar mensaje', '', 'error');
        }
    };

    return (

        <div >
            <div className="text-center">

            </div>
            <div className="text-center mb-4">
                <h5 className="text-muted mb-1">Contacto</h5>
                <h2 className="fw-bold ">Envíanos un Mensaje</h2>
                <div
                    style={{
                        height: '3px',
                        width: '160px',
                        margin: '10px auto 20px',
                        backgroundColor: '#0d6efd',
                        borderRadius: '2px',
                    }}
                ></div>
            </div>
            <div className="contact-right text-white p-4 rounded" style={{ backgroundColor: "#2c245b" }}>

                <Row className="align-items-start">
                    <Col md={7} className="">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <FaMapMarkedAlt size={25} className="me-2" />
                                <span className="fw-bold fs-4">Ubicación</span>
                            </div>

                            <Button variant="light" onClick={() => setShowModal(true)}>
                                Ver Horarios de Atención
                            </Button>
                        </div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!4v1753337142087!6m8!1m7!1sURp4GOPvjupI2rMzcr2xCg!2m2!1d21.13610771841157!2d-98.53699619284265!3f129.2887256405927!4f-4.479242399518057!5f1.3459263108804513"
                            width="100%"
                            height="407"
                            allow="accelerometer; gyroscope; magnetometer; fullscreen"
                            loading="lazy"
                            title="Location Map"
                            style={{ border: 0, borderRadius: '8px' }}
                        ></iframe>
                    </Col>

                    <Col md={5}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre completo"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Correo electrónico:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Título:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    placeholder="Escribe un título para tu mensaje"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Mensaje:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="Escribe tu mensaje aquí"
                                    style={{ resize: 'none' }}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100">
                                <FaRegPaperPlane className="me-2" />

                                Enviar Mensaje
                            </Button>
                        </Form>
                    </Col>
                </Row>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Horarios de Atención</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <Table bordered responsive className="text-center">
                                <thead>
                                    <tr>
                                        <th>Día</th>
                                        <th>Horario</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {horarios.map((horario, index) => (
                                        <tr
                                            key={index}
                                            className={horario.dia === diaActual ? 'table-primary fw-bold' : ''}
                                        >
                                            <td>{horario.dia}</td>
                                            <td>{horario.disponible ? horario.horario : 'Sin horario'}</td>
                                            <td>
                                                {horario.disponible ? (
                                                    <Badge bg="success">Abierto</Badge>
                                                ) : (
                                                    <Badge bg="danger">Cerrado</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>

    );
};
