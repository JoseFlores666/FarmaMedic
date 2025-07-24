import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const getServicios = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/getServicios`);
        setServicios(response.data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };
    getServicios();
  }, []);

  return (
    <div>
      <div className="text-center mb-3">
        <h5 className="text-muted mb-2">¿Qué hacemos?</h5>
        <h2 className="fw-bold">Conoce nuestros <span style={{ color: "#28a745" }}>Servicios</span></h2>
        <div
          style={{
            height: '3px',
            width: '160px',
            margin: '10px auto 20px',
            backgroundColor: '#0d6efd',
            borderRadius: '2px',
          }}
        ></div>
      </div>
      <Row className="g-4 mb-5">
        {servicios.map((service) => (
          <Col key={service.id} lg={3} md={6} sm={6} xs={12} className="d-flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="w-100"
            >
              <Link
                to={`/Inicio/${service.id}`}
                className="text-decoration-none text-dark"
              >
                <Card
                  className="shadow-lg border-0 service-card h-100 position-relative overflow-hidden"
                  style={{
                    borderRadius: "20px",
                    background: "linear-gradient(145deg, #ffffff, #f1f3f5)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Imagen con efecto hover */}
                  <div
                    style={{
                      overflow: "hidden",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Card.Img
                        variant="top"
                        src={
                          service.imagen ||
                          "https://www.eabel.com/wp-content/uploads/2021/04/P08-s02-img6.jpg"
                        }
                        alt="service-icon"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Cuerpo con título */}
                  <Card.Body className="d-flex align-items-center justify-content-center p-4">
                    <Card.Title
                      className="fw-semibold fs-5 text-center mb-0"
                      style={{
                        color: "#333",
                        lineHeight: "1.3",
                      }}
                    >
                      {service.nombre}
                    </Card.Title>
                  </Card.Body>

                  {/* Efecto Glow en hover */}
                  <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(40,167,69,0.1), rgba(0,0,0,0.05))",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                    whileHover={{ opacity: 1 }}
                  />
                </Card>
              </Link>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ServiciosPage;
