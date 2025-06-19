import { useEffect, useState } from 'react';
import './Home.css';
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaAmbulance, FaCheckCircle, FaMedal, FaMobileAlt, FaSpa, FaStar, FaStethoscope } from 'react-icons/fa';
import { Contactanos } from './Clients/Contactanos';

export const Home = () => {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState([]);
  const [servicios, setServicios] = useState([]);
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
      const response = await fetch('https://back-farmam.onrender.com/api/getEmpresa');
      if (!response.ok) throw new Error('Error al obtener datos de la empresa');
      const data = await response.json();
      const empresaData = data[0];
      setEmpresa(empresaData);
    } catch (err) {
      setError(err);
    }
  };

  const getServicios = async () => {
    try {
      const response = await fetch(`https://back-farmam.onrender.com/api/getServicios`);
      if (!response.ok) throw new Error('Error al obtener servicios');
      const data = await response.json();
      setServicios(data);
    } catch (err) {
      setError(err);
    }
  };

  const getDoctores = async () => {
    try {
      const response = await fetch(`https://back-farmam.onrender.com/api/getDoc`);
      if (!response.ok) throw new Error('Error al obtener servicios');
      const data = await response.json();
      setDoctores(data);
    } catch (err) {
      setError(err);
    }
  };

  const getOpinions = async () => {
    try {
      const response = await fetch(`https://back-farmam.onrender.com/api/getOpinions`);
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
    getServicios()
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
                src={'https://pngimg.com/d/doctor_PNG15987.png'}
                alt="doctor"
                className="img-fluid position-absolute"
                style={{
                  width: "60%",
                  maxWidth: "100%",
                  height: "auto",
                  bottom: "1%",
                  left: "50%",
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
        <h2 className="text-center mb-5">Nuestros Servicios</h2>
        <Row className="g-4 mb-5">
          {servicios.map((service) => (
            <Col key={service.id} lg={3} md={6} sm={6} xs={12}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="shadow-lg border service-card h-100">
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <Card.Img
                      variant="top"
                      src={service.imagen || "https://www.eabel.com/wp-content/uploads/2021/04/P08-s02-img6.jpg"}
                      alt="service-icon"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className='mb-1'>
                      <Card.Title className="fw-semibold fs-5">{service.nombre}</Card.Title>
                      <Card.Text className="text-muted">
                        {service.descripcion
                          ? service.descripcion.length > 70
                            ? service.descripcion.substring(0, 70) + '...'
                            : service.descripcion
                          : "Descripción no disponible"}
                      </Card.Text>
                    </div>
                    <Link to={`/servicios/${service.id}`}>
                      <Button variant="outline-primary" size="sm">Leer Más</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
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
        <h3 className="text-center mb-4">Nuestro equipo médico</h3>

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

      <Container className="mt-5">
        <h3 className='text-center'>Nuestras Instalaciones</h3>
        <Row className="align-items-center g-4 mt-4">
          <Col lg={6}>
            <h2>Las instalaciones clínicas son la columna vertebral de los sistemas de salud modernos</h2>
            <p>
              Proporcionan recursos esenciales para el diagnóstico, tratamiento y manejo de diversas afecciones médicas. Estas instalaciones abarcan una amplia gama de entornos, desde hospitales y clínicas hasta laboratorios de diagnóstico y centros de rehabilitación. En este artículo, exploraremos el papel vital que desempeñan las instalaciones clínicas en la prestación de una atención médica de alta calidad y la mejora de los resultados de los pacientes.
            </p>
          </Col>
          <Col lg={6} className="position-relative d-flex justify-content-center">
            <Carousel>
              {[
                "https://fundacionesperanzayalegria.org/wp-content/uploads/2021/07/UCI-MMT-Hospital.jpg",
                "https://www.rcnradio.com/_next/image?url=https%3A%2F%2Ffiles.rcnradio.com%2Fpublic%2Fstyles%2F16_9%2Fpublic%2F2022-10%2Flos_cobos_2_0.png%3FVersionId%3DOLtng3F0NxivjL5CFxLBNEOBLsCVop8v%26itok%3DrUq_dgwz&w=3840&q=75",
                "https://grupoors.com.mx/wp-content/uploads/2022/11/Diseno-Hospitales-1200x628-1.jpg",
              ].map((imgSrc, index) => (
                <Carousel.Item key={index} interval={1000}>
                  <img
                    src={imgSrc}
                    alt={`Slide ${index + 1}`}
                    className="d-block w-100"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      aspectRatio: "16/9",
                    }}
                  />
                  <Carousel.Caption>
                    <h3>{`Slide label ${index + 1}`}</h3>
                    <p>Descripción del slide.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>

      <section className='mt-5 overflow-hidden'>
        <Row>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#d3b79a",
              backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/1509/1509538.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
          </Col>

          <Col
            md={8}
            className="py-5 px-4 text-white"
            style={{
              backgroundColor: "#2c245b",
            }}
          >
            <h2 className="fw-bold mb-3">¿Por qué somos los mejores?</h2>
            <p className="mb-5">
              Ofrecemos atención médica profesional, rápida y de calidad. Nuestro compromiso es con tu salud.
            </p>
            <Row className="text-center text-white">
              <Col md={4} className="mb-4">
                <div className="service-box">
                  <div className="icon-circle">
                    <FaMobileAlt size={36} />
                  </div>
                  <h6>Atención Médica Online</h6>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="service-box">
                  <div className="icon-circle">
                    <FaSpa size={36} />
                  </div>
                  <h6>Experiencia de Bienestar</h6>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="service-box">
                  <div className="icon-circle">
                    <FaStethoscope size={36} />
                  </div>
                  <h6>Consulta Médica Profesional</h6>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="service-box">
                  <div className="icon-circle">
                    <FaAmbulance size={36} />
                  </div>
                  <h6>Servicios de Urgencias</h6>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="service-box">
                  <div className="icon-circle">
                    <FaCheckCircle size={36} />
                  </div>
                  <h6>Empresas Acreditadas</h6>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="service-box">
                  <div className="icon-circle">
                    <FaMedal size={36} />
                  </div>
                  <h6>Calidad y Acreditación</h6>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>

      <Container className='mt-5' id='contacto'>
        <Contactanos />
      </Container>

      <Container className="mt-5 mb-5">
        <h3 className="text-center">Opiniones de nuestros clientes</h3>
        <Row className="justify-content-center mt-5">
          {opiniones.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {opiniones.slice(index, index + 3).map((opinion, i) => (
                <Col key={opinion.id} xs={12} md={6} lg={4} className="rounded mt-3">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card
                      className="text-center mt-4 p-3 shadow-lg"
                      style={{
                        border: "6px solid #d3b79a",
                        backgroundColor: "#2c245b",
                        height: "250px",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={opinion.foto_perfil}
                        className="rounded-circle mx-auto"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          border: "6px solid #d3b79a",
                          marginTop: "-60px",
                          zIndex: "1",
                        }}
                      />
                      <h5 className="text-white fs-3">{opinion.usuario_nombre}</h5>
                      <div className="d-flex justify-content-center mt-2">
                        {[...Array(opinion.estrellas || 5)].map((_, j) => (
                          <FaStar key={j} style={{ color: "#f39c12", margin: "0 2px" }} />
                        ))}
                      </div>
                      <Card.Body>
                        <Card.Text className="text-white">{opinion.opinion}</Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          ) : (
            <p className="text-center text-muted">No hay opiniones disponibles.</p>
          )}
        </Row>
        <div className="mt-4 d-flex justify-content-center">
          <Button
            variant="outline-primary"
            size="lg"
            className="w-100 w-md-auto shadow-sm rounded-pill px-4 py-2"

            onClick={() => navigate('/Inicio/Ayuda/Opiniones')}
          >
            Mostrar Todas
          </Button>
        </div>
      </Container>
    </div>
  );
};
