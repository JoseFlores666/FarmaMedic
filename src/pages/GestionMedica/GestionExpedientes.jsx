import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';

const API_URL = 'https://back-farmam.onrender.com/api';
const authData = JSON.parse(localStorage.getItem("authData"));
const userId = authData ? authData.id : null;
const fetchExpedientes = async (setExpedientes) => {
  try {
    const response = await fetch(`${API_URL}/getExpediente`);
    const data = await response.json();
    setExpedientes(data);
  } catch (error) {
    console.error('Error al obtener expedientes:', error);
  }
};

const fetchUsuarios = async (setPacientes) => {
  try {
    const response = await fetch(`${API_URL}/getUsuariosAll`);
    const dataPacientes = await response.json();
    setPacientes(dataPacientes);
  } catch (error) {
    console.error('Error al obtener expedientes:', error);
  }
};

const eliminarExpediente = async (id, setExpedientes) => {
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
        await fetch(`${API_URL}/deleteExpediente/${id}`, { method: 'DELETE' });
        setExpedientes(prevExpedientes => prevExpedientes.filter(expediente => expediente.id !== id));
        Swal.fire('Eliminado', 'Expediente eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar el expediente:', error);
        Swal.fire('Error', 'No se pudo eliminar el expediente', 'error');
      }
    }
  });
};

const expedienteColumns = (setExpedientes, handleEditExpediente) => [
  { name: '#', selector: row => row.id, sortable: true, width: "53px" },
  { name: 'Paciente', selector: row => row.nombre, sortable: true, width: "150px" },
  { name: 'Antecedentes', selector: row => row.antecedentes, sortable: true, wrap: true },
  { name: 'Alergias', selector: row => row.alergias, sortable: true, wrap: true },
  { name: 'Enfermedades', selector: row => row.enfermedades, sortable: true },
  { name: 'Medicamentos', selector: row => row.medicamentos, sortable: true },
  { name: 'Notas', selector: row => row.notas, sortable: true },
  { name: 'Altura', selector: row => row.altura, sortable: true },
  { name: 'Peso', selector: row => row.peso, sortable: true },
  { name: 'BMI', selector: row => row.bmi, sortable: true },
  { name: 'Presión Respiratoria', selector: row => row.presion_resp, sortable: true },
  { name: 'Temperatura', selector: row => row.temperatura, sortable: true },
  { name: 'Presión Arterial', selector: row => row.presion_art, sortable: true },
  { name: 'Presión Cardiaca', selector: row => row.presion_card, sortable: true },
  { name: 'Tipo de Sangre', selector: row => row.tipo_sangre, sortable: true },
  { name: 'Fecha Actualización', selector: row => row.fecha_actualizacion, sortable: true },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaTrash color='red' title='Eliminar' style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => eliminarExpediente(row.id, setExpedientes)} />
        <FaEdit color='blue' title='Editar' style={{ cursor: 'pointer' }}
          onClick={() => handleEditExpediente(row)} />
      </div>
    ),
    ignoreRowClick: true,
  },
];

const FilterComponent = ({ filterText, onFilter, onClear, onShowModal }) => (
  <div className="input-group">
    <input type="text" className="form-control" placeholder="Buscar paciente" value={filterText} onChange={onFilter} />
    <button className="btn btn-danger" onClick={onClear}>X</button>
    <button className="btn btn-success" onClick={onShowModal}>Añadir Expediente</button>
  </div>
);

export const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paciente, setPaciente] = useState('');
  const [enfermedades, setEnfermedades] = useState('');
  const [medicamentos, setMedicamentos] = useState('');
  const [notas, setNotas] = useState('');
  const [editingExpediente, setEditingExpediente] = useState(null);
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [bmi, setBmi] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [presionResp, setPresionResp] = useState('');
  const [presionCard, setPresionCard] = useState('');
  const [presionArt, setPresionArt] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [antecedentes, setAntecedentes] = useState('');
  const [alergias, setAlergias] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleShow = () => {
    setPaciente('');
    setEnfermedades('');
    setMedicamentos('');
    setNotas('');
    setAltura('');
    setPeso('');
    setBmi('');
    setTemperatura('');
    setPresionResp('');
    setPresionArt('');
    setPresionCard('');
    setTipoSangre('');
    setMotivo('')
    setEditingExpediente(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setPaciente('');
    setEnfermedades('');
    setMedicamentos('');
    setNotas('');
    setAltura('');
    setPeso('');
    setBmi('');
    setTemperatura('');
    setPresionResp('');
    setPresionArt('');
    setPresionCard('');
    setTipoSangre('');
    setEditingExpediente(null);
    setShowModal(false);
  };

  const handleEditExpediente = (expediente) => {
    setEditingExpediente(expediente);
    setPaciente(expediente.codpaci);
    setAntecedentes(expediente.antecedentes);
    setAlergias(expediente.alergias);
    setMedicamentos(expediente.medicamentos)
    setNotas(expediente.notas);
    setTemperatura(expediente.temperatura);
    setPresionResp(expediente.presion_resp);
    setPresionArt(expediente.presion_art);
    setPresionCard(expediente.presion_card);
    setTipoSangre(expediente.tipo_sangre);
    setAltura(expediente.altura);
    setPeso(expediente.peso);
    setBmi(expediente.bmi);
    setEnfermedades(expediente.enfermedades)
    setShowModal(true);
  };

  useEffect(() => {
    fetchExpedientes(setExpedientes);
    fetchUsuarios(setPacientes)
  }, []);

  const handleSaveExpediente = async () => {
    if (!paciente || !enfermedades || !medicamentos || !notas) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    const expedienteData = {
      codpaci: paciente,
      enfermedades,
      medicamentos,
      notas,
      altura,
      peso,
      bmi,
      temperatura,
      presion_resp: presionResp,
      presion_card: presionCard,
      presion_art: presionArt,
      tipo_sangre: tipoSangre,
      antecedentes,
      alergias,
      motivo,
      coddoc:userId
    };

    const url = editingExpediente
      ? `${API_URL}/updateExpediente/${editingExpediente.id}`
      : `${API_URL}/createExpediente`;

    const method = editingExpediente ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expedienteData),
      });

      if (!response.ok) throw new Error('Error al guardar el expediente');

      fetchExpedientes(setExpedientes);
      Swal.fire('Éxito', 'Expediente guardado correctamente', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al guardar el expediente:', error);
      Swal.fire('Error', 'No se pudo guardar el expediente', 'error');
    }
  };


  const filteredItems = expedientes.filter(item =>
    item.nombre && item.nombre.toString().toLowerCase().includes(filterText.toLowerCase())
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
        title="Gestión de Expedientes Medicos"
        columns={expedienteColumns(setExpedientes, handleEditExpediente)}
        data={filteredItems}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        highlightOnHover
        responsive
      />
      <Modal show={showModal} onHide={handleClose} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{editingExpediente ? 'Editar Expediente' : 'Agregar Nuevo Expediente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Altura</Form.Label>
                  <Form.Control
                    type="text"
                    name='altura'
                    placeholder="Ingrese la altura"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Peso</Form.Label>
                  <Form.Control
                    type="text"
                    name='peso'
                    placeholder="Ingrese el peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>IMC</Form.Label>
                  <Form.Control
                    type="text"
                    name='bmi'
                    placeholder="Ingrese el IMC"
                    value={bmi}
                    onChange={(e) => setBmi(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Temperatura</Form.Label>
                  <Form.Control
                    type="text"
                    name='temperatura'
                    placeholder="Ingrese la temperatura"
                    value={temperatura}
                    onChange={(e) => setTemperatura(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Presion Respiratoria</Form.Label>
                  <Form.Control
                    type="text"
                    name='imagen'
                    placeholder="Ingrese la presion respiratoria"
                    value={presionResp}
                    onChange={(e) => setPresionResp(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Presion Cardiaca</Form.Label>
                  <Form.Control
                    type="text"
                    name='imagen'
                    placeholder="Ingrese la presion cardiaca"
                    value={presionCard}
                    onChange={(e) => setPresionCard(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Presion Arterial</Form.Label>
                  <Form.Control
                    type="text"
                    name='imagen'
                    placeholder="Ingrese la presion arterial"
                    value={presionArt}
                    onChange={(e) => setPresionArt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Sangre</Form.Label>
                  <Form.Select
                    value={tipoSangre}
                    onChange={(e) => setTipoSangre(e.target.value)}
                  >
                    <option value="">Seleccione un tipo de sangre</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Atecedetes</Form.Label>
                  <Form.Control
                    as="textarea"
                    name='imagen'
                    placeholder="Ingrese los antecedentes"
                    rows={4}
                    value={antecedentes}
                    onChange={(e) => setAntecedentes(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Alergias</Form.Label>
                  <Form.Control
                    as="textarea"
                    name='imagen'
                    placeholder="Ingrese las alergias"
                    rows={4}
                    value={alergias}
                    onChange={(e) => setAlergias(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Enfermedades</Form.Label>
                  <Form.Control
                    as="textarea"
                    name='imagen'
                    placeholder="Ingrese las enfermedades"
                    rows={4}
                    value={enfermedades}
                    onChange={(e) => setEnfermedades(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Medicamentos</Form.Label>
                  <Form.Control
                    as="textarea"
                    name='imagen'
                    placeholder="Ingrese los medicamentos"
                    rows={4}
                    value={medicamentos}
                    onChange={(e) => setMedicamentos(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Notas</Form.Label>
                  <Form.Control
                    as="textarea"
                    name='imagen'
                    placeholder="Ingrese la nota"
                    rows={4}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </Form.Group>
              </Col>
              {editingExpediente && (
                <Form.Group controlId="motivo">
                    <Form.Label>Motivo de actualización</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el motivo" 
                        value={motivo} 
                        onChange={(e) => setMotivo(e.target.value)} 
                    />
                </Form.Group>
            )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveExpediente}>{editingExpediente ? 'Editar Expediente' : 'Guardar Expediente'}</Button>
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

export default Expedientes;
