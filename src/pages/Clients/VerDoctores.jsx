import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VerDoctores = () => {
    const API_URL = "https://localhost:4000/api";
    const navigate = useNavigate();
    const [Doctores, setDoctores] = useState([]);

    useEffect(() => {
        const getDoctores = async () => {
            try {
                const response = await fetch(`${API_URL}/getDoc`);
                if (!response.ok) throw new Error("Error al obtener doctores");
                const data = await response.json();
                setDoctores(data);
            } catch (error) {
                console.error("Error al obtener doctores:", error);
            }
        };

        getDoctores();
    }, []);

    return (
        <Container className="position-relative mt-5 mb-5">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "-115px",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 123, 255, 0.3)",
                    zIndex: -1,
                }}
            ></motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                style={{
                    position: "absolute",
                    bottom: "-30px",
                    right: "5px",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 193, 7, 0.3)",
                    zIndex: -1,
                }}
            ></motion.div>

            <h3 className="text-center mb-4">Nuestro equipo médico</h3>

            <Row className="g-3 justify-content-center">
                {Doctores.map((doctor, index) => (
                    <Col key={doctor.id || index} lg={4} md={4} sm={6} xs={12}>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Card className="text-center shadow-lg border-0 doctor-card mb-2">
                                <Card.Img
                                    variant="top"
                                    src={doctor.foto_doc || "https://via.placeholder.com/350x350"}
                                    alt="doctor-image"
                                    className="mx-auto"
                                    style={{
                                        width: "100%",
                                        height: "348px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                                <Card.Body>
                                    <Card.Title className="fw-semibold fs-6">{doctor.nomdoc}</Card.Title>
                                    <Card.Text className="text-muted" style={{ fontSize: "14px" }}>
                                        {doctor.especialidad || "Especialidad no disponible"}

                                    </Card.Text>
                                    <span className={`badge ${doctor.estado ? "bg-success" : "bg-danger"}`}>
                                        {doctor.estado ? "Activo" : "Inactivo"}
                                    </span>

                                </Card.Body>
                                <Button
                                    variant="primary"
                                    className=""
                                    onClick={() => navigate('/Inicio/Doctor/Reservar_Cita', { state: { coddoc: doctor.coddoc } })}
                                    disabled={!doctor.estado} 
                                >
                                    Ver Citas
                                </Button>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default VerDoctores;
