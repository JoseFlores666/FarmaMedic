import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaBan, FaCalendarCheck, FaEdit, FaSyncAlt } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import CustomDataTable from '../../components/Tables/CustomDataTable';
import FilterComponent from '../../components/FilterComponent';

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

const fetchListaEspera = async (codcita, setListaEspera) => {
  try {
    const response = await fetch(`${API_URL}/getListaEspera/${codcita}`);
    const data = await response.json();
    setListaEspera(data);
  } catch (error) {
    console.error('Error al obtener lista de espera:', error);
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

const userColumns = (setCitas, handleEditCita, abrirModal, handleReagendarCita, handleCancelarCita) => [
  { name: 'Paciente', selector: row => row.paciente || 'Vacante', sortable: true },
  { name: 'Doctor', selector: row => row.doctor, sortable: true },
  { name: 'Especialidad', selector: row => row.especialidad, sortable: true },
  { name: 'Fecha Cita', selector: row => row.fecha, sortable: true, format: row => new Date(row.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
  { name: 'Hora', selector: row => row.hora, sortable: true },
  { name: 'Estado', selector: row => row.estado, sortable: true },
  { name: 'Motivo de la cita', selector: row => row.motivo_cita || 'Sin motivo', sortable: true },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaEdit
          color='blue'
          title='Editar Datos'
          style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => handleEditCita(row)}
        />
        <FaSyncAlt
          color="green"
          style={{ cursor: 'pointer', marginRight: 10 }}
          title="Reagendar Cita"
          onClick={() => handleReagendarCita(row)}
        />
        <FaCalendarCheck
          color="green"
          style={{ cursor: 'pointer', marginRight: 10 }}
          title="Reservar Cita"
          onClick={() => abrirModal(row)}
        />
        <FaBan
          color='red'
          title='Cancelar'
          style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => handleCancelarCita(row)}
        />
      </div>
    ),
    ignoreRowClick: true,
  },
];

export const CitasMedicas = () => {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [listaEspera, setListaEspera] = useState([]);

  const [fecha, setFecha] = useState('');
  const [fechaNueva, setFechaNueva] = useState('');
  const [horaNueva, setHoraNueva] = useState('');

  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [motivoCita, setMotivoCita] = useState('');
  const [motivoOriginal, setMotivoOriginal] = useState('');
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [hora, setHora] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [editingCita, setEditingCita] = useState(null);
  const [selectCita, setSelectCita] = useState(null);

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);

  const [pacienteCitaActual, setPacienteCitaActual] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const estaReservada = !!pacienteCitaActual;
  const opcionesPacientes = pacientes.map(p => ({
    value: p.id,
    label: p.nombreUsuario,
  }));
  const opcionesDoctores = doctores.map(d => ({
    value: d.coddoc,
    label: d.nombreCompleto,
  }));

  const [selectedField, setSelectedField] = useState('paciente');

  const handleShow = () => {
    setPaciente('');
    setDoctor('');
    setMotivoCita('');
    setHora('');
    setEspecialidad('')
    setFecha('')
    setEditingCita('');
    setEditingCita(null);
    setFechaCreacion('');
    setShowModal2(true);

  };

  const cerrarModals = () => {
    setShowModal(false);
    setShowModal2(false);
    setShowModal4(false);
    setShowModal5(false);
    setPaciente('');
    setDoctor('');
    setMotivoCita('');
    setHora('');
    setEspecialidad('')
    setFecha('')
    setEditingCita('');
    setListaEspera([]);
    setEditingCita(null);
  }



  const handleEditCita = (Cita) => {
    setPacienteSeleccionado(Cita.codpaci);
    setFechaCreacion(Cita.fecha_creacion);
    setDoctor(Cita.coddoc);
    setMotivoCita(Cita.motivo_cita);
    setHora(Cita.hora);
    setEspecialidad(Cita.especialidad)
    setFecha(Cita.fecha)
    setEditingCita(Cita);
    setShowModal2(true);
  };

  const handleReagendarCita = (Cita) => {
    setPaciente(Cita.codpaci);
    setFechaCreacion(Cita.fecha_creacion);
    setDoctor(Cita.coddoc);
    setMotivoCita(Cita.motivo_cita);
    setHora(Cita.hora);
    setEspecialidad(Cita.especialidad)
    setFecha(Cita.fecha)
    setEditingCita(Cita);
    setShowModal4(true);
  };

  const handleCancelarCita = (Cita) => {
    setFechaCreacion(Cita.fecha_creacion);
    setPaciente(Cita.codpaci);
    setDoctor(Cita.doctor);
    setMotivoCita(Cita.motivo_cita);
    setHora(Cita.hora);
    setEspecialidad(Cita.especialidad)
    setFecha(Cita.fecha)
    setEditingCita(Cita);
    setShowModal5(true);
  };

  const abrirModal = (Cita) => {
    setDoctor(Cita.doctor);
    setFechaCreacion(Cita.fecha_creacion);
    setEspecialidad(Cita.especialidad);
    setFecha(Cita.fecha);
    setHora(Cita.hora);
    setMotivoCita(Cita.motivo_cita || '');
    setMotivoOriginal(Cita.motivo_cita || '');
    setMotivoCita(''); setSelectCita(Cita);
    setPacienteCitaActual(Cita.codpaci || null);
    setPacienteSeleccionado(null);
    fetchListaEspera(Cita.codcita, setListaEspera);
    setShowModal(true);
  };

  useEffect(() => {
    fetchCitas(setCitas);
    fetchUsuarios(setPacientes)
    fetchDoctores(setDoctores)
  }, []);

  const handleSaveCita = async () => {
    if (!pacienteSeleccionado || !doctor || !motivoCita) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    let CitaData = {
      codpaci: pacienteSeleccionado,
      coddoc: doctor,
      motivo_cita: motivoCita,
    };

    if (!editingCita) {
      CitaData = {
        ...CitaData,
        hora,
        fecha,
      };
    } else {
      CitaData = {
        ...CitaData,
      };
    }

    const url = editingCita
      ? `${API_URL}/editarDatosCita/${editingCita.id}`
      : `${API_URL}/createCita`;

    const method = editingCita ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(CitaData),
      });

      if (!response.ok) throw new Error('Error al guardar la cita');

      fetchCitas(setCitas);
      Swal.fire('Éxito', 'Cita guardada correctamente', 'success');
      cerrarModals();
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      Swal.fire('Error', 'No se pudo guardar la cita', 'error');
    }
  };

  const cancelarYReemplazarCita = async (codcita) => {
    try {
      const res = await fetch(`${API_URL}/reemplazarCita/${codcita}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        cerrarModals();
        fetchCitas(setCitas);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Cita reemplazada automáticamente',
          confirmButtonColor: '#3085d6',
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sin reemplazo',
          text: data.message || 'No hay pacientes en lista de espera',
          confirmButtonColor: '#3085d6',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en la petición',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleCancelarYEliminarCita = async () => {
    if (!motivoCancelacion || motivoCancelacion.trim() === '') {
      Swal.fire('Error', 'Por favor ingresa el motivo de la cancelación', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cancelarYEliminarCita`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCita.id,
          motivoCancelacion: motivoCancelacion
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al cancelar la cita');
      }

      Swal.fire('Éxito', 'Cita cancelada y notificaciones enviadas', 'success');
      cerrarModals();
      fetchCitas(setCitas);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.message || 'Error al cancelar la cita', 'error');
    }
  };


  const eliminarListaEspera = async (id) => {
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
          const response = await fetch(`${API_URL}/deleteListaEspera/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            fetchCitas(setCitas);
            Swal.fire("Eliminado", "Has sido eliminado de la lista de espera.", "success");
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

  const handleReagendarSubmit = async () => {
    if (!fechaNueva || !horaNueva) {
      alert("Debes completar la nueva fecha, hora y codhor.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reagendarCita/${editingCita.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha: fechaNueva,
          hora: horaNueva,
          codpaci: editingCita.codpaci,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reagendar la cita');
      }

      Swal.fire('Éxito', 'Cita reagendada correctamente', 'success');
      cerrarModals();
      fetchCitas(setCitas);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const reservarCita = async () => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const role = authData?.role;

    const pacienteId = role === 1 ? pacienteSeleccionado : authData?.id;

    if (!pacienteId) {
      Swal.fire('Error', 'Debe seleccionar un paciente', 'error');
      return;
    }

    try {
      if (role !== 'admin') {
        const checkResponse = await fetch(`${API_URL}/checkCitaPendiente?codpaci=${pacienteId}`);
        const checkData = await checkResponse.json();

        if (checkData.tieneCitaPendiente) {
          const confirmar = await Swal.fire({
            title: 'Ya tienes una cita pendiente',
            text: '¿Deseas agregarte a la lista de espera para otra cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, agregar a lista de espera',
            cancelButtonText: 'Cancelar'
          });

          if (!confirmar.isConfirmed) return;

          await agregarListaEspera(pacienteId);
          return;
        }
      }

      const response = await fetch(`${API_URL}/reservarCita`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectCita.id,
          codpaci: pacienteId,
          motivoCita: motivoCita
        }),
      });

      if (response.status === 409) {
        const confirmar = await Swal.fire({
          title: 'Cita ya reservada',
          text: '¿Deseas agregarte a la lista de espera?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Sí, agregar',
          cancelButtonText: 'No'
        });

        if (confirmar.isConfirmed) {
          await agregarListaEspera(pacienteId);
        }

        return;
      }

      if (!response.ok) throw new Error(await response.text());

      Swal.fire('Éxito', 'Cita reservada con éxito', 'success');
      fetchCitas(setCitas);
      cerrarModals();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.message || 'Error al reservar cita', 'error');
    }
  };


  const agregarListaEspera = async (pacienteId) => {
    try {
      const response = await fetch(`${API_URL}/agregarListaEspera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codcita: selectCita.id,
          codpaci: pacienteId,
          motivo_consulta: motivoCita
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      Swal.fire('Agregado', 'El paciente fue agregado a la lista de espera', 'success');
      cerrarModals();
      fetchCitas(setCitas);
    } catch (error) {
      console.error('Error al agregar a lista de espera:', error);
      Swal.fire('Error', error.message || 'No se pudo agregar a lista de espera', 'error');
    }
  };

  const filteredItems = (citas || []).filter(item => {
    const filter = filterText.toLowerCase();
    let fieldValue = '';

    switch (selectedField) {
      case 'paciente':
        fieldValue = item.paciente?.toLowerCase() || '';
        break;
      case 'doctor':
        fieldValue = item.doctor?.toLowerCase() || '';
        break;
      case 'estado':
        fieldValue = item.estado?.toLowerCase() || '';
        break;
      case 'especialidad':
        fieldValue = item.especialidad?.toLowerCase() || '';
        break;
      case 'fecha':
        fieldValue = item.fecha || '';
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
        buttonText={'Añadir Cita'}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        fieldsToShow={['doctor', 'paciente', 'estado', 'especialidad', 'fecha']}
      />
    );
  }, [filterText, resetPaginationToggle, selectedField]);


  return (
    <div className=''>
      <CustomDataTable
        title="Gestión de Citas Medicas"
        columns={userColumns(setCitas, handleEditCita, abrirModal, handleReagendarCita, handleCancelarCita)}
        data={filteredItems}
        subHeaderComponent={subHeaderComponentMemo}
      />
      <Modal show={showModal2} onHide={cerrarModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingCita ? 'Editar Cita' : 'Añadir Cita'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente</Form.Label>
                  <Select
                    options={opcionesPacientes}
                    placeholder="Seleccione un paciente"
                    isClearable
                    value={opcionesPacientes.find(op => op.value === pacienteSeleccionado) || null}
                    onChange={(selected) => setPacienteSeleccionado(selected ? selected.value : null)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Doctor</Form.Label>
                  <Select
                    options={opcionesDoctores}
                    placeholder="Seleccione un doctor"
                    isClearable
                    value={opcionesDoctores.find(op => op.value === doctor) || null}
                    onChange={(selected) => setDoctor(selected ? selected.value : null)}
                  />
                </Form.Group>

              </Col>
            </Row>
            {!editingCita && (
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
            )}

            <Form.Group className="mb-3">
              <Form.Label>Motivo de la cita</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={motivoCita || ""}
                placeholder="Ingrese el motivo de la cita"
                onChange={(e) => setMotivoCita(e.target.value)}
                style={{ resize: "none" }}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={cerrarModals}>Cerrar</Button>
              <Button variant="primary" onClick={handleSaveCita}>
                {editingCita ? 'Actualizar Cita' : 'Guardar Cita'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={cerrarModals} size={pacienteCitaActual ? "xl" : undefined} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reservar Cita, ¿Para?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form>
                <Row>
                  <Col md={12}>
                    <Select
                      options={opcionesPacientes}
                      placeholder="Selecciona un paciente"
                      isClearable
                      value={
                        pacienteSeleccionado
                          ? pacientes.map(p => ({ value: p.id, label: p.nombreUsuario })).find(op => op.value === pacienteSeleccionado)
                          : null
                      }

                      onChange={(selected) => setPacienteSeleccionado(selected ? selected.value : null)}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Doctor</Form.Label>
                      <Form.Control
                        type="text"
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Especialidad</Form.Label>
                      <Form.Control
                        type="text"
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="text"
                        value={new Date(fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="text"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                </Row>

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
            </Col>
            {estaReservada && (
              <Col>
                <label className="p-1">Cita Actual:</label>
                <Accordion defaultActiveKey={null}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      {pacienteCitaActual
                        ? opcionesPacientes.find(op => op.value === pacienteCitaActual)?.label
                        : "Información de la Cita"}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row className="mb-3">
                        <Col md={8}>
                          <p className="mb-1">
                            <strong>Cita Registrada</strong>{" "}
                            {fechaCreacion
                              ? new Date(fechaCreacion).toLocaleString()
                              : new Date().toLocaleString()}
                          </p>
                        </Col>
                      </Row>
                      <label className='fw-bold d-block mb-1'>Motivo de la cita:</label>
                      <p className="mb-3">{motivoOriginal || "Sin motivo registrado"}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <label className="p-1">Lista de espera:</label>

                {listaEspera.length > 0 ? (
                  <Accordion defaultActiveKey={null}>
                    {listaEspera.map((item, index) => (
                      <Accordion.Item eventKey={String(index)} key={item.id || index}>
                        <Accordion.Header>
                          {opcionesPacientes.find(op => op.value === item.codpaci)?.label || `Paciente ${index + 1}`}
                        </Accordion.Header>

                        <Accordion.Body>
                          <Row className="mb-3">
                            <Col md={10}>
                              <p className="mb-1">
                                <strong>Registrado:</strong>{" "}
                                {item.fecha_registro
                                  ? new Date(item.fecha_registro).toLocaleString()
                                  : "Fecha desconocida"}
                              </p>
                            </Col>

                            <Col md={2} className="d-flex justify-content-end align-items-start mb-2">
                              <Button variant="outline-danger" size="sm" onClick={() => eliminarListaEspera(item.id)}>
                                Cancelar cita
                              </Button>
                            </Col>

                            <label className="fw-bold d-block mb-1">Motivo de la cita:</label>
                            <p className="mb-3">{item.motivo_consulta || "Sin motivo registrado"}</p>
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted">No hay pacientes en lista de espera.</p>
                )}

              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModals}>Cerrar</Button>
          {estaReservada && (
            <div className="d-flex flex-wrap gap-2">
              <Button
                onClick={() => agregarListaEspera(pacienteSeleccionado)}
                variant="warning"
              >
                Añadir a Lista de Espera
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => cancelarYReemplazarCita(selectCita.codcita)}
              >
                Cancelar Cita Actual
              </Button>
            </div>
          )}
          {!estaReservada && (
            <Button variant="primary" onClick={reservarCita}>
              Reservar Cita
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={showModal4} onHide={cerrarModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Reagendar Cita?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      paciente
                        ? pacientes.find(p => p.id === paciente)?.nombreUsuario || "Paciente no encontrado"
                        : "Vacante"
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>


              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Actual</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      fecha
                        ? new Date(fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : ''
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora Actual</Form.Label>
                  <Form.Control
                    type="text"
                    value={hora || ''}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Nueva</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaNueva}
                    onChange={(e) => setFechaNueva(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora Nueva</Form.Label>
                  <Form.Control
                    type="time"
                    value={horaNueva}
                    onChange={(e) => setHoraNueva(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModals}>Cerrar</Button>
          <Button variant="primary" onClick={handleReagendarSubmit}>Reagendar</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal5} onHide={cerrarModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Desea Cancelar y Eliminar esta Cita?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Control
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control
                    type="text"
                    value={especialidad}
                    onChange={(e) => setEspecialidad(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date(fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="text"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>

            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Motivo de la cancelacion</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ingrese el motivo"
                rows={6}
                value={motivoCancelacion || ""}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                style={{ resize: 'none' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModals}>Cerrar</Button>
          <Button variant="primary" onClick={handleCancelarYEliminarCita}>Eliminar</Button>
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
  handleShow2: PropTypes.func.isRequired,

};

export default CitasMedicas;
