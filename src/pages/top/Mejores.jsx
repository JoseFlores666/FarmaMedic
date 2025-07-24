import { Container, Row, Col, Button } from "react-bootstrap";
import { FaCheckCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Mejores = () => {

    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem("authData"));
    const pacienteId = authData?.id;

    const handleSolicitarServicio = () => {
        if (!pacienteId) {
            Swal.fire({
                icon: 'warning',
                title: 'Debes iniciar sesión',
                text: 'Por favor inicia sesión para solicitar una cita.',
                confirmButtonText: 'Entendido',
            });
            return;
        }
        navigate("/Inicio/Doctor");
    };

    const beneficios = [
        {
            title: "Atención Avanzada",
            description: "Atención médica personalizada y de vanguardia adaptada a ti.",
        },
        {
            title: "Medicina y Cirugía",
            description: "Experiencia en consultas médicas y procedimientos quirúrgicos.",
        },
        {
            title: "Medicina en Línea",
            description: "Consultas remotas y prescripciones de forma cómoda.",
        },
        {
            title: "Análisis de Laboratorio",
            description: "Pruebas de laboratorio y ultrasonido rápidas y precisas.",
        },
    ];

    return (
        <Container
            fluid
            className="p-0"
            style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
        >
            <Row className="g-0">
                {/* Sección "¿Por qué elegirnos?" */}
                <Col
                    md={7}
                    className="text-white p-5 d-flex flex-column justify-content-center"
                    style={{
                        background: "linear-gradient(135deg, #28a745 0%, #1c7c31 100%)",
                        minHeight: "450px",
                    }}
                >
                    <h2 className="mb-5 fw-bold" style={{ letterSpacing: "1.2px" }}>
                        ¿Por qué elegirnos?
                    </h2>

                    {/* Beneficios en dos columnas */}
                    <Row>
                        {beneficios.map(({ title, description }, i) => (
                            <Col md={6} key={i} className="mb-4">
                                <div
                                    className="p-3 rounded shadow-sm"
                                    style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                    }}
                                >
                                    <p className="mb-1 fs-5 d-flex align-items-center gap-2">
                                        <FaCheckCircle color="#00ff99" size={20} />
                                        <strong>{title}</strong>
                                    </p>
                                    <p
                                        className="text-white-50 small mb-0"
                                        style={{ maxWidth: "300px" }}
                                    >
                                        {description}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <Button
                    onClick={handleSolicitarServicio}
                        variant="light"
                        className="mt-4 px-4 py-2 fw-semibold shadow-sm"
                        style={{ borderRadius: "30px", letterSpacing: "0.05em" }}
                    >
                        Agendar Cita
                    </Button>
                </Col>

                <Col
                    md={5}
                    className="text-white p-5 d-flex flex-column justify-content-center"
                    style={{
                        background: "linear-gradient(135deg, #007bff 0%, #004085 100%)",
                        minHeight: "450px",
                    }}
                >
                    <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
                        <h2 className="mb-4 fw-bold" style={{ letterSpacing: "1.1px" }}>
                            ¿Emergencia? Contáctanos
                        </h2>

                        <p className="mb-5 text-white-75" style={{ maxWidth: "350px" }}>
                            Estamos disponibles 24/7 para ayudarte ante cualquier emergencia médica.
                            Contáctanos de inmediato para atención urgente.
                        </p>

                        <div className="mb-4 d-flex align-items-start gap-2">
                            <FaPhoneAlt color="#00ff99" size={20} />
                            <div>
                                <strong>Llámanos Ahora</strong>
                                <p className="text-white-50 small mb-0">+123 4567 89</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start gap-2">
                            <FaEnvelope color="#00ff99" size={20} />
                            <div>
                                <strong>Envíanos un Correo</strong>
                                <p className="text-white-50 small mb-0">info@ejemplo.com</p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Mejores;
