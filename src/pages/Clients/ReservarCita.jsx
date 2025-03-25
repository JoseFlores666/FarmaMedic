import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const ReservarCita = () => {
    const API_URL = "https://localhost:4000/api";
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCita, setSelectedCita] = useState(null);
    const [motivoCita, setMotivoCita] = useState("");
    const [showModal, setShowModal] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const coddoc = location.state?.coddoc;
    const estadoDoctor = location.state?.estado;

    useEffect(() => {
        if (estadoDoctor === "Inactivo") {
            Swal.fire("Acceso denegado", "El doctor no está activo.", "error");
            navigate("/login");
        }
    }, [estadoDoctor, navigate]);

    const getCitas = async () => {
        if (!coddoc) return;
        try {
            const response = await fetch(`${API_URL}/getCitasById/${coddoc}`);
            if (!response.ok) throw new Error("Error al obtener citas");
            const data = await response.json();
            setCitas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getCitas();
    }, [coddoc]);

    const cancelarCita = async (idCita) => {
        const authData = JSON.parse(localStorage.getItem("authData"));
        const pacienteId = authData ? authData.id : null;
        if (!pacienteId) {
            Swal.fire("Error", "Debes iniciar sesión para cancelar una cita", "error");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/cancelarCita`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: idCita, codpaci: pacienteId }),
            });

            const data = await response.json();

            if (!response.ok) {
                Swal.fire("Error", data.message || "No se pudo cancelar la cita", "error");
                return;
            }

            setCitas((prevCitas) =>
                prevCitas.map((c) =>
                    c.codcita === idCita ? { ...c, estado: "Disponible", codpaci: null, motivo_cita: null } : c
                )
            );

            Swal.fire("Éxito", data.message || "Cita cancelada con éxito", "success");
            getCitas();
        } catch (error) {
            console.error("Error al cancelar la cita:", error);
            Swal.fire("Error", "Error al procesar la solicitud. Intenta nuevamente.", "error");
        }
    };


    const reservarCita = async () => {
        const authData = JSON.parse(localStorage.getItem("authData"));
        const pacienteId = authData ? authData.id : null;
        if (!pacienteId) {
            Swal.fire("Error", "Debes iniciar sesión para reservar una cita", "error");
            navigate("/login");
            return;
        }

        if (!motivoCita) {
            Swal.fire("Error", "Debes ingresar un motivo para la cita", "error");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reservarCita`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedCita.id,
                    codpaci: pacienteId,
                    motivoCita: motivoCita,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Swal.fire("Error", data.message || "No se pudo reservar la cita", "error");
                return;
            }

            setCitas((prevCitas) =>
                prevCitas.map((c) =>
                    c.codcita === selectedCita.codcita ? { ...c, estado: "Reservada" } : c
                )
            );

            Swal.fire("Éxito", data.message || "Cita reservada con éxito", "success");
            setShowModal(false);
            setMotivoCita("");
            setSelectedCita(null);
            getCitas();
        } catch (error) {
            console.error("Error al reservar la cita:", error);
            Swal.fire("Error", "Error al procesar la solicitud. Intenta nuevamente.", "error");
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Citas Disponibles</h1>

            {error && (
                <div className="alert alert-danger text-center max-w-md mx-auto">
                    {error}
                </div>
            )}

            {citas.length === 0 && !loading ? (
                <div className="text-center py-8">
                    <i className="bi bi-calendar-x text-4xl text-gray-400 mb-3"></i>
                    <p className="text-gray-500 text-lg">No hay citas disponibles</p>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {citas.map((cita) => (
                        <Col key={cita.codcita}>
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden">
                                <Card.Header className="bg-blue-700 py-3">
                                    <Card.Title className="text-center font-semibold text-lg">
                                        {new Date(cita.fecha).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long',
                                        })}
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body className="py-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-2xl font-bold text-blue-800 mb-2">
                                            {cita.hora}
                                        </div>

                                        <div
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${cita.estado === "Disponible"
                                                ? "bg-green-100 text-green-800"
                                                : cita.estado === "Reservado"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full mr-2 ${cita.estado === "Disponible"
                                                    ? "bg-green-500"
                                                    : cita.estado === "Reservado"
                                                        ? "bg-orange-500"
                                                        : "bg-gray-500"
                                                    }`}
                                            ></span>
                                            {cita.estado}
                                        </div>

                                        {cita.estado === "Disponible" && (
                                            <Button
                                                variant="primary"
                                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 transition-colors duration-300 rounded-lg py-2 font-medium"
                                                onClick={() => {
                                                    setSelectedCita(cita);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <i className="bi bi-calendar-plus mr-2"></i>
                                                Reservar
                                            </Button>

                                        )}
                                        {cita.estado === "Reservada" && (
                                            <Button
                                                variant="danger"
                                                className="w-full bg-red-600 border-0 hover:bg-red-700 transition-colors duration-300 rounded-lg py-2 font-medium"
                                                onClick={() => cancelarCita(cita.id)}
                                            >
                                                <i className="bi bi-x-circle mr-2"></i>
                                                Cancelar
                                            </Button>
                                        )}

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                <Modal.Header closeButton className="border-b-0 pb-0">
                    <Modal.Title className="text-blue-800 font-bold text-xl">
                        <i className="bi bi-calendar-check mr-2"></i>
                        Confirmar Reserva
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="text-center">
                                <div className="text-sm text-blue-600">Fecha</div>
                                <div className="font-semibold">
                                    {new Date(selectedCita?.fecha).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-blue-200"></div>
                            <div className="text-center">
                                <div className="text-sm text-blue-600">Hora</div>
                                <div className="font-semibold">{selectedCita?.hora}</div>
                            </div>
                        </div>
                    </div>

                    <Form.Group controlId="motivoCita" className="mb-3">
                        <Form.Label className="font-medium text-gray-700">Motivo de la cita</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe el motivo de tu consulta"
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            value={motivoCita}
                            onChange={(e) => setMotivoCita(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-t-0 pt-0">
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={reservarCita} className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 font-medium">
                        <i className="bi bi-check-circle mr-2"></i> Confirmar Reserva
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReservarCita;
