import { useState, useEffect } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import { motion } from "framer-motion";

const Busqueda = () => {
    const [doctores, setDoctores] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [showDoctores, setShowDoctores] = useState(true);
    const [showServicios, setShowServicios] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseDoc = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`);
                const responseServ = await fetch(`${import.meta.env.VITE_API_URL}/getServicios`);

                if (!responseDoc.ok || !responseServ.ok) {
                    throw new Error("Error al obtener los datos");
                }

                const dataDoc = await responseDoc.json();
                const dataServ = await responseServ.json();

                setDoctores(Array.isArray(dataDoc) ? dataDoc : []);
                setServicios(Array.isArray(dataServ) ? dataServ : []);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                setDoctores([]);
                setServicios([]);
            }
        };
        fetchData();
    }, []);

    // Filtrar resultados según checkboxes
    const filteredResults = [
        ...(showDoctores ? doctores.map((doc) => ({ ...doc, type: "Doctor" })) : []),
        ...(showServicios ? servicios.map((serv) => ({ ...serv, type: "Servicio" })) : [])
    ];

    return (
        <div className="p-2 mt-5 mb-5 overflow-hidden">
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

            <h2 className="text-center mb-4">Búsqueda Avanzada</h2>

            <Row className="g-4">
                <Col md={3}>
                    <Card className="p-3 shadow-sm">
                        <h5 className="mb-3">Filtrar por:</h5>
                        <Form.Check
                            type="checkbox"
                            label="Doctores"
                            checked={showDoctores}
                            onChange={() => setShowDoctores(!showDoctores)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Servicios"
                            checked={showServicios}
                            onChange={() => setShowServicios(!showServicios)}
                            className="mt-2"
                        />
                    </Card>
                </Col>

                <Col md={9}>
                    <Row className="g-3">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, index) => (
                                <Col md={6} lg={4} key={index}>
                                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                                        <Card className="text-center shadow-lg border-0 doctor-card">
                                            <Card.Img
                                                variant="top"
                                                src={item.foto_doc || item.imagen}
                                                alt="image"
                                                className="mx-auto"
                                                style={{
                                                    width: "100%",
                                                    height: "348px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                            <Card.Body>
                                                <Card.Title className="fw-semibold fs-6">{item.nomdoc || item.nombre}</Card.Title>
                                                <Card.Text className="text-muted" style={{ fontSize: "14px" }}>
                                                    {item.especialidad || (item.type === "Doctor" ? "Especialidad no disponible" : "Servicio")}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))
                        ) : (
                            <p className="text-muted text-center">No hay resultados</p>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Busqueda;
