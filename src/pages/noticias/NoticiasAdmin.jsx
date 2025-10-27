import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Modal, Form, Table, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

export const NoticiasAdmin = () => {
  const [noticias, setNoticias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null
  });

  const fetchNoticias = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/getNoticias`);
    setNoticias(res.data);
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const handleShow = (noticia = null) => {
    if (noticia) {
      setFormData({ titulo: noticia.titulo, descripcion: noticia.descripcion, imagen: null });
      setCurrentId(noticia.id);
      setEditMode(true);
    } else {
      setFormData({ titulo: '', descripcion: '', imagen: null });
      setEditMode(false);
    }

    setTimeout(() => {
      const fileInput = document.querySelector('input[name="imagen"]');
      if (fileInput) fileInput.value = '';
    }, 0);

    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ titulo: '', descripcion: '', imagen: null });
    setEditMode(false);
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('descripcion', formData.descripcion);

    if (formData.imagen instanceof File && formData.imagen.size > 0) {
      data.append('imagen', formData.imagen);
    }

    try {
      if (editMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/updateNoticia/${currentId}`, data);
        Swal.fire('Actualizado', 'La noticia fue actualizada correctamente', 'success');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/addNoticia`, data);
        Swal.fire('Guardado', 'La noticia fue creada correctamente', 'success');
      }

      await fetchNoticias();
      handleClose();
    } catch (err) {
      console.error('Error al guardar/editar noticia:', err);
      Swal.fire('Error', 'Error al guardar o editar la noticia', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: '¿Eliminar noticia?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/deleteNoticia/${id}`);
      await fetchNoticias();
      Swal.fire('Eliminado', 'La noticia fue eliminada correctamente', 'success');
    } catch (err) {
      console.error('Error al eliminar noticia:', err);
      Swal.fire('Error', 'Error al eliminar la noticia', 'error');
    }
  };

  return (
    <Container className="mb-5">
      <h2 className="text-center text-primary fw-bold">Gestión de Noticias</h2>
      <div className="d-flex justify-content-center">
        <Button variant="success" onClick={() => handleShow()} className="d-flex align-items-center">
          <FaPlus className="me-2" /> Agregar Noticia
        </Button>
      </div>

      <motion.div className="table-responsive mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-primary">
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.length > 0 ? (
              noticias.map(noticia => (
                <motion.tr key={noticia.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }}>
                  <td>{noticia.titulo}</td>
                  <td>{noticia.descripcion}</td>
                  <td>
                    {noticia.imagen && <img src={noticia.imagen} alt="noticia" style={{ width: '100px' }} />}
                  </td>
                  <td>
                    <Row className="justify-content-center g-2">
                      <Col xs="auto">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="warning" size="sm" className="px-3 py-2" onClick={() => handleShow(noticia)}>
                            <FaEdit className="me-2" /> Editar
                          </Button>
                        </motion.div>
                      </Col>
                      <Col xs="auto">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="danger" size="sm" className="px-3 py-2" onClick={() => handleDelete(noticia.id)}>
                            <FaTrash className="me-2" /> Eliminar
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted">No hay noticias disponibles</td>
              </tr>
            )}
          </tbody>
        </Table>
      </motion.div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Noticia' : 'Agregar Nueva Noticia'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" name="imagen" accept="image/*" onChange={handleChange} />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (editMode ? 'Actualizando...' : 'Agregando...')
                  : (editMode ? 'Actualizar' : 'Agregar')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};
