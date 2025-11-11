import { Row, Col, Card, ListGroup, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaWeight,
  FaRuler,
  FaHeartbeat,
  FaTint,
  FaPrescriptionBottleAlt,
  FaCalendarDay,
  FaUserMinus,
  FaTemperatureHigh,
  FaLungs,
  FaCarBattery,
  FaMale,
  FaFemale,
  FaGenderless,
} from "react-icons/fa";

const ExpedienteUsuario = () => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;
  const [expediente, setExpediente] = useState(null);

  useEffect(() => {
    const getExpediente = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/getExpedienteById/${userId}`
        );
        if (!response.ok) throw new Error("Error al obtener expediente");
        const data = await response.json();
        setExpediente(data);
      } catch (error) {
        console.error("Error al obtener expediente:", error);
      }
    };
    if (userId) getExpediente();
  }, [userId]);

  const getGeneroIcono = (genero) => {
    const gen = genero?.toLowerCase();
    if (gen === "masculino")
      return <FaMale style={{ color: "#4dabf7" }} className="me-2" />;
    if (gen === "femenino")
      return <FaFemale style={{ color: "#f06595" }} className="me-2" />;
    return <FaGenderless style={{ color: "gray" }} className="me-2" />;
  };

  if (!expediente)
    return (
      <p className="text-center mt-5 text-light fs-5">Cargando expediente...</p>
    );

  return (
    <Container className="mt-5 mb-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Row className="g-4">
          {/* 🧑 Información del paciente */}
          <Col md={4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="text-light p-3 border-0"
                style={{
                  background: "linear-gradient(135deg, #1f1f1f, #2a2a2a)",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                <div className="d-flex align-items-center">
                  <Card.Img
                    src={expediente.foto_perfil || "/default-avatar.png"}
                    className="rounded-circle border border-secondary"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      marginRight: "20px",
                    }}
                  />
                  <div>
                    <Card.Title className="fw-bold fs-4">
                      {expediente.nombre}
                    </Card.Title>
                    <Card.Text className="text-muted">Paciente</Card.Text>
                    <Card.Text>
                      <FaEnvelope className="me-2 text-secondary" />
                      {expediente.correo}
                    </Card.Text>
                    <Card.Text>
                      {getGeneroIcono(expediente.genero)}
                      {expediente.genero}
                    </Card.Text>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Signos Vitales */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Card
                className="text-light border-0"
                style={{
                  background: "#212529",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              >
                <Card.Body>
                  <Card.Title className="fw-bold mb-3 text-primary">
                    Signos Vitales
                  </Card.Title>
                  <ListGroup variant="flush" className="bg-transparent text-light">
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaRuler /> Altura: {expediente.altura} m
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaWeight /> Peso: {expediente.peso} kg
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaUserMinus /> IMC: {expediente.bmi}
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaTemperatureHigh /> Temperatura: {expediente.temperatura} °C
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaLungs /> Frec. Respiratoria: {expediente.presion_resp} rpm
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaCarBattery /> Presión Arterial: {expediente.presion_art}
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaHeartbeat /> Frec. Cardiaca: {expediente.presion_card} bpm
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary">
                      <FaTint /> Tipo de Sangre: {expediente.tipo_sangre}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* 🩺 Antecedentes y Medicamentos */}
          <Col md={4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="text-light border-0"
                style={{
                  background: "#1e1e1e",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                <Card.Body>
                  <Card.Title className="fw-bold text-info">
                    Antecedentes Médicos
                  </Card.Title>
                  <p className="mt-3">
                    {expediente.antecedentes || "Sin antecedentes registrados."}
                  </p>
                </Card.Body>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Card
                className="text-light border-0"
                style={{
                  background: "#1e1e1e",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                <Card.Body>
                  <Card.Title className="fw-bold text-success">
                    Medicamentos Activos
                  </Card.Title>
                  <p className="mt-3">
                    <FaPrescriptionBottleAlt className="me-2 text-success" />
                    {expediente.medicamentos || "Sin medicamentos activos."}
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* 📅 Citas */}
          <Col md={4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="text-light border-0"
                style={{
                  background: "#242424",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                <Card.Body>
                  <Card.Title className="fw-bold text-warning">
                    Citas Agendadas
                  </Card.Title>
                  <ListGroup variant="flush" className="bg-transparent text-light">
                    <ListGroup.Item className="bg-transparent border-secondary">
                      <FaCalendarDay className="text-warning" /> 15 de Abril - 10:00 AM
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent border-secondary">
                      <FaCalendarDay className="text-warning" /> 20 de Abril - 02:00 PM
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Card
                className="text-light border-0"
                style={{
                  background: "#242424",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                }}
              >
                <Card.Body>
                  <Card.Title className="fw-bold text-secondary">
                    Citas Pasadas
                  </Card.Title>
                  <ListGroup variant="flush" className="bg-transparent text-light">
                    <ListGroup.Item className="bg-transparent border-secondary">
                      ✅ 01 de Abril - 09:00 AM
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent border-secondary">
                      ✅ 05 de Marzo - 03:00 PM
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default ExpedienteUsuario;
