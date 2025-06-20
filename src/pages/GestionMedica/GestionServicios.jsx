import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';
import CustomDataTable from '../../components/Tables/CustomDataTable';
import FilterComponent from '../../components/FilterComponent';

const API_URL = 'https://back-farmam.onrender.com/api';

const fetchServices = async (setServices) => {
  try {
    const response = await fetch(`${API_URL}/getEspecialidades`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al obtener los servicios');

    const data = await response.json();
    setServices(data.length > 0 ? data : []);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    Swal.fire('Error', 'No se pudo obtener los servicios', 'error');
  }
};

const eliminarServicio = async (id, setServices) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/deleteEspec/${id}`, { method: 'DELETE' });
        setServices(prevServices => prevServices.filter(service => service.codespe !== id));
        Swal.fire('Eliminado', 'Servicio eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
      }
    }
  });
};

const serviceColumns = (setServices, handleEditService) => [
  { name: '#', selector: row => row.codespe, sortable: true, width: "53px" },
  { name: 'Especialidad', selector: row => row.titulo, sortable: true, width: "150px" },
  { name: 'Detalles', selector: row => row.detalles, sortable: true, wrap: true },
  {
    name: 'Imagen',
    selector: row => (
      <img
        src={row.imagen}
        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
      />
    ),
    sortable: false,
    wrap: true,
  },
  { name: 'Fecha Creado', selector: row => row.fecha_create, sortable: true, format: row => new Date(row.fecha_create).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaTrash color='red' title='Eliminar' style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => eliminarServicio(row.codespe, setServices)} />
        <FaEdit color='blue' title='Editar' style={{ cursor: 'pointer' }}
          onClick={() => handleEditService(row)} />
      </div>
    ),
    ignoreRowClick: true,
  },
];

export const GestionServicios = () => {
  const [services, setServices] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [consultorio, setConsultorio] = useState('');
  const [detalles, setDetalles] = useState('');
  const [imagen, setImagen] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [selectedField, setSelectedField] = useState('especialidad');

  const handleShow = () => {
    setConsultorio('');
    setDetalles('');
    setImagen('');
    setEditingService(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setConsultorio('');
    setDetalles('');
    setImagen('');
    setEditingService(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchServices(setServices);
  }, []);

  useEffect(() => { fetchServices(setServices); }, []);
  const handleSaveService = async () => {
    if (!consultorio || !detalles || !imagen) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    try {
      let response;
      if (editingService) {
        console.log('Editando servicio:', editingService);
        response = await fetch(`${API_URL}/updateEspec/${editingService.codespe}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: consultorio,
            detalles: detalles,
            imagen,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/createEspec`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: consultorio,
            detalles: detalles,
            imagen,
          }),
        });
      }

      if (!response.ok) throw new Error('Error al guardar el servicio');

      const newService = await response.json();
      setServices(prevServices => [...prevServices, newService]);
      Swal.fire('Éxito', 'Servicio agregado correctamente', 'success');
      fetchServices(setServices)
      handleClose();
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      Swal.fire('Error', 'No se pudo guardar el servicio', 'error');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setConsultorio(service.titulo);
    setDetalles(service.detalles);
    setImagen(service.imagen);
    setShowModal(true);
  };


  const filteredItems = (services || []).filter(item => {
    const filter = filterText.toLowerCase();
    let fieldValue = '';

    switch (selectedField) {
      case 'especialidad':
        fieldValue = item.titulo?.toLowerCase() || '';
        break;
      default:
        return true;
    }

    return fieldValue.includes(filter);
  });


  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    const handleFieldChange = (e) => {
      setSelectedField(e.target.value);
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        onShowModal={handleShow}
        filterText={filterText}
        buttonText={'Añadir Especialidad'}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        fieldsToShow={['especialidad']}
      />
    );
  }, [filterText, resetPaginationToggle, selectedField]);



  return (
    <div className=''>
      <CustomDataTable
        title="Gestión de Especialidades Medicas"
        columns={serviceColumns(setServices, handleEditService)}
        data={filteredItems}
        subHeaderComponent={subHeaderComponentMemo}
      />
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? 'Editar Especialidad' : 'Agregar Nueva Especialidad'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la especialidad</Form.Label>
              <Form.Control
                type="text"
                name='titulo'
                placeholder="Ingrese el nombre"
                value={consultorio || ''}
                onChange={(e) => setConsultorio(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Detalles</Form.Label>
              <Form.Control
                type="text"
                name='detalles'
                placeholder="Ingrese los detalles"
                value={detalles || ''}
                onChange={(e) => setDetalles(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen (URL)</Form.Label>
              <Form.Control
                type="text"
                name='imagen'
                placeholder="Ingrese la URL de la imagen"
                value={imagen || ''}
                onChange={(e) => setImagen(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveService}>Guardar Servicio</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

FilterComponent.propTypes = {
  filterText: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  handleShow: PropTypes.func.isRequired,
};

export default GestionServicios;
