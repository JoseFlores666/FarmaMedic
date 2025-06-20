import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CustomDataTable from '../../components/Tables/CustomDataTable';
import FilterComponent from '../../components/FilterComponent';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = 'https://back-farmam.onrender.com/api';

const fetchRecetas = async (setRecetas) => {
  try {
    const response = await fetch(`${API_URL}/getRecetas`);
    const data = await response.json();
    setRecetas(data);
    console.log(data)
  } catch (error) {
    console.error('Error al obtener Recetas:', error);
  }
};

const fetchUsuarios = async (setPacientes) => {
  try {
    const response = await fetch(`${API_URL}/getUsuariosAll`);
    const data = await response.json();
    setPacientes(data);
  } catch (error) {
    console.error('Error al obtener Pacientes:', error);
    throw error;

  }
};

const fetchDoctores = async (setDoctores) => {
  try {
    const response = await fetch(`${API_URL}/getDoc`);
    const data = await response.json();
    setDoctores(data);
  } catch (error) {
    console.error('Error al obtener Doctores:', error);
    throw error;

  }
};

const eliminarReceta = async (id, setRecetas) => {
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
        await fetch(`${API_URL}/deleteReceta/${id}`, { method: 'DELETE' });
        setRecetas(prev => prev.filter(receta => receta.id !== id));
        Swal.fire('Eliminado', 'Receta eliminada con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar Receta:', error);
        Swal.fire('Error', 'No se pudo eliminar la receta', 'error');
        throw error;

      }
    }
  });
};

const recetasColumns = (setRecetas, handleEditReceta) => [
  { name: 'Doctor', selector: row => row.doctor, sortable: true, wrap: true },
  { name: 'Paciente', selector: row => row.paciente, sortable: true, wrap: true },
  { name: 'Medicamento', selector: row => row.medicamento, sortable: true },
  { name: 'Dosis', selector: row => row.dosis, sortable: true },
  { name: 'Frecuencia', selector: row => row.instrucciones, sortable: true },
  {
    name: 'Fecha de Inicio',
    selector: row => {
      const date = new Date(row.fecha_inicio);
      return date.toLocaleDateString('es-ES');
    },
    sortable: true
  },
  {
    name: 'Fecha de Final',
    selector: row => {
      const date = new Date(row.fecha_fin);
      return date.toLocaleDateString('es-ES');
    },
    sortable: true
  },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaTrash
          color='red'
          title='Eliminar'
          style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => eliminarReceta(row.id, setRecetas)}
        />
        <FaEdit
          color='blue'
          title='Editar'
          style={{ cursor: 'pointer' }}
          onClick={() => handleEditReceta(row)}
        />
      </div>
    ),
    ignoreRowClick: true
  },
];


export const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReceta, setEditingReceta] = useState(null);

  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [dosis, setDosis] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaVencimiento, setfechaVencimiento] = useState('');
  const [selectedField, setSelectedField] = useState('paciente');

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Obtiene solo "YYYY-MM-DD"
};

  const handleShow = () => {
    setPaciente('');
    setDoctor('');
    setMedicamento('');
    setDosis('');
    setInstrucciones('');
    setFechaEmision('');
    setfechaVencimiento('');
    setEditingReceta(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setPaciente('');
    setDoctor('');
    setMedicamento('');
    setDosis('');
    setInstrucciones('');
    setFechaEmision('');
    setfechaVencimiento('');
    setEditingReceta(null);
    setShowModal(false);
  };

  const handleEditReceta = (Receta) => {
    setPaciente(Receta.codpaci);
    setDoctor(Receta.coddoc);
    setMedicamento(Receta.medicamento);
    setDosis(Receta.dosis);
    setInstrucciones(Receta.instrucciones);
  setFechaEmision(formatDate(Receta.fecha_inicio));
  setfechaVencimiento(formatDate(Receta.fecha_fin));
    setEditingReceta(Receta);
    setShowModal(true);
  };

  useEffect(() => {
    fetchRecetas(setRecetas);
    fetchUsuarios(setPacientes)
    fetchDoctores(setDoctores)
  }, []);

  const handleSaveReceta = async () => {
    const recetasData = {
      historial_id: 3,
      coddoc: Number(doctor),    // importante: convertir a número si el backend espera int
      codpaci: Number(paciente),
      medicamento: medicamento,
      fecha_inicio: fechaEmision,
      fecha_fin: fechaVencimiento,
      dosis: dosis,
      instrucciones: instrucciones,
      estado: 'Activo',
    };

    const url = editingReceta
      ? `${API_URL}/updateReceta/${editingReceta.id}`
      : `${API_URL}/createReceta`;

    const method = editingReceta ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recetasData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la receta');
      }

      fetchRecetas(setRecetas);
      Swal.fire('Éxito', 'Receta guardada correctamente', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      Swal.fire('Error', error.message || 'No se pudo guardar la receta', 'error');
    }
  };


  const filteredItems = (recetas || []).filter(item => {
    const filter = filterText.toLowerCase();
    let fieldValue = '';

    switch (selectedField) {
      case 'paciente':
        fieldValue = item.paciente?.toLowerCase() || '';
        break;
      case 'doctor':
        fieldValue = item.doctor?.toLowerCase() || '';
        break;
      case 'medicamento':
        fieldValue = item.medicamento?.toLowerCase() || '';
        break;
      case 'fecha':
        fieldValue = item.fecha_inicio || '';
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
        buttonText={'Añadir Receta'}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        fieldsToShow={['doctor', 'paciente', 'medicamento', 'fecha']}
      />
    );
  }, [filterText, resetPaginationToggle, selectedField]);


  return (
    <div>
      <CustomDataTable
        title="Gestión de Recetas Medicas"
        columns={recetasColumns(setRecetas, handleEditReceta)}
        data={filteredItems}
        subHeaderComponent={subHeaderComponentMemo}
      />
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingReceta ? 'Editar Receta' : 'Agregar Nueva Receta'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente</Form.Label>
                  <Form.Select value={paciente} onChange={(e) => setPaciente(e.target.value)}>
                    <option value="">Seleccione un paciente</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {`${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el medicamento"
                    value={medicamento}
                    onChange={(e) => setMedicamento(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Frecuencia (Horas)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese la frecuencia"
                    value={instrucciones}
                    onChange={(e) => setInstrucciones(e.target.value)}
                    min={0}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Vencimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setfechaVencimiento(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                    <option value="">Seleccione un doctor</option>
                    {doctores.map((d) => (
                      <option key={d.coddoc} value={d.coddoc}>
                        {`${d.nomdoc} ${d.apepaternodoc} ${d.apematernodoc}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dosis</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la dosis"
                    value={dosis}
                    onChange={(e) => setDosis(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Emisión</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaEmision}
                    onChange={(e) => setFechaEmision(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveReceta}>
            {editingReceta ? 'Guardar Cambios' : 'Guardar Receta'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

FilterComponent.propTypes = {
  filterText: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onShowModal: PropTypes.func.isRequired,
};

export default Recetas;
