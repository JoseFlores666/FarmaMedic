import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaCalendarCheck, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Col, Form, Row } from 'react-bootstrap';

const API_URL = 'https://back-farmam.onrender.com/api';

const fetchCitas = async (setCitas) => {
  try {
    const response = await fetch(`${API_URL}/getCitas`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener citas');
    }
    const data = await response.json();
    setCitas(data);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    Swal.fire('Error', error.message || 'No se pudo obtener la lista de citas', 'error');
  }
};

const fetchUsuarios = async (setPacientes) => {
  try {
    const response = await fetch(`${API_URL}/getUsuariosAll`);
    const dataPacientes = await response.json();
    setPacientes(dataPacientes);
  } catch (error) {
    console.error('Error al obtener Citas:', error);
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

const eliminarCita = async (id, setCitas) => {
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
        const response = await fetch(`${API_URL}/deleteCita/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchCitas(setCitas);
          Swal.fire("Eliminado", "La cita ha sido eliminada.", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la cita.", "error");
        }
      } catch (error) {
        console.error("Error eliminando la cita:", error);
        Swal.fire("Error", "Hubo un problema al eliminar la cita.", "error");
      }
    }
  });
};

const eliminarTodasCitas = async (fetchCitas, setCitas) => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const coddoc = authData ? authData.id : null;console.log(coddoc)
  if (!coddoc) {
    Swal.fire("Error", "No se pudo obtener el ID de usuario.", "error");
    return;
  }

  Swal.fire({
    title: '¿Eliminar todas mis citas?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/deleteAllCitasByDoctor/${coddoc}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchCitas(setCitas); 
          Swal.fire("Eliminado", "Todas las citas han sido eliminadas.", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar las citas.", "error");
        }
      } catch (error) {
        console.error("Error eliminando todas las citas:", error);
        Swal.fire("Error", "Hubo un problema al eliminar las citas.", "error");
      }
    }
  });
};

const userColumns = (setCitas, handleEditCita, abrirModal) => [
  { name: '#', selector: row => row.id, sortable: true, width: "55px" },
  { name: 'Paciente', selector: row => row.paciente || 'Vacante', sortable: true },
  { name: 'Doctor', selector: row => row.doctor, sortable: true },
  { name: 'Especialidad', selector: row => row.especialidad, sortable: true },
  { name: 'Fecha Cita', selector: row => row.fecha, sortable: true, format: row => new Date(row.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
  { name: 'Hora', selector: row => row.hora, sortable: true },
  { name: 'Atendido', selector: row => (row.atendido === "0" ? "NO" : "SI"), sortable: true },
  { name: 'Estado', selector: row => row.estado, sortable: true },
  { name: 'Motivo de la cita', selector: row => row.motivo_cita || 'Sin motivo', sortable: true },
  { name: 'Fecha creado', selector: row => row.fecha_creacion, sortable: true, format: row => new Date(row.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaTrash
          color='red'
          title='Eliminar'
          style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => eliminarCita(row.id, setCitas)}
        />
        <FaEdit
          color='blue'
          title='Editar'
          style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => handleEditCita(row)}
        />
        <FaCalendarCheck
          color="green"
          style={{ cursor: "pointer" }}
          title="Reservar Cita"
          onClick={() => abrirModal(row)}
        />
      </div>
    ),
    ignoreRowClick: true,
  },
];

const FilterComponent = ({ filterText, onFilter, onClear, handleShow }) => (
  <div className="input-group">
    <input type="text" className="form-control" placeholder="Buscar Doctor" value={filterText} onChange={onFilter} />
    <button className="btn btn-danger" onClick={onClear}>X</button>
    <button className="btn btn-success" onClick={handleShow}>Añadir Cita</button>
    <button className="btn btn-danger" onClick={eliminarTodasCitas}>Eliminar Todas Mis Citas</button>
  </div>
);

export const CitasMedicas = () => {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);

  const [fecha, setFecha] = useState('');

  const [estado, setEstado] = useState('');
  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [motivoCita, setMotivoCita] = useState("");
  const [hora, setHora] = useState('');
  const [editingCita, setEditingCita] = useState(null);
  const [selectCita, setSelectCita] = useState(null);

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);


  const handleShow = () => {
    setPaciente('');
    setDoctor('');
    setEstado('')
    setMotivoCita('');
    setHora('');
    setEspecialidad('')
    setFecha('')
    setEditingCita('');
    setEditingCita(null);
    setShowModal2(true);
  };

  const handleClose = () => {
    setPaciente('');
    setDoctor('');
    setEstado('')
    setMotivoCita('');
    setHora('');
    setEspecialidad('')
    setFecha('')
    setEditingCita('');
    setEditingCita(null);
    setShowModal2(false);
  };

  const handleEditCita = (Cita) => {
    setPaciente(Cita.codpaci);
    setDoctor(Cita.coddoc);
    setEstado(Cita.estado)
    setMotivoCita(Cita.motivo_cita);
    setHora(Cita.hora);
    setEspecialidad(Cita.especialidad)
    setFecha(Cita.fecha)
    setEditingCita(Cita);
    setShowModal2(true);
  };

  const abrirModal = (Cita) => {
    setDoctor(Cita.doctor);
    setEspecialidad(Cita.especialidad);
    setFecha(Cita.fecha);
    setHora(Cita.hora);
    setMotivoCita(Cita.motivo_cita);
    setSelectCita(Cita);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setDoctor('');
    setEspecialidad('');
    setFecha('');
    setHora('');
    setMotivoCita('');
    setShowModal(false);
  };

  useEffect(() => {
    fetchCitas(setCitas);
    fetchUsuarios(setPacientes)
    fetchDoctores(setDoctores)
  }, []);

  const handleSaveCita = async () => {
    if (!paciente) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    const CitaData = {
      codpaci: paciente,
      coddoc:doctor,
      estado,
      hora,
      fecha,
      motivo_cita:motivoCita,
    };
    const url = editingCita
      ? `${API_URL}/updateCita/${editingCita.id}`
      : `${API_URL}/createCita`;

    const method = editingCita ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CitaData),
      });

      if (!response.ok) throw new Error('Error al guardar el Cita');

      fetchCitas(setCitas);
      Swal.fire('Éxito', 'Cita guardado correctamente', 'success');
      handleClose();
    } catch (error) {
      console.error('Error al guardar el Cita:', error);
      Swal.fire('Error', 'No se pudo guardar el Cita', 'error');
    }
  };

  const reservarCita = async () => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const pacienteId = authData ? authData.id : null;  
      if (!pacienteId) {
      Swal.fire('Error', 'No se ha encontrado el ID del paciente', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservarCita`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectCita.id,
          codpaci: pacienteId,
          motivoCita: motivoCita
        }),
      });

      if (!response.ok) {
        console.error('Respuesta del servidor:', await response.text());
        throw new Error('Error al reservar la cita');
      }
      fetchCitas(setCitas);
      Swal.fire('Éxito', 'Cita reservada con éxito', 'success');
      cerrarModal();
    } catch (error) {
      console.error('Error al reservar la cita:', error);
      Swal.fire('Error', error.message || 'No se pudo reservar la cita', 'error');
    }
  };

  const filteredItems = citas.filter(
    item => (item.paciente || '').toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        handleShow={handleShow}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className='mt-5'>
      <DataTable
        title="Gestión de Citas Médicas"
        columns={userColumns(setCitas, handleEditCita, abrirModal)}
        data={filteredItems}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 50]}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        highlightOnHover
        responsive
      />
      <Modal show={showModal2} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingCita ? 'Editar Cita' : 'Añadir Cita'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="mb-3">
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
                <Form.Group>
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
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de la consulta</Form.Label>
                  <Form.Control
                    type="date"
                    value={fecha ? fecha.split('T')[0] : ''}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora de la consulta</Form.Label>
                  <Form.Control
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Motivo de la cita</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={motivoCita}
                placeholder="Ingrese el motivo de la cita"
                onChange={(e) => setMotivoCita(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado de la Cita</Form.Label>
              <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Seleccione un estado</option>
                <option value="Disponible">Disponible</option>
                <option value="Reservada">Reservada</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
                <option value="No asistió">No asistió</option>
              </Form.Select>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
              <Button variant="primary" onClick={handleSaveCita}>
                {editingCita ? 'Actualizar Cita' : 'Guardar Cita'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Reservar Cita?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='row'>
              <div className='col-md-3'>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className='col-md-3'>
                <Form.Group className="mb-3">
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control
                    type="text"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className='col-md-3'>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className='col-md-3'>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="text"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Motivo de la Cita</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ingrese el motivo"
                rows={6}
                value={motivoCita}
                onChange={(e) => setMotivoCita(e.target.value)}
                style={{ resize: 'none' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cerrar</Button>
          <Button variant="primary" onClick={reservarCita}>Reservar Cita</Button>
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

export default CitasMedicas;
