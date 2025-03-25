import { Card, Col, Row, Button, Container } from "react-bootstrap";
import { FaBalanceScale, FaBuilding, FaImage, FaLink, FaPhoneAlt, FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Empresa = () => {
  const navigate = useNavigate();
  return (
    <Container className='mt-5 mb-5'>
      <Row className="g-4">
        <Col md={4}>
          <Card
            className="shadow-lg border-0 rounded-4 bg-primary text-white"
            style={{ height: '100%' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="fw-bold fs-5 mb-3">Perfil de la Empresa</Card.Title>
              <FaBuilding size={80} className="text-white mb-3" />
              <Card.Text className="fs-6 text-white-40 mb-3">
                Información acerca de la empresa, historia, misión y visión. Descubre los aspectos
                más importantes sobre la compañía y cómo ha llegado a donde está ahora.
              </Card.Text>
              <Button onClick={() => navigate('/Inicio/Empresa/Perfil_Empresa')}
                variant="secondary" className="w-75">Editar información</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-lg border-0 rounded-4 bg-info text-white"
            style={{ height: '100%' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="fw-bold fs-5 mb-3">Redes Sociales</Card.Title>
              <FaLink size={80} className="text-white mb-3" />
              <Card.Text className="fs-6 text-white-40 mb-3">
                Accede a todos los enlaces relevantes de la empresa, como nuestras redes sociales, el sitio web oficial y otras plataformas de interés.            </Card.Text>
              <Button onClick={() => navigate('/Inicio/Empresa/Gestion_De_Enlaces')}
                variant="secondary" className="w-75">Editar enlaces</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-lg border-0 rounded-4 bg-success text-white"
            style={{ height: '100%' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="fw-bold fs-5 mb-3">Valores</Card.Title>
              <FaBalanceScale size={80} className="text-white mb-3" />
              <Card.Text className="fs-6 text-white-40 mb-3">
                Descubre los valores que guían todas las decisiones dentro de nuestra empresa. Esta tarjeta te muestra qué principios son fundamentales para nuestra identidad            </Card.Text>
              <Button onClick={() => navigate('/Inicio/Empresa/Gestion_De_Valores')}
                variant="secondary" className="w-75">Editar valores</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-lg border-0 rounded-4 bg-warning text-white"
            style={{ height: '100%' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="fw-bold fs-5 mb-3">Logos</Card.Title>
              <FaImage size={80} className="text-white mb-3" />
              <Card.Text className="fs-6 text-white-40 mb-3">
                Explora los diferentes logos que representan a nuestra marca. Esta tarjeta ofrece una selección de los diseños y logotipos utilizados a lo largo del tiempo            </Card.Text>
              <Button onClick={() => navigate('/Inicio/Empresa/Gestion_De_Logos')}
                variant="secondary" className="w-75">Editar logos</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-lg border-0 rounded-4 bg-danger text-white"
            style={{ height: '100%' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="fw-bold fs-5 mb-3">Servicios</Card.Title>
              <FaTools size={80} className="text-white mb-3" />
              <Card.Text className="fs-6 text-white-40 mb-3">
                Descubre los servicios que ofrecemos a nuestros clientes y gestiona información sobre sus característica cómo puede ayudarlos en distintos aspectos
              </Card.Text>
              <Button onClick={() => navigate('/Inicio/Empresa/Gestion_De_Servicios')}
                variant="secondary" className="w-75">Ediatr servicios</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            className="shadow-lg border-0 rounded-4 bg-dark text-white"
            style={{ height: '100%' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title className="fw-bold fs-5 mb-3">Contacto</Card.Title>
              <FaPhoneAlt size={80} className="text-white mb-3" />
              <Card.Text className="fs-6 text-white-40 mb-3">
                Esta tarjeta te proporciona los medios necesarios para comunicarte con nuestro equipo de soporte, atención al cliente y otras áreas de la empresa            </Card.Text>
              <Button onClick={() => navigate('/Inicio/Empresa/Gestion_De_Contacto')}
                variant="secondary" className="w-75">Editar contacto</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  );
};

export default Empresa;