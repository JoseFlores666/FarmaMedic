import { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Spinner
} from 'react-bootstrap';

const ReglasAsoc = () => {
    const [reglas, setReglas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const antecedentesSeleccionados = [
        "Delia, Control de embarazo.",
        "Gregorio, Control de embarazo.",
        "Hermelinda, Diagnostico médico y tratamiento.",
        "Rosa, Diagnostico médico y tratamiento.",
        "Minerva, Diagnostico médico y tratamiento.",
        "Dolores, Control de embarazo."
    ];

    useEffect(() => {
        const obtenerReglas = async () => {
            try {
                const res = await fetch('https://pm3flask.onrender.com/reglas');
                const data = await res.json();
                setReglas(data);
            } catch (error) {
                console.error('Error al obtener reglas:', error);
            } finally {
                setLoading(false);
            }
        };

        obtenerReglas();
    }, []);

    const abrirModal = (dato) => {
        setModalData(dato);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setModalData(null);
    };

    const reglasFiltradas = reglas
        .filter(r => antecedentesSeleccionados.includes(r.antecedents))
        .map(r => ({
            ...r,
            imagen: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
        }));

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Reglas de Asociación por Doctor</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Cargando reglas...</p>
                </div>
            ) : (
                <Row>
                    {reglasFiltradas.map((dato, idx) => (
                        <Col key={idx} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Img
                                    variant="top"
                                    src={dato.imagen}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                                <Card.Body>
                                    <Card.Title className="fw-bold">{dato.antecedents}</Card.Title>
                                    <Card.Text>
                                        Servicios relacionados por reglas de asociación.
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => abrirModal(dato)}>
                                        Ver servicios
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Servicios asociados</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData && (
                        <>
                            <h5 className="fw-bold mb-3">{modalData.antecedents}</h5>
                            <ul>
                                <li><strong>Servicio:</strong> {modalData.consequents}</li>
                                <li><strong>Confianza:</strong> {modalData.confidence.toFixed(2)}</li>
                                <li><strong>Lift:</strong> {modalData.lift.toFixed(2)}</li>
                                <li><strong>Soporte:</strong> {modalData.support}</li>
                            </ul>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReglasAsoc;
