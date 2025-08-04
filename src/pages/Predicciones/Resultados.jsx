import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Table,
  Button,
  Modal,
} from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Resultados = () => {
  const [loading, setLoading] = useState(true);
  const [predicciones, setPredicciones] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch('https://pm3flask.onrender.com/predecir');
        const data = await res.json();
        setPredicciones(data);
      } catch (error) {
        console.error('Error al cargar predicciones:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerDatos();
  }, []);

  const abrirModal = (row) => {
    setModalData(row);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <Container className="mb-4">
      <h2 className="text-center mb-4">Predicción de Asistencia a Citas</h2>

      {loading ? (
        <Container className="text-center mt-3">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando predicciones...</p>
        </Container>
      ) : (
        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-primary text-white fw-bold">
                Tabla de Predicciones
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>ID Cita</th>
                      <th>Paciente</th>
                      <th>Fecha</th>
                      <th>Día</th>
                      <th>Hora (min)</th>
                      <th>Género</th>
                      <th>Servicio</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predicciones.map((row, index) => (
                      <tr key={index}>
                        <td>{row.id}</td>
                        <td>{`${row.nombre || ''} ${row.apellidoPaterno || ''}`}</td>
                        <td>{row.fecha}</td>
                        <td>{row.Dia_cita}</td>
                        <td>{row.Hora_cita_min}</td>
                        <td>
                          {typeof row.Genero === 'number'
                            ? row.Genero === 1
                              ? 'Femenino'
                              : 'Masculino'
                            : row.Genero}
                        </td>
                        <td>{row.servicio}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => abrirModal(row)}
                          >
                            Predecir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Resultado de la Predicción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <>
              <p>
                <strong>Paciente:</strong> {modalData.nombre} {modalData.apellidoPaterno}
              </p>
              <p>
                <strong>Fecha:</strong> {modalData.fecha} —{' '}
                <strong>Hora:</strong> {modalData.Hora_cita_min} min
              </p>
              <p>
                <strong>Servicio:</strong> {modalData.servicio}
              </p>
              <hr />
              <p className="text-center fs-5">
                <strong>Predicción:</strong>{' '}
                {modalData.Prediccion_asiste === 1 ? (
                  <span className="text-success fw-bold">
                    <FaCheckCircle className="me-2" /> Asistirá
                  </span>
                ) : (
                  <span className="text-danger fw-bold">
                    <FaTimesCircle className="me-2" /> Canceló
                  </span>
                )}
              </p>

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

export default Resultados;
