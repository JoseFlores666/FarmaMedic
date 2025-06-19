import { Row, Col, Card, Container, Image } from "react-bootstrap";
import { useState, useEffect } from "react";

const Conocenos = () => {
  const [empresa, setEmpresa] = useState({});
  const [valores, setValores] = useState([]);

  const getEmpresa = async () => {
    try {
      const response = await fetch('https://back-farmam.onrender.com/api/getEmpresa');
      if (!response.ok) throw new Error('Error al obtener datos de la empresa');
      const data = await response.json();
      setEmpresa(data[0]);
    } catch (error) {
      console.error('Error al obtener datos de la empresa:', error);
    }
  };

  const getValores = async () => {
    try {
      const response = await fetch('https://back-farmam.onrender.com/api/getValores');
      if (!response.ok) throw new Error('Error al obtener valores');
      const data = await response.json();
      setValores(data);
    } catch (error) {
      console.error('Error al obtener valores:', error);
    }
  };

  useEffect(() => {
    getEmpresa();
    getValores();
  }, []);

  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h2 className="display-4 fw-bold text-primary">Conócenos</h2>
          <p className="fs-5 text-muted">{empresa.nombre || "Nombre de la empresa"}</p>
          <p>{empresa.nosotros}</p>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="h-100 shadow-lg border-0">
            <Card.Body>
              <Card.Title className="fw-bold text-primary fs-4 mb-3">Nuestra Misión</Card.Title>
              <Card.Text className="fs-5 text-muted">
                {empresa.mision || "Nuestra misión es brindar el mejor servicio a nuestros clientes."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-lg border-0">
            <Card.Body>
              <Card.Title className="fw-bold text-primary fs-4 mb-3">Nuestra Visión</Card.Title>
              <Card.Text className="fs-5 text-muted">
                {empresa.vision || "Nuestra visión es ser líderes en el sector de la salud."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold text-primary mb-4 text-center">Nuestros Valores</h3>
        </Col>
      </Row>

      {valores.length > 0 ? (
        valores.map((valor, index) => (
          <Row key={index} className="align-items-center mb-4">
            <Col md={4} className="text-center">
              <Image
                src={valor.imagen}
                fluid
                rounded
                className="shadow"
              />
            </Col>
            <Col md={8}>
              <h5 className="fw-bold text-primary">{valor.nombre}</h5>
              <p className="fs-5 text-muted">{valor.descripcion || "Descripción no disponible."}</p>
            </Col>
          </Row>
        ))
      ) : (
        <p className="text-muted text-center">Cargando valores...</p>
      )}
    </Container>
  );
};

export default Conocenos;
