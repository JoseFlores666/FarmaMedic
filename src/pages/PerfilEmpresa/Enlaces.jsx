import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus, FaTiktok } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaWhatsapp } from "react-icons/fa";
import { Modal, Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
const Enlaces = () => {
  const [enlaces, setEnlaces] = useState([]);
  const [newLink, setNewLink] = useState({ id: null, nombre: '', url: '' });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const fetchEnlaces = async () => {
    try {
      const response = await fetch('https://back-farmam.onrender.com/api/getEnlaces', {
        credentials: 'include',
      });
      const data = await response.json();
      setEnlaces(data);
    } catch (error) {
      console.error('Error obteniendo enlaces:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLink({ ...newLink, [name]: value });
  };
  const handleShow = (link = null) => {
    if (link) {
      setNewLink(link);
      setEditMode(true);
    } else {
      setNewLink({ nombre: "", url: "" });
      setEditMode(false);
    }
    setShowModal(true);

  };

  const handleDelete = async (id) => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`https://back-farmam.onrender.com/api/deleteEnlace/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          body: JSON.stringify({ id_usuario: userId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el enlace');
        }
        setEnlaces((prev) => prev.filter((link) => link.id !== id));

        Swal.fire('Eliminado', 'Enlace eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar enlace:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el enlace', 'error');
      }
    }
  };

  const resetForm = () => {
    setNewLink({ id: '', nombre: '', url: '' });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;
    const isEdit = editMode;
    if (isEdit && !newLink.id) {
      Swal.fire('Error', 'No se puede editar el enlace porque no tiene un ID válido.', 'error');
      return;
    }
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `https://back-farmam.onrender.com/api/updateEnlace/${newLink.id}` : 'https://back-farmam.onrender.com/api/createEnlace';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...newLink, id_usuario: userId }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el enlace');
      }

      if (isEdit) {
        setEnlaces((prev) => prev.map((link) => (link.id === newLink.id ? newLink : link)));
      } else {
        setEnlaces((prev) => [...prev, newLink]);
      }
      fetchEnlaces()
      Swal.fire('Éxito', editMode ? 'Enlace actualizado correctamente' : 'Enlace agregado correctamente', 'success');
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error al guardar enlace:', error);
      Swal.fire('Error', 'Ocurrió un error al guardar el enlace', 'error');
    }
  };

  useEffect(() => {
    fetchEnlaces();
  }, []);

  return (
    <Container className=" mb-5">
      <h2 className="text-center text-primary fw-bold ">Gestión de Enlaces de Redes Sociales</h2>

      <div className="d-flex justify-content-center">
        <Button variant="success" onClick={() => handleShow()} className="d-flex align-items-center">
          <FaPlus className="me-2" /> Agregar Nuevo Enlace
        </Button>
      </div>

      <motion.div
        className="table-responsive mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-primary">
            <tr>
              <th style={{ minWidth: "150px" }}>Red Social</th>
              <th style={{ minWidth: "250px", wordBreak: "break-word" }}>URL</th>
              <th style={{ minWidth: "200px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(enlaces) && enlaces.length > 0 ? (
              enlaces.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <td>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      {item.nombre === "Facebook" && <FaFacebook className="me-2 text-primary fs-5" />}
                      {item.nombre === "Twitter" && <FaTwitter className="me-2 text-info fs-5" />}
                      {item.nombre === "LinkedIn" && <FaLinkedin className="me-2 text-primary fs-5" />}
                      {item.nombre === "Instagram" && <FaInstagram className="me-2 text-danger fs-5" />}
                      {item.nombre === "Youtube" && <FaYoutube className="me-2 text-danger fs-5" />}
                      {item.nombre === "GitHub" && <FaGithub className="me-2 text-dark fs-5" />}
                      {item.nombre === "WhatsApp" && <FaWhatsapp color="green" className="me-2 fs-5" />}
                      {item.nombre === "Tiktok" && <FaTiktok color="black" className="me-2 fs-5" />}
                      {item.nombre}
                    </a>
                  </td>
                  <td style={{ wordBreak: "break-word" }}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                      {item.url}
                    </a>
                  </td>
                  <td className="text-center">
                    <Row className="justify-content-center g-2">
                      <Col xs="auto">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="warning"
                            size="sm"
                            className="d-flex align-items-center px-3 py-2 shadow-sm"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleShow(item)}
                          >
                            <FaEdit className="me-2 fs-6" /> Editar
                          </Button>
                        </motion.div>
                      </Col>
                      <Col xs="auto">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center px-3 py-2 shadow-sm"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash className="me-2 fs-6" /> Eliminar
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">No hay enlaces disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      </motion.div>


      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar Enlace" : "Agregar Nuevo Enlace"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nombre de la Red Social:</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newLink.nombre}
                onChange={handleChange}
                placeholder="Ingrese nombre de la red social"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">URL:</Form.Label>
              <Form.Control
                type="url"
                name="url"
                value={newLink.url}
                onChange={handleChange}
                placeholder="Ingrese URL de la red social"
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? "Actualizar" : "Agregar"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default Enlaces;
