import { useEffect, useState } from 'react';
import './Home.css';
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export const Home = () => {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [valores, setValores] = useState([]);
  const [opiniones, setOpiniones] = useState([]);
  const [index, setIndex] = useState(0);

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
      const response = await fetch('https://localhost:4000/api/getEmpresa');
      if (!response.ok) throw new Error('Error al obtener datos de la empresa');
      const data = await response.json();
      const empresaData = data[0];
      setEmpresa(empresaData);
    } catch (error) {
      console.error('Error al obtener datos de la empresa:', error);
    }
  };

  const getServicios = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/getServicios`);
      if (!response.ok) throw new Error('Error al obtener servicios');
      const data = await response.json();
      setServicios(data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  const getDoctores = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/getDoc`);
      if (!response.ok) throw new Error('Error al obtener servicios');
      const data = await response.json();
      setDoctores(data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  const getValores = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/getValores`);
      if (!response.ok) throw new Error('Error al obtener opiniones');
      const data = await response.json();
      setValores(data);
    } catch (error) {
      console.error('Error al obtener opiniones:', error);
    }
  };

  const getOpinions = async () => {
    try {
      const response = await fetch(`https://localhost:4000/api/getOpinions`);
      if (!response.ok) throw new Error('Error al obtener opiniones');
      const data = await response.json();
      setOpiniones(data);
    } catch (error) {
      console.error('Error al obtener opiniones:', error);
    }
  };

  useEffect(() => {
    getOpinions();
    getEmpresa()
    getServicios()
    getValores()
    getDoctores()
  }, []);

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
                  onClick={() => navigate('/Inicio/Ayuda/Conocenos')}
                >
                  Conócenos
                </Button>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  className="w-100 w-md-auto shadow-sm rounded-pill px-4 py-2"
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

      <Container className="mt-5 mb-5">
        <Row className="text-center mb-5">
          <Col xs={12}>
            <h2 className="display-4 fw-bold text-primary">¿Quiénes Somos?</h2>
            <p className="fs-5 text-muted">
              {empresa.nosotros}
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow-lg border-0 rounded">
              <Card.Body style={{ height: '300px' }}>
                <Card.Title className="fw-semibold text-primary fs-4">Nuestra Misión</Card.Title>
                <Card.Text className="text-muted fs-5">
                  {empresa.mision}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-lg border-0 rounded">
              <Card.Body style={{ height: '300px' }}>
                <Card.Title className="fw-semibold text-primary fs-4">Nuestra Visión</Card.Title>
                <Card.Text className="text-muted fs-5">
                  {empresa.vision}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-lg border-0 rounded">
              <Card.Body>
                <Card.Title className='fw-semibold text-primary fs-4'>Nuestros Valores</Card.Title>
                <ul className="list-unstyled">
                  {valores.length > 0 ? (
                    valores.map((valor, index) => (
                      <li key={valor.id || index} className="">
                        <Card.Text className="text-muted fs-5">
                          {valor.nombre}
                        </Card.Text>
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-muted">Cargando valores...</p>
                  )}
                </ul>
              </Card.Body>
            </Card>
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
                <Card className="shadow-lg border service-card" style={{ height: '450px' }}>
                  <Card.Img
                    variant="top"
                    src={service.imagen || "https://www.eabel.com/wp-content/uploads/2021/04/P08-s02-img6.jpg"}
                    alt="service-icon"
                    className="mx-auto"
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title className="fw-semibold fs-5">{service.nombre}</Card.Title>
                    <Card.Text className="text-muted">
                      {service.descripcion || "Descripción no disponible"}
                    </Card.Text>
                    <Button variant="primary p-0">Ir a detalle</Button>
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

        {/* Círculo decorativo amarillo animado */}
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
