import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
  Collapse,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { getCitasByPaciente, getListaEsperaByCita } from "../../Api/citasApi";

const authData = JSON.parse(localStorage.getItem("authData"));
const userId = authData ? authData.id : null;

const MisReservaciones = () => {
  const [citas, setCitas] = useState([]);
  const [listaEspera, setListaEspera] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCita, setSelectedCita] = useState(null);
  const [showEspera, setShowEspera] = useState(false);
  const [loadingEspera, setLoadingEspera] = useState(false);

  // 🔹 Cargar citas del paciente al iniciar
  useEffect(() => {
    console.log('me ejecuto')
    const fetchCitas = async () => {
      try {
        setLoading(true);
        const citasData = await getCitasByPaciente(userId);
        setCitas(citasData);
      } catch (err) {
        setError(err.message || "Error al cargar citas");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchCitas();
  }, []);

  // 🔹 Obtener lista de espera por cita
  const handleVerDetalles = async (e, codcita) => {
    e.stopPropagation();
    setSelectedCita(codcita);
    setShowEspera(true);
    setLoadingEspera(true);

    try {
      const data = await getListaEsperaByCita(codcita);
      setListaEspera(data);
    } catch (err) {
      setListaEspera([]);
      console.error("Error al cargar lista de espera:", err);
    } finally {
      setLoadingEspera(false);
    }
  };

  // 🔹 Validaciones iniciales
  if (!userId)
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">Debes iniciar sesión para ver tus citas.</Alert>
      </Container>
    );

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando tus citas...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );

  return (
    <Container className="mt-4 py-4">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h3 className="fw-bold text-primary">📅 Mis Reservaciones</h3>
        <p className="text-muted">
          Consulta tus citas y revisa el estado de la lista de espera por cita
        </p>
        <div
          style={{
            height: "3px",
            width: "120px",
            margin: "10px auto 20px",
            backgroundColor: "#0d6efd",
            borderRadius: "3px",
          }}
        />
      </div>

      <Row className="gy-4">
        {/* 🩺 Citas */}
        <Col lg={showEspera ? 7 : 12}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body>
              <h5 className="fw-semibold mb-3">🩺 Citas Registradas</h5>
              {citas.length > 0 ? (
                citas.map((cita) => (
                  <motion.div
                    key={cita.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="mb-3 p-3 rounded-3"
                    style={{
                      backgroundColor:
                        selectedCita === cita.id ? "#e7f1ff" : "#f9fafc",
                      cursor: "pointer",
                      border:
                        selectedCita === cita.id
                          ? "2px solid #0d6efd"
                          : "1px solid #dee2e6",
                    }}
                    onClick={() =>
                      setSelectedCita(selectedCita === cita.id ? null : cita.id)
                    }
                  >
                    <div className="d-flex justify-content-between align-items-center text-dark">
                      <div>
                        <h6 className="fw-bold mb-1">{cita.doctor} {cita.apepaternoDoc} {cita.apematernoDoc}</h6>
                        <small className="text-dark">{cita.especialidad}</small>
                      </div>
                      <Badge
                        bg={
                          cita.estado === "Confirmada" ? "success" : "secondary"
                        }
                      >
                        {cita.estado}
                      </Badge>
                    </div>
                    <p className="mt-2 text-dark mb-0">
                      📆 {new Date(cita.fecha).toLocaleDateString()} | 🕒 {cita.hora}
                    </p>

                    <Collapse in={selectedCita === cita.id}>
                      <div className="mt-3 text-dark">
                        <hr />
                        <p>
                          <strong>Motivo:</strong>{" "}
                          {cita.motivo_cita || "No especificado"}
                        </p>
                        <p>
                          <strong>Duración:</strong>{" "}
                          {cita.duracion || "1 hora aprox."}
                        </p>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={(e) => handleVerDetalles(e, cita.id)}
                        >
                          Ver más detalles
                        </Button>
                      </div>
                    </Collapse>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted text-center">
                  No tienes citas registradas.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {showEspera && (
          <Col lg={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold">⏳ Lista de Espera</h5>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setShowEspera(false)}
                  >
                    Cerrar
                  </Button>
                </div>

                {loadingEspera ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="warning" />
                    <p className="mt-2 text-dark">Cargando lista de espera...</p>
                  </div>
                ) : listaEspera.length > 0 ? (
                  listaEspera.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="mb-3 p-3 rounded-3 text-dark"
                      style={{
                        backgroundColor: "#fff7e6",
                        border: "1px solid #ffc107",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold mb-1">{item.motivo_consulta}</h6>
                        <Badge
                          bg={item.estado === "Pendiente" ? "warning" : "info"}
                        >
                          {item.estado}
                        </Badge>
                      </div>
                      <small className="text-dark">
                        Registrado el{" "}
                        {new Date(item.fecha_registro).toLocaleString()}
                      </small>

                      <div className="mt-3">
                        <p>
                          <strong>Prioridad:</strong>{" "}
                          {item.estado || "Normal"}
                        </p>
                        <p>
                          <strong>Comentario:</strong>{" "}
                          {item.motivo_consulta || "Sin comentarios"}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted text-center">
                    No hay registros en lista de espera para esta cita.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default MisReservaciones;
