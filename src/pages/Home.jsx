import { useEffect, useState } from 'react';
import './Home.css';
import { motion } from "framer-motion";
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Contactanos } from './Clients/Contactanos';
import Opiniones from './AcercaDe/Opiniones';
import { Noticias } from './noticias/Noticias';
import ServiciosPage from './servicios/ServiciosPage';
import Mejores from './top/Mejores';
import ReglasAsoc from './Predicciones/ReglasAsoc';

export const Home = () => {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [opiniones, setOpiniones] = useState([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(null);

  const scrollToContacto = () => {
    const contactoDiv = document.getElementById('contacto');
    if (contactoDiv) {
      const yOffset = -95;
      const y = contactoDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToConocenos = () => {
    const conocenosDiv = document.getElementById('conocenos');
    if (conocenosDiv) {
      const yOffset = -95;
      const y = conocenosDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (opiniones.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 3) % opiniones.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [opiniones.length]);

  const [paginaActual, setPaginaActual] = useState(0);
  const doctoresPorPagina = 3;

  const totalPaginas = Math.ceil(doctores.length / doctoresPorPagina);
  const doctoresVisibles = doctores.slice(
    paginaActual * doctoresPorPagina,
    (paginaActual + 1) * doctoresPorPagina
  );

  const getEmpresa = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getEmpresa`);
      if (!response.ok) throw new Error('Error al obtener datos de la empresa');
      const data = await response.json();
      const empresaData = data[0];
      setEmpresa(empresaData);
    } catch (err) {
      setError(err);
    }
  };

  const getDoctores = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`);
      if (!response.ok) throw new Error('Error al obtener servicios');
      const data = await response.json();
      setDoctores(data);
    } catch (err) {
      setError(err);
    }
  };

  const getOpinions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getOpinions`);
      if (!response.ok) throw new Error('Error al obtener opiniones');
      const data = await response.json();
      setOpiniones(data);
    } catch (err) {
      setError(err);
    }
  };
  function handleLeerMas() {
    navigate('/Inicio/Ayuda/Conocenos');
  }
  useEffect(() => {
    getOpinions();
    getEmpresa()
    getDoctores()
  }, []);

  if (error) {
    throw error;
  }

  return (
    <div>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.5 }}
      >
        <Container className="mb-5 mt-4">
          <Row className="align-items-center mb-5">
            <Col xs={12} md={6} className="text-center text-md-start banner-content">
              <h1 className="display-1 fw-bold text-primary mb-2">
                {empresa.nombre}
              </h1>
              <p className="fs-4 text-muted lh-base" style={{ maxWidth: "90%" }}>
                {empresa.eslogan}
              </p>
              <div className="d-flex flex-column flex-md-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 w-md-auto shadow-sm rounded-pill px-4 py-2"
                  onClick={scrollToConocenos}
                >
                  Conócenos
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="w-100 w-md-auto shadow-sm rounded-pill px-4 py-2"
                  onClick={scrollToContacto}
                >
                  Contactanos
                </Button>
              </div>
            </Col>

            <Col xs={12} md={6} className="text-center position-relative">
              <img
                src={'https://res.cloudinary.com/dzppbjrlm/image/upload/v1742573558/ellipse_qqeyur.png'}
                alt="ellipse"
                className="img-fluid mb-3 mb-md-0 mt-3"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <img
                src={'https://res.cloudinary.com/dzppbjrlm/image/upload/v1753331868/doc-Photoroom_1_wunkih.png'}
                alt="doctor"
                className="img-fluid position-absolute"
                style={{
                  width: "70%",
                  maxWidth: "100%",
                  height: "auto",
                  bottom: "5%",
                  left: "47%",
                  transform: "translateX(-45%)",
                }}
              />
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Container className="my-5" id='conocenos'>
        <Row className="align-items-center">
          <Col md={6} className="text-center">
            <img
              src="https://centrodelapiel.com.ar/wp-content/uploads/2019/08/Clinica-medica.jpg" // <-- Aquí debes poner la ruta correcta
              alt="Quienes somos"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
            <h2 className="display-4 fw-bold text-primary mb-4">¿Quiénes Somos?</h2>
            <p className="fs-5 text-muted mb-4">
              {empresa.nosotros || "Somos una empresa dedicada a brindar los mejores servicios de salud."}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="rounded-pill"
              onClick={handleLeerMas}
            >
              Leer más
            </Button>
          </Col>

        </Row>
      </Container>


      <Container>
       <ServiciosPage/>
      </Container>

      <Container className='position-relative'>
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
        <h3 className="text-center mb-4">Nuestro personal médico</h3>

        <Row className="g-3 justify-content-center">
          {doctoresVisibles.map((doctor, index) => (
            <Col key={doctor.id || index} lg={4} md={4} sm={6} xs={12}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card className="text-center shadow-lg border-0 doctor-card">
                  <Card.Img
                    variant="top"
                    src={doctor.foto_doc}
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
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}

        </Row>

        <div className="d-flex justify-content-center mt-4">
          {Array.from({ length: totalPaginas }, (_, index) => (
            <Button
              key={index}
              onClick={() => setPaginaActual(index)}
              className={`mx-2 rounded-circle ${paginaActual === index ? "btn-primary" : "btn-secondary"}`}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "none",
              }}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Container>

         <Container className='mt-5' id='contacto'>
        <ReglasAsoc />
      </Container>

      <Container className="mt-5">
        <Noticias />
      </Container>

      <section className='mt-5'>
       <Mejores/>
      </section>

      <Container className='mt-5' id='contacto'>
        <Contactanos />
      </Container>


      <Container className='mt-5' id='contacto'>
        <Opiniones />
      </Container>
    </div>
  );
};
