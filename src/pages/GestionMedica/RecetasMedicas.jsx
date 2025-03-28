import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';

const API_URL = 'https://back-farmam.onrender.com/api';

const fetchRecetas = async (setRecetas) => {
  try {
    const response = await fetch(`${API_URL}/getRecetas`);
    const data = await response.json();
    setRecetas(data);
  } catch (error) {
    console.error('Error al obtener Recetas:', error);
  }
};

const fetchMedicamentos = async (setMedicamentos) => {
  try {
    const response = await fetch(`${API_URL}/getRecetas`);
    const dataMedicamentos = await response.json();
    setMedicamentos(dataMedicamentos);
  } catch (error) {
    console.error('Error al obtener Recetas:', error);
  }
};

const fetchUsuarios = async (setPacientes) => {
  try {
    const response = await fetch(`${API_URL}/getUsuariosAll`);
    const dataPacientes = await response.json();
    setPacientes(dataPacientes);
  } catch (error) {
    console.error('Error al obtener Recetas:', error);
  }
};

const fetchDoctores = async (setDoctores) => {
  try {
    const response = await fetch(`${API_URL}/getDoc`);
    const dataDoctores = await response.json();
    setDoctores(dataDoctores);
  } catch (error) {
    console.error('Error al obtener Citas:', error);
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
        setRecetas(prevRecetas => prevRecetas.filter(Receta => Receta.id !== id));
        Swal.fire('Eliminado', 'Receta eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar el Receta:', error);
        Swal.fire('Error', 'No se pudo eliminar el Receta', 'error');
      }
    }
  });
};

const recetasColumns = (setRecetas, handleEditReceta) => [
  { name: '#', selector: row => row.id, sortable: true, width: "53px" },
  { name: 'Historial', selector: row => row.historial_id||'', sortable: true, width: "150px" },
  { name: 'Doctor', selector: row => row.doctor, sortable: true, wrap: true },
  { name: 'Paciente', selector: row => row.paciente, sortable: true, wrap: true },
  { name: 'Medicamento', selector: row => row.medicamento, sortable: true },
  { name: 'Dosis', selector: row => row.dosis, sortable: true },
  { name: 'Instrucciones', selector: row => row.instrucciones, sortable: true },
  { name: 'Fecha de Emisión', selector: row => row.fecha_emision, sortable: true },
  { name: 'Fecha de Vencimiento', selector: row => row.fecha_vencimiento, sortable: true },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaTrash color='red' title='Eliminar' style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => eliminarReceta(row.id, setRecetas)} />
        <FaEdit color='blue' title='Editar' style={{ cursor: 'pointer' }}
          onClick={() => handleEditReceta(row)} />
      </div>
    ),
    ignoreRowClick: true,
  },
];

const FilterComponent = ({ filterText, onFilter, onClear, onShowModal }) => (
  <div className="input-group">
    <input type="text" className="form-control" placeholder="Buscar paciente" value={filterText} onChange={onFilter} />
    <button className="btn btn-danger" onClick={onClear}>X</button>
    <button className="btn btn-success" onClick={onShowModal}>Añadir Receta</button>
  </div>
);

export const Recetas = () => {
  const [Recetas, setRecetas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

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
    setFechaEmision(Receta.fechaEmision);
    setfechaVencimiento(Receta.fechaVencimiento);
    setEditingReceta(Receta);
    setShowModal(true);
  };

  useEffect(() => {
    fetchRecetas(setRecetas);
    fetchUsuarios(setPacientes)
    fetchDoctores(setDoctores)
    fetchMedicamentos(setMedicamentos)
  }, []);

  const agregarMedicamento = () => {
    if (medicamento && dosis && instrucciones) {
      setMedicamentos([...medicamentos, { medicamento, dosis, instrucciones }]);
      setMedicamento('');
      setDosis('');
      setInstrucciones('');
    }
  };

  const eliminarMedicamento = (index) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const handleSaveReceta = async () => {
    if (!paciente || !doctor || !fechaEmision || !fechaVencimiento || medicamentos.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios y debe agregar al menos un medicamento', 'error');
      return;
    }
  
    const recetasData = {
      codpaci: paciente,
      coddoc: doctor,
      fecha_emision: fechaEmision,
      fecha_vencimiento: fechaVencimiento,
      medicamentos
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
  
      await fetchRecetas(setRecetas);
      Swal.fire('Éxito', 'Receta guardada correctamente', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      Swal.fire('Error', error.message || 'No se pudo guardar la receta', 'error');
    }
  };
  

  const filteredItems = Recetas.filter(item =>
    item.paciente && item.paciente.toString().toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} onShowModal={handleShow} filterText={filterText} />;
  }, [filterText, resetPaginationToggle]);

  return (
    <div className='mt-5'>
      <DataTable
        title="Gestión de Recetas Medicas"
        columns={recetasColumns(setRecetas, handleEditReceta)}
        data={filteredItems}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        highlightOnHover
        responsive
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
                        {p.nombre}
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
                        {d.nomdoc}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el medicamento"
                    value={medicamento}
                    onChange={(e) => setMedicamento(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Dosis</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la dosis"
                    value={dosis}
                    onChange={(e) => setDosis(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Instrucciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Ingrese las instrucciones"
                    value={instrucciones}
                    rows={3}
                    onChange={(e) => setInstrucciones(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Button variant="success" onClick={agregarMedicamento}>Agregar Medicamento</Button>
              </Col>

              <Col md={12} className="mt-3">
                <h5>Medicamentos Agregados:</h5>
                <ul>
                  {medicamentos.map((med, index) => (
                    <li key={index}>
                      {med.medicamento} - {med.dosis} - {med.instrucciones}
                      <Button variant="danger" size="sm" onClick={() => eliminarMedicamento(index)}>X</Button>
                    </li>
                  ))}
                </ul>
              </Col>


              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de emision</Form.Label>
                  <Form.Control
                    type="date"
                    name='temperatura'
                    placeholder="Ingrese la fecha de emision"
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
                    name='fechaVencimiento'
                    placeholder="Ingrese la fecha de vencimiento"
                    value={fechaVencimiento}
                    onChange={(e) => setfechaVencimiento(e.target.value)}
                  />
                </Form.Group>
              </Col>

            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveReceta}>{editingReceta ? 'Editar Receta' : 'Guardar Receta'}</Button>
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
