import { Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
// Importar iconos de Font Awesome
import { FaEnvelope, FaTransgender, FaWeight, FaRuler, FaHeartbeat, FaTint, FaPrescriptionBottleAlt, FaCalendarDay, FaUserMinus, FaTemperatureHigh, FaLungs, FaCarBattery } from 'react-icons/fa';

const ExpedienteUsuario = () => {
    const API_URL = "https://back-farmam.onrender.com/api";
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;
    const [expediente, setExpediente] = useState(null);

    const getExpediente = async () => {
        try {
            const response = await fetch(`${API_URL}/getExpedienteById/${userId}`);
            if (!response.ok) throw new Error("Error al obtener expediente");
            const data = await response.json();
            setExpediente(data);
            console.log(data); // Verifica los datos que vienen del backend
        } catch (error) {
            console.error("Error al obtener expediente:", error);
        }
    };

    useEffect(() => {
        if (userId) {
            getExpediente();
        }
    }, [userId]);

    if (!expediente) return <p className="text-center mt-5">Cargando expediente...</p>;

    return (
        <div className="mt-5 mb-5 p-3">
            <Row className="g-4">
                <Col md={4}>
                <Card className="shadow-sm p-3 d-flex flex-row align-items-center">
                        <Card.Img
                            src={expediente.foto_perfil || "/default-avatar.png"}
                            className="rounded-circle"
                            style={{ width: "120px", height: "120px", objectFit: "cover", marginRight: "20px" }}
                        />
                        <Card.Body>
                            <Card.Title className="fw-bold">{expediente.nombre}</Card.Title>
                            <Card.Text className="text-muted">Paciente</Card.Text>
                            <Card.Text><FaEnvelope className="me-2" /> {expediente.correo}</Card.Text>
                            <Card.Text><FaTransgender className="me-2" /> Género: {expediente.genero}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm p-3 mt-3">
                        <Card.Body>
                            <Card.Title className="fw-bold">Signos Vitales</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item><FaRuler /> Altura: {expediente.altura} cm</ListGroup.Item>
                                <ListGroup.Item><FaWeight /> Peso: {expediente.peso} kg</ListGroup.Item>
                                <ListGroup.Item><FaUserMinus /> IMC: {expediente.bmi}</ListGroup.Item>
                                <ListGroup.Item><FaTemperatureHigh />Temperatura: {expediente.temperatura} °C</ListGroup.Item>
                                <ListGroup.Item><FaLungs /> Frecuencia Respiratoria: {expediente.presion_resp} rpm</ListGroup.Item>
                                <ListGroup.Item> <FaCarBattery />Presión Arterial: {expediente.presion_art}</ListGroup.Item>
                                <ListGroup.Item><FaHeartbeat /> Frecuencia Cardiaca: {expediente.presion_card} bpm</ListGroup.Item>
                                <ListGroup.Item><FaTint /> Tipo de Sangre: {expediente.tipo_sangre}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm p-3">
                        <Card.Body>
                            <Card.Title className="fw-bold">Antecedentes Médicos</Card.Title>
                            <p>{expediente.antecedentes || "Sin antecedentes registrados."}</p>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm p-3 mt-3">
                        <Card.Body>
                            <Card.Title className="fw-bold">Medicamentos Activos</Card.Title>
                            <p><FaPrescriptionBottleAlt /> {expediente.medicamentos || "Sin medicamentos activos."}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Button variant="primary" className="w-100 fw-bold mb-3">
                        Agendar Nueva Cita
                    </Button>

                    <Card className="shadow-sm p-3">
                        <Card.Body>
                            <Card.Title className="fw-bold">Citas Agendadas</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item><FaCalendarDay /> 📅 15 de Abril - 10:00 AM</ListGroup.Item>
                                <ListGroup.Item><FaCalendarDay /> 📅 20 de Abril - 02:00 PM</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm p-3 mt-3">
                        <Card.Body>
                            <Card.Title className="fw-bold">Citas Pasadas</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>✅ 01 de Abril - 09:00 AM</ListGroup.Item>
                                <ListGroup.Item>✅ 05 de Marzo - 03:00 PM</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ExpedienteUsuario;
