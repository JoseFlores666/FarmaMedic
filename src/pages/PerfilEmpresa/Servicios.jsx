import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const Servicios = () => {
  const [Servicios, setServicios] = useState([]);
  const [nuevoEnlace, setnuevoEnlace] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    imagen: '',     
    imagenFile: null, 
    costo: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const fetchServicios = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getServicios`, {
        credentials: 'include',
      });
      const data = await response.json();
      setServicios(data);
    } catch (error) {
      console.error('Error obteniendo Servicios:', error);
    }
  };

  // Cambios en inputs texto y número
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevoEnlace({ ...nuevoEnlace, [name]: value });
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setnuevoEnlace(prev => ({
        ...prev,
        imagenFile: file,
        imagen: ''  // Limpiar URL si hay archivo nuevo
      }));
    }
  };

  const handleShow = (link = null) => {
    if (link) {
      setnuevoEnlace({
        ...link,
        imagenFile: null, // Limpiar archivo al editar para cargar nuevo si se desea
      });
      setEditMode(true);
    } else {
      setnuevoEnlace({ id: null, nombre: "", descripcion: "", imagen: "", imagenFile: null, costo: ""});
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/deleteServicios/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: userId }),
        });

        if (!response.ok) throw new Error('Error al eliminar el Servicio');

        setServicios((prev) => prev.filter((link) => link.id !== id));

        Swal.fire('Eliminado', 'Servicio eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar Servicio:', error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el Servicio', 'error');
      }
    }
  };

  const resetForm = () => {
    setnuevoEnlace({ id: null, nombre: '', descripcion: '', imagen: '', imagenFile: null, costo: '' });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;

    if (editMode && !nuevoEnlace.id) {
      Swal.fire('Error', 'No se puede editar el servicio porque no tiene un ID válido.', 'error');
      return;
    }

    try {
      let response;

      // Si hay archivo seleccionado, usar FormData
      if (nuevoEnlace.imagenFile) {
        const formData = new FormData();
        formData.append('imagen', nuevoEnlace.imagenFile);
        formData.append('nombre', nuevoEnlace.nombre);
        formData.append('descripcion', nuevoEnlace.descripcion);
        formData.append('costo', nuevoEnlace.costo);
        formData.append('id_usuario', userId);

        const url = editMode
          ? `${import.meta.env.VITE_API_URL}/updateServicios/${nuevoEnlace.id}`
          : `${import.meta.env.VITE_API_URL}/crearServicios`;

        response = await fetch(url, {
          method: editMode ? 'PUT' : 'POST',
          body: formData,
          credentials: 'include',
        });

      } else {
        // Sin archivo nuevo, enviar JSON (útil para editar sin cambiar imagen)
        const url = editMode
          ? `${import.meta.env.VITE_API_URL}/updateServicios/${nuevoEnlace.id}`
          : `${import.meta.env.VITE_API_URL}/crearServicios`;

        response = await fetch(url, {
          method: editMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nuevoEnlace, id_usuario: userId }),
          credentials: 'include',
        });
      }

      if (!response.ok) throw new Error('Error al guardar el servicio');

      // Refrescar lista
      await fetchServicios();

      Swal.fire('Éxito', editMode ? 'Servicio actualizado correctamente' : 'Servicio agregado correctamente', 'success');

      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      Swal.fire('Error', 'Ocurrió un error al guardar el servicio', 'error');
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  return (
    <Container className="mb-5">
      <h2 className="text-center text-primary fw-bold">Gestión de Servicios</h2>

      <div className="d-flex justify-content-center mb-3">
        <Button variant="success" onClick={() => handleShow()} className="d-flex align-items-center">
          <FaPlus className="me-2" /> Agregar Nuevo Servicio
        </Button>
      </div>

      <motion.div
        className="table-responsive"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-primary">
            <tr>
              <th style={{ minWidth: "150px" }}>Servicio</th>
              <th style={{ minWidth: "250px", wordBreak: "break-word" }}>Descripcion</th>
              <th style={{ minWidth: "250px", wordBreak: "break-word" }}>Imagen</th>
              <th style={{ minWidth: "100px" }}>Costo</th>
              <th style={{ minWidth: "200px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(Servicios) && Servicios.length > 0 ? (
              Servicios.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <td>{item.nombre}</td>
                  <td style={{ wordBreak: "break-word" }}>{item.descripcion}</td>
                  <td style={{ wordBreak: "break-word" }}>
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt="Imagen"
                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", borderRadius: "4px" }}
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td style={{ wordBreak: "break-word" }}>{item.costo}</td>
                  <td className="text-center">
                    <Row className="justify-content-center g-2">
                      <Col xs="auto">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="warning"
                            size="sm"
                            className="d-flex align-items-center shadow-sm"
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
                            className="d-flex align-items-center shadow-sm"
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
                <td colSpan="6" className="text-center text-muted">No hay Servicios disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      </motion.div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar Servicio" : "Agregar Nuevo Servicio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nombre del Servicio:</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoEnlace.nombre}
                onChange={handleChange}
                placeholder="Ingrese nombre del Servicio"
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
                placeholder="Ingrese descripcion del Servicio"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Imagen:</Form.Label>
              <Form.Control
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleFileChange}
                required={!editMode}
              />
              {/* Mostrar el nombre archivo seleccionado */}
              {nuevoEnlace.imagenFile && <small className="text-muted">{nuevoEnlace.imagenFile.name}</small>}
              {/* Imagen previa en modo edición si no hay archivo nuevo */}
              {editMode && nuevoEnlace.imagen && !nuevoEnlace.imagenFile && (
                <div className="mt-2">
                  <img
                    src={nuevoEnlace.imagen}
                    alt="Imagen actual"
                    style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Costo:</Form.Label>
              <Form.Control
                type="number"
                name="costo"
                value={nuevoEnlace.costo}
                onChange={handleChange}
                placeholder="Ingrese el costo"
                min={0}
                required
                step="0.01"
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

export default Servicios;
