import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";

import '../Clients/verdoctores.css'
import { FaCheckCircle } from "react-icons/fa";

const VerDoctores = () => {
    const API_URL = "https://back-farmam.onrender.com/api";
    const navigate = useNavigate();
    const [Doctores, setDoctores] = useState([]);
    const [citas, setCitas] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [horarios, setHorarios] = useState([]);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [motivoCita, setMotivoCita] = useState("");
    const [availableDates, setAvailableDates] = useState([]);

    const getCitas = async (doctorId) => {
        const response = await fetch(`${API_URL}/getCitasById/${doctorId}`);
        if (!response.ok) throw new Error("Error al obtener citas");
        const data = await response.json();
        setCitas(data);
        console.log(data)
        const formattedDates = data.map(cita => new Date(cita.fecha).toISOString().split("T")[0]);

        setAvailableDates([...new Set(formattedDates)]); 
    };

    const getDoctores = async () => {
        try {
            const response = await fetch(`${API_URL}/getDoc`);
            if (!response.ok) throw new Error("Error al obtener doctores");
            const data = await response.json();
            setDoctores(data);
        } catch (error) {
            console.error("Error al obtener doctores:", error);
        }
    };

    useEffect(() => {
        getDoctores();
        getCitas()
    }, []);

    const handleCancelarSeleccion = () => {
        setSelectedHorario(null);
        setMotivoCita("");
    };

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
        getCitas(doctor.coddoc);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDoctor(null);
        setHorarios([]);
        setAvailableDates([]);
        setSelectedHorario(null);
        setMotivoCita("");
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        filterHorarios(date);
    };

    const filterHorarios = (date) => {
        if (!selectedDoctor) return;

        const filteredCitas = citas.filter((cita) => {
            const citaDate = new Date(cita.fecha);
            return citaDate.toDateString() === date.toDateString();
        });

        const availableHorarios = filteredCitas.map((cita) => ({
            id: cita.id,
            hora: cita.hora,
            estado: cita.estado,
        }));

        setHorarios(availableHorarios);
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const dateString = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD

            if (availableDates.includes(dateString)) {
                return "available-day"; // Aplica la clase CSS
            }
        }
        return null;
    };

    const handleSelectHorario = (horario) => {
        setSelectedHorario(horario);
    };

    const reservarCita = async () => {
        if (!selectedHorario || !motivoCita) {
            Swal.fire("Error", "Debes seleccionar un horario y proporcionar el motivo de la cita.", "error");
            return;
        }

        const authData = JSON.parse(localStorage.getItem("authData"));
        const pacienteId = authData ? authData.id : null;

        if (!pacienteId) {
            Swal.fire("Error", "Debes iniciar sesión para reservar una cita", "error");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reservarCita`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedHorario.id,
                    codpaci: pacienteId,
                    motivoCita: motivoCita,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                Swal.fire("Error", data.message || "No se pudo reservar la cita", "error");
                return;
            }

            Swal.fire("Éxito", data.message || "Cita reservada correctamente", "success");
            handleCloseModal();
            setMotivoCita("");
            setHorarios([]);
            getCitas(selectedDoctor.coddoc);
        } catch (error) {
            console.error("Error al reservar la cita:", error);
            Swal.fire("Error", "Error al procesar la solicitud. Intenta nuevamente.", "error");
        }
    };

    return (
        <Container className=" mt-5 mb-5">
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
                {Doctores.map((doctor, index) => (
                    <Col key={doctor.id || index} lg={4} md={4} sm={6} xs={12}>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                            <Card className="text-center shadow-lg border-0 doctor-card mb-2">
                                <Card.Img
                                    variant="top"
                                    src={doctor.foto_doc || "https://via.placeholder.com/350x350"}
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
                                        Especialidad: {doctor.especialidad || "Especialidad no disponible"}
                                    </Card.Text>
                                    <span className={`badge ${doctor.estado ? "bg-success" : "bg-danger"}`}>
                                        {doctor.estado ? "Activo" : "Inactivo"}
                                    </span>
                                </Card.Body>
                                <Button
                                    variant="primary"
                                    onClick={() => handleSelectDoctor(doctor)}
                                    disabled={!doctor.estado}
                                >
                                    Ver Citas
                                </Button>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} centered onHide={handleCloseModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Selecciona una fecha {selectedDoctor && ` -  ${selectedDoctor.especialidad}: ${selectedDoctor.nomdoc} ${selectedDoctor.apepaternodoc} ${selectedDoctor.apematernodoc}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6} className="text-center">
                            <Card className="shadow-sm p-3">
                                <h5 className="text-primary">Selecciona una fecha</h5>
                                <Calendar
                                    onChange={handleDateSelect}
                                    value={selectedDate}
                                    tileClassName={tileClassName}
                                />
                            </Card>
                        </Col>

                        <Col md={6}>
                      
                            <Card className="shadow-sm p-3">
                            <h5 className="text-success">
    <FaCheckCircle className="me-2" /> Horarios Disponibles
</h5>
                          
                                {selectedHorario ? (
                                    <div className="text-center">
                                        <Button
                                            variant="success"
                                            className="w-100 fw-bold"
                                            disabled
                                        >
                                            {selectedHorario.hora}
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            className="w-100 mt-2"
                                            onClick={handleCancelarSeleccion}
                                        >
                                            Cancelar selección
                                        </Button>
                                    </div>
                                ) : (
                                    <Row>
                                        {horarios.length > 0 ? (
                                            horarios.map((horario, index) => (
                                                <Col xs={6} key={index} className="mb-2">
                                                    <Button
                                                        variant={horario.estado === "Reservada" ? "danger" : "outline-primary"}
                                                        onClick={() => handleSelectHorario(horario)}
                                                        disabled={horario.estado === "Reservada"}
                                                        className="w-100 text-start"
                                                    >
                                                        {horario.hora} {horario.estado === "Reservada" && "Reservada"}
                                                    </Button>
                                                </Col>
                                            ))
                                        ) : (
                                            <p className="text-muted">No hay citas disponibles para esta fecha.</p>
                                        )}
                                    </Row>
                                )}

                                {selectedHorario && (
                                    <div className="mt-3">
                                        <label className="fw-semibold">Motivo de la cita:</label>
                                        <textarea
                                            className="form-control border-primary"
                                            rows="7"
                                            placeholder="Escribe el motivo aquí..."
                                            value={motivoCita}
                                            onChange={(e) => setMotivoCita(e.target.value)}
                                            style={{ resize: "none" }}
                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={reservarCita}>
                        Confirmar Reservacion
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default VerDoctores;
