import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

export const AsignarServicios = () => {
    const [doctores, setDoctores] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [serviciosAsignados, setServiciosAsignados] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);

    useEffect(() => {
        getDoctores();
        getServicios();
    }, []);

    const getDoctores = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`);
            const dataDoc = await response.json();
            setDoctores(dataDoc);
        } catch (err) {
            console.error("Error al obtener doctores", err);
        }
    };

    const getServicios = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getServicios`);
            const dataServ = await response.json();
            setServicios(dataServ);
        } catch (err) {
            console.error("Error al obtener servicios", err);
        }
    };



    const getServiciosAsignados = async (coddoc) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/getServiciosDelDoctor/${coddoc}`);
            const data = await response.json();

            setServiciosAsignados(data);
        } catch (err) {
            console.error("Error al obtener servicios", err);
        }
    };


    const handleGuardarCambios = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/asignarServiciosDoctor/${doctorSeleccionado.coddoc}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    servicios: serviciosAsignados.map(s => s.id)
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            alert(data.message);
            handleCloseModal();
            getServicios();
            getDoctores();
        } catch (err) {
            console.error('Error al guardar asignaciones:', err);
            alert('Ocurrió un error al guardar asignaciones');
        }
    };

    const handleOpenModal = (doctor) => {
        setDoctorSeleccionado(doctor);
        getServiciosAsignados(doctor.coddoc);
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        setServiciosAsignados([]);
        setDoctorSeleccionado(null);
    };

    const asignarServicio = (servicio) => {
        if (!serviciosAsignados.find(s => s.id === servicio.id)) {
            setServiciosAsignados([...serviciosAsignados, servicio]);
        }
    };

    const quitarServicio = (servicioId) => {
        setServiciosAsignados(serviciosAsignados.filter(s => s.id !== servicioId));
    };

    const serviciosNoAsignados = servicios.filter(
        (s) => !serviciosAsignados.find(sa => sa.id === s.id)
    );

    return (
        <div className="container ">
            <Row>
                <Col>
                    <label className="form-label">Todos los Doctores</label>
                    <ListGroup as={"ol"} numbered>
                        {doctores.map(doc => (
                            <ListGroup.Item
                                as={"li"}
                                key={doc.coddoc}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{doc.nombreCompleto}</strong> - {doc.especialidad}
                                </div>
                                <FaEye
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleOpenModal(doc)}
                                />
                                <Badge bg="primary" pill>
                                    {doc.total_servicios_asignados || 0}
                                </Badge>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col >
                    <label className="form-label">Todos los Servicios</label>
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        <ListGroup as={"ol"} numbered>
                            {servicios.length > 0 ? (
                                servicios.map(serv => (
                                    <ListGroup.Item as={"li"} className="d-flex justify-content-between align-items-start" key={serv.id}>
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{serv.nombre}</div>
                                            {serv.descripcion}
                                        </div>
                                        <Badge bg="primary" pill>
                                            {serv.cantidad_doctores}
                                        </Badge>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>No hay servicios que cargar</ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                </Col>
            </Row>

            <Modal show={modalShow} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Asignar servicios a {doctorSeleccionado?.nombreCompleto} - {doctorSeleccionado?.especialidad}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <h5>Servicios Asignados</h5>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {serviciosAsignados.length > 0 ? (
                                    serviciosAsignados.map(servicio => (
                                        <div key={servicio.id} className="card mb-2 shadow-sm">
                                            <div className="card-body d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{servicio.nombre}</h6>
                                                    <small className="text-muted">{servicio.descripcion}</small>
                                                </div>
                                                <Button variant="outline-danger" size="sm" onClick={() => quitarServicio(servicio.id)}>
                                                    Quitar
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No hay servicios asignados</p>
                                )}
                            </div>
                        </Col>

                        <Col md={6}>
                            <h5>Todos los Servicios</h5>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {serviciosNoAsignados.map(servicio => (
                                    <div key={servicio.id} className="card mb-2">
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{servicio.nombre}</h6>
                                                <small className="text-muted">{servicio.descripcion}</small>
                                            </div>
                                            <Button variant="outline-primary" size="sm" onClick={() => asignarServicio(servicio)}>
                                                Asignar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                    <Button
                        variant="success"
                        onClick={handleGuardarCambios}
                    >
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

AsignarServicios.propTypes = {
    onSelect: PropTypes.func,
};
