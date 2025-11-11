import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";

const ServicioDetalle = () => {
    const { id } = useParams();
    const [servicio, setServicio] = useState(null);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/getServicios/${id}`);
                setServicio(response.data);
            } catch (error) {
                console.error("Error al obtener detalles del servicio:", error);
            }
        };
        fetchDetalle();
    }, [id]);

    if (!servicio) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" className="me-2" />
                    <span className="fs-4 text-muted">Cargando servicio...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                <Row className="g-0">
                    <Col md={6} className="position-relative">
                        <Card.Img
                            src={servicio.imagen || "https://via.placeholder.com/600x400"}
                            alt={servicio.nombre}
                            className="h-100 w-100 object-fit-cover"
                            style={{ objectFit: "cover", minHeight: "300px" }}
                        />
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background: "linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0))",
                            }}
                        />
                        <h2
                            className="position-absolute bottom-0 start-0 text-white p-3 m-0 fw-bold w-100"
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                                fontSize: "1.2rem"
                            }}
                        >
                            {servicio.nombre}
                        </h2>

                    </Col>

                    <Col md={6}>
                        <Card.Body className="p-4 p-md-5">
                            <h4 className="fw-semibold">Descripcion:</h4>
                            <p className="fs-5 text-muted" style={{ lineHeight: "1.7" }}>
                                {servicio.descripcion}
                            </p>

                            <hr className="my-4" />
                            <h4 className="fw-semibold mb-3">Detalles del Servicio:</h4>
                            <Row>
                                <Col xs={12} sm={6} className="mb-3">
                                    <p className="mb-1">
                                        <strong>Precio:</strong> {servicio.costo || "No especificada"}
                                    </p>
                                    <p className="mb-1">
                                        <strong>Descuento:</strong> {servicio.descuento || "N/A"}
                                    </p>
                                </Col>
                                <Col xs={12} sm={6} className="mb-3">
                                    <p className="mb-1">
                                        <strong>Duracion:</strong>{" "}
                                        {servicio.precio ? `$${servicio.costo}` : "30 minutos aprox."}
                                    </p>

                                </Col>
                            </Row>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default ServicioDetalle;
