import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CustomDataTable from '../../components/Tables/CustomDataTable';
import FilterComponent from '../../components/FilterComponent';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RecetaPDF from './RecetaPDF';

const fetchRecetas = async (setRecetas) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getRecetas`);
    const data = await response.json();
    setRecetas(data);
  } catch (error) {
    console.error('Error al obtener Recetas:', error);
  }
};

const fetchUsuarios = async (setPacientes) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getUsuariosAll`);
    const data = await response.json();
    setPacientes(data);
  } catch (error) {
    console.error('Error al obtener Pacientes:', error);
    throw error;

  }
};

const fetchDoctores = async (setDoctores) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`);
    const data = await response.json();
    setDoctores(data);
  } catch (error) {
    console.error('Error al obtener Doctores:', error);
    throw error;

  }
};

const fetchMedicamentosByReceta = async (recetaId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getMedicamentosByReceta/${recetaId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    throw new Error('No se pudieron cargar los medicamentos');
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
        await fetch(`${import.meta.env.VITE_API_URL}/deleteReceta/${id}`, { method: 'DELETE' });
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

const recetasColumns = (setRecetas, handleEditReceta, handleMedicamentos) => [
  { name: 'Doctor', selector: row => row.doctor, sortable: true, wrap: true },
  { name: 'Paciente', selector: row => row.paciente, sortable: true, wrap: true },
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
          style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => handleEditReceta(row)}
        />
        <FaEye
          color='black'
          title='Ver Receta'
          style={{ cursor: 'pointer' }}
          onClick={() => handleMedicamentos(row)}
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
  const [showMedic, setShowMedic] = useState(false);
  const [editingReceta, setEditingReceta] = useState(null);

  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [medicamentos, setMedicamentos] = useState([
    { medicamento: '', dosis: '', instrucciones: '' }
  ]);

  const [fechaEmision, setFechaEmision] = useState('');
  const [fechaVencimiento, setfechaVencimiento] = useState('');
  const [selectedField, setSelectedField] = useState('paciente');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleShow = () => {
    setPaciente('');
    setDoctor('');
    setFechaEmision('');
    setfechaVencimiento('');
    setMedicamentos([{ medicamento: '', dosis: '', instrucciones: '' }]);
    setEditingReceta(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setPaciente('');
    setDoctor('');
    setFechaEmision('');
    setfechaVencimiento('');
    setMedicamentos([{ medicamento: '', dosis: '', instrucciones: '' }]);
    setEditingReceta(null);
    setShowModal(false);
    setShowMedic(false);
  };


  const handleEditReceta = async (receta) => {
    setPaciente(receta.codpaci);
    setDoctor(receta.coddoc);
    setFechaEmision(formatDate(receta.fecha_inicio));
    setfechaVencimiento(formatDate(receta.fecha_fin));
    setEditingReceta(receta);

    const medicamentosData = await fetchMedicamentosByReceta(receta.id);

    if (Array.isArray(medicamentosData) && medicamentosData.length > 0) {
      setMedicamentos(medicamentosData);
    } else {
      setMedicamentos([{ medicamento: '', dosis: '', instrucciones: '' }]);
    }
    setShowModal(true);
  };


  const handleMedicamentos = async (receta) => {
    try {
      setEditingReceta(receta);
      setPaciente(receta.codpaci);
      setDoctor(receta.coddoc);
      setFechaEmision(formatDate(receta.fecha_inicio));
      setfechaVencimiento(formatDate(receta.fecha_fin));

      const data = await fetchMedicamentosByReceta(receta.id);
      if (Array.isArray(data) && data.length > 0) {
        setMedicamentos(data);
      } else {
        setMedicamentos([{ medicamento: '', dosis: '', instrucciones: '' }]);
      }

      setShowMedic(true);
    } catch (error) {
      console.error('Error al cargar medicamentos para vista:', error);
      Swal.fire('Error', 'No se pudieron cargar los medicamentos', 'error');
    }
  };


  useEffect(() => {
    fetchRecetas(setRecetas);
    fetchUsuarios(setPacientes)
    fetchDoctores(setDoctores)
  }, []);

  const handleAddMedicamento = () => {
    setMedicamentos([...medicamentos, { medicamento: '', dosis: '', instrucciones: '' }]);
  };

  const handleMedicamentoChange = (index, field, value) => {
    const nuevosMedicamentos = [...medicamentos];
    nuevosMedicamentos[index][field] = value;
    setMedicamentos(nuevosMedicamentos);
  };

  const handleSaveReceta = async () => {
    const recetasData = medicamentos.map((med) => ({
      historial_id: editingReceta ? editingReceta.historial_id : null, 
      coddoc: Number(doctor),
      codpaci: Number(paciente),
      medicamento: med.medicamento,
      dosis: med.dosis,
      instrucciones: med.instrucciones,
      fecha_inicio: fechaEmision,
      fecha_fin: fechaVencimiento,
      estado: 'Activo',
    }));

    const url = editingReceta
      ? `${import.meta.env.VITE_API_URL}/updateReceta/${editingReceta.id}`
      : `${import.meta.env.VITE_API_URL}/createReceta`;

    const method = editingReceta ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recetas: recetasData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la receta');
      }

      fetchRecetas(setRecetas);
      Swal.fire('Éxito', 'Receta guardada correctamente', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al guardar receta:', error);
      Swal.fire('Error', error.message, 'error');
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
        title="Gestión de Recetas y Medicamentos"
        columns={recetasColumns(setRecetas, handleEditReceta, handleMedicamentos)}
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
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Emisión</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaEmision}
                      onChange={(e) => setFechaEmision(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Vencimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaVencimiento}
                      onChange={(e) => setfechaVencimiento(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {medicamentos.map((med, index) => (
                <Row key={index}>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Medicamento</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese el medicamento"
                        value={med.medicamento}
                        onChange={(e) => handleMedicamentoChange(index, 'medicamento', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dosis</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese la dosis"
                        value={med.dosis}
                        onChange={(e) => handleMedicamentoChange(index, 'dosis', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Frecuencia(Horas)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese la frecuencia"
                        value={med.instrucciones}
                        onChange={(e) => handleMedicamentoChange(index, 'instrucciones', e.target.value)}
                        min={0}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="d-flex align-items-center">
                    {index > 0 && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          const nuevos = medicamentos.filter((_, i) => i !== index);
                          setMedicamentos(nuevos);
                        }}
                      >
                        &times;
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}

              <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={handleAddMedicamento}>
                  + Agregar otro medicamento
                </Button>
              </div>
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


      <Modal show={showMedic} onHide={handleClose} centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Generar Receta Médica</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente</Form.Label>
                  <Form.Select value={paciente} disabled>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {`${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select value={doctor} disabled>
                    {doctores.map((d) => (
                      <option key={d.coddoc} value={d.coddoc}>
                        {`${d.nomdoc} ${d.apepaternodoc} ${d.apematernodoc}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Emisión</Form.Label>
                  <Form.Control type="date" value={fechaEmision} disabled />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Vencimiento</Form.Label>
                  <Form.Control type="date" value={fechaVencimiento} disabled />
                </Form.Group>
              </Col>
            </Row>

            {medicamentos.map((med, index) => (
              <Row key={index}>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Medicamento</Form.Label>
                    <Form.Control type="text" value={med.medicamento} disabled />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dosis</Form.Label>
                    <Form.Control type="text" value={med.dosis} disabled />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Frecuencia (Horas)</Form.Label>
                    <Form.Control type="number" value={med.instrucciones} disabled />
                  </Form.Group>
                </Col>
              </Row>
            ))}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <PDFDownloadLink
            document={
              <RecetaPDF
      paciente={editingReceta?.paciente || ''}
      doctor={editingReceta?.doctor || ''}
                fecha_inicio={fechaEmision}
                fecha_fin={fechaVencimiento}
                medicamentos={medicamentos}
              />
            }
            fileName={`receta-${paciente}-${new Date().toISOString().split('T')[0]}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button variant="secondary" disabled>Generando...</Button>
              ) : (
                <Button variant="primary">Descargar PDF</Button>
              )
            }
          </PDFDownloadLink>
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
