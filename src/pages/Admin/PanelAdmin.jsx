import { Card, Col, Row, Container, Button } from "react-bootstrap";
import { FaUserMd, FaUsers, FaCalendarCheck } from 'react-icons/fa';
import LinesChart from "../../components/Graficas/GraficaDeLineaBasica";

const PanelAdmin = () => {
  return (
    <Container className="mb-5 ">
      <h3 className="text-center mb-4 fw-bold">Resumen General</h3>
      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-lg border-0 rounded-4 bg-primary text-white text-center">
            <Card.Body>
              <FaUserMd size={60} className="mb-3" />
              <Card.Title className="fs-4">Servicio Mas Requerido</Card.Title>
              <Card.Text className="fs-2 fw-bold">24</Card.Text>
              <Button variant="secondary" className="w-100">
                Ver Detalles
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg border-0 rounded-4 bg-success text-white text-center">
            <Card.Body>
              <FaUsers size={60} className="mb-3" />
              <Card.Title className="fs-4">Pacientes Totales</Card.Title>
              <Card.Text className="fs-2 fw-bold">310</Card.Text>
              <Button variant="secondary" className="w-100">
                Ver Detalles
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg border-0 rounded-4 bg-info text-white text-center">
            <Card.Body>
              <FaCalendarCheck size={60} className="mb-3" />
              <Card.Title className="fs-4">Citas del Día</Card.Title>
              <Card.Text className="fs-2 fw-bold">17</Card.Text>
              <Button variant="secondary" className="w-100">
                Ver Detalles
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <LinesChart/>
    </Container>
  );
};

export default PanelAdmin;
