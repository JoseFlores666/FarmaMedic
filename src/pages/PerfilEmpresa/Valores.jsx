import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const Valores = () => {
  const [Valores, setValores] = useState([]);
  const [nuevoEnlace, setnuevoEnlace] = useState({ id: null, nombre: '', descripcion: '',imagen:'' });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const fetchValores = async () => {
    try {
      const response = await fetch('https://localhost:4000/api/getValores', {
        credentials: 'include',
      });
      const data = await response.json();
      setValores(data);
    } catch (error) {
      console.error('Error obteniendo Valores:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevoEnlace({ ...nuevoEnlace, [name]: value });
  };

  const handleShow = (link = null) => {
    if (link) {
      setnuevoEnlace(link);
      setEditMode(true);
    } else {
      setnuevoEnlace({ nombre: "", descripcion: "",imagen:"" });
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
        const response = await fetch(`https://localhost:4000/api/deleteValor/${id}`, {
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
        setValores((prev) => prev.filter((link) => link.id !== id));

        Swal.fire('Eliminado', 'Enlace eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar enlace:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el enlace', 'error');
      }
    }
  };

  const resetForm = () => {
    setnuevoEnlace({ id: '', nombre: '', descripcion: '',imagen:"" });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;
    const isEdit = editMode;
    if (isEdit && !nuevoEnlace.id) {
      Swal.fire('Error', 'No se puede editar el enlace porque no tiene un ID válido.', 'error');
      return;
    }
    const method = editMode ? 'PUT' : 'POST';
    const descripcion = editMode ? `https://localhost:4000/api/updateValores/${nuevoEnlace.id}` : 'https://localhost:4000/api/createValor';

    try {
      const response = await fetch(descripcion, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...nuevoEnlace, id_usuario: userId }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el enlace');
      }

      if (isEdit) {
        setValores((prev) => prev.map((link) => (link.id === nuevoEnlace.id ? nuevoEnlace : link)));
      } else {
        setValores((prev) => [...prev, nuevoEnlace]);
      }
      fetchValores();
      Swal.fire('Éxito', editMode ? 'Enlace actualizado correctamente' : 'Enlace agregado correctamente', 'success');
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error al guardar enlace:', error);
      Swal.fire('Error', 'Ocurrió un error al guardar el enlace', 'error');
    }
  };

  useEffect(() => {
    fetchValores();
  }, []);

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center text-primary fw-bold ">Gestión de Valores</h2>

      <div className="d-flex justify-content-center">
        <Button variant="success" onClick={() => handleShow()} className="d-flex align-items-center">
          <FaPlus className="me-2" /> Agregar Nuevo Valor
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
              <th style={{ minWidth: "150px" }}>Valor</th>
              <th style={{ minWidth: "250px", wordBreak: "break-word" }}>Descripcion</th>
              <th style={{ minWidth: "250px", wordBreak: "break-word" }}>Imagen</th>
              <th style={{ minWidth: "200px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(Valores) && Valores.length > 0 ? (
              Valores.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <td>{item.nombre}</td>
                  <td style={{ wordBreak: "break-word" }}>{item.descripcion}</td>
                  <td style={{ wordBreak: "break-word" }}>{item.imagen}</td>
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
                <td colSpan="3" className="text-center text-muted">No hay Valores disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      </motion.div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar Valor" : "Agregar Nuevo Valor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nombre del Valor:</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoEnlace.nombre}
                onChange={handleChange}
                placeholder="Ingrese nombre del valor"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Descripcion:</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                value={nuevoEnlace.descripcion}
                onChange={handleChange}
                placeholder="Ingrese descripcion del valor"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Imagen:</Form.Label>
              <Form.Control
                type="text"
                name="imagen"
                value={nuevoEnlace.imagen}
                onChange={handleChange}
                placeholder="Ingrese la url de la imagen"
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

export default Valores;
