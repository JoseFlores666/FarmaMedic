import { Row, Col, Card, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (userId) {
      getExpediente();
    }
  }, [userId]);

  const getGeneroIcono = (genero) => {
    const gen = genero?.toLowerCase();
    if (gen === "masculino")
      return <FaMale style={{ color: "blue" }} className="me-2" />;
    if (gen === "femenino")
      return <FaFemale style={{ color: "deeppink" }} className="me-2" />;
    return <FaGenderless style={{ color: "gray" }} className="me-2" />;
  };

  if (!expediente)
    return <p className="text-center mt-5">Cargando expediente...</p>;

  return (
    <div className="mt-5 mb-5 p-3">
      <Row className="g-4">
        {/* Columna 1 */}
        <Col md={4}>
          <Card className="shadow-sm p-3 d-flex flex-row align-items-center bg-light">
            <Card.Img
              src={expediente.foto_perfil || "/default-avatar.png"}
              className="rounded-circle"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                marginRight: "20px",
              }}
            />
            <Card.Body>
              <Card.Title className="fw-bold">{expediente.nombre}</Card.Title>
              <Card.Text className="text-muted">Paciente</Card.Text>
              <Card.Text>
                <FaEnvelope style={{ color: "#6c757d" }} className="me-2" />
                {expediente.correo}
              </Card.Text>
              <Card.Text>
                {getGeneroIcono(expediente.genero)}
                Género: {expediente.genero}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="shadow-sm p-3 mt-3 bg-light">
            <Card.Body>
              <Card.Title className="fw-bold">Signos Vitales</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FaRuler style={{ color: "brown" }} /> Altura:{" "}
                  {expediente.altura} m
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaWeight style={{ color: "gray" }} /> Peso:{" "}
                  {expediente.peso} kg
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaUserMinus style={{ color: "#fd7e14" }} /> IMC:{" "}
                  {expediente.bmi}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaTemperatureHigh style={{ color: "#dc3545" }} /> Temperatura:{" "}
                  {expediente.temperatura} °C
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaLungs style={{ color: "pink" }} /> Frecuencia
                  Respiratoria: {expediente.presion_resp} rpm
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaCarBattery style={{ color: "#6f42c1" }} /> Presión Arterial:{" "}
                  {expediente.presion_art}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaHeartbeat style={{ color: "reddish" }} /> Frecuencia
                  Cardiaca: {expediente.presion_card} bpm
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaTint style={{ color: "red" }} /> Tipo de Sangre:{" "}
                  {expediente.tipo_sangre}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna 2 */}
        <Col md={4}>
          <Card className="shadow-sm p-3 bg-light">
            <Card.Body>
              <Card.Title className="fw-bold">Antecedentes Médicos</Card.Title>
              <p>{expediente.antecedentes || "Sin antecedentes registrados."}</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm p-3 mt-3 bg-light">
            <Card.Body>
              <Card.Title className="fw-bold">Medicamentos Activos</Card.Title>
              <p>
                <FaPrescriptionBottleAlt style={{ color: "#0d6efd" }} />{" "}
                {expediente.medicamentos || "Sin medicamentos activos."}
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna 3 */}
        <Col md={4}>
          <Card className="shadow-sm p-3 bg-light">
            <Card.Body>
              <Card.Title className="fw-bold">Citas Agendadas</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FaCalendarDay style={{ color: "#198754" }} /> 📅 15 de Abril -
                  10:00 AM
                </ListGroup.Item>
                <ListGroup.Item>
                  <FaCalendarDay style={{ color: "#198754" }} /> 📅 20 de Abril -
                  02:00 PM
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow-sm p-3 mt-3 bg-light">
            <Card.Body>
              <Card.Title className="fw-bold">Citas Pasadas</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  ✅ 01 de Abril - 09:00 AM
                </ListGroup.Item>
                <ListGroup.Item>
                  ✅ 05 de Marzo - 03:00 PM
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExpedienteUsuario;
