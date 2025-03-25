import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from 'react-bootstrap';

const API_URL = 'https://localhost:4000/api';

const fetchHorarios = async (setHorarios, doctores = []) => {
  try {
    const response = await fetch(`${API_URL}/getHorario`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener los horarios');
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("La API no devolvió un array:", data);
      setHorarios([]);
      return;
    }

    const formattedData = data.map(item => {
      const doctor = (doctores || []).find(doc => doc.coddoc === item.coddoc) || { nomdoc: "Desconocido" };
      return {
        id: item.codhor,
        coddoc: item.coddoc,
        nomdoc: doctor.nomdoc,
        dia: item.dia,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        fere: item.fere,
        estado: item.estado
      };
    });

    setHorarios(formattedData.length > 0 ? formattedData : []);
  } catch (error) {
    console.error('Error completo:', error);
    Swal.fire('Error', 'No se pudo obtener los horarios', 'error');
    setHorarios([]);
  }
};

const fetchDoctores = async (setDoctores) => {
  try {
    const response = await fetch(`${API_URL}/getDoc`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al obtener los doctores');

    const data = await response.json();
    setDoctores(data.length > 0 ? data : []);
    return data;
  } catch (error) {
    console.error('Error al obtener los doctores:', error);
    Swal.fire('Error', 'No se pudo obtener los doctores', 'error');
    return [];
  }
};

const eliminarHorario = async (horario, setHorarios) => {
  if (horario.estado !== 'Inactivo') {
    Swal.fire('Error', 'Solo se pueden eliminar horarios inactivos', 'error');
    return;
  }

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
        const response = await fetch(`${API_URL}/deleteHorario/${horario.id}`,
          { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, });

        if (!response.ok) throw new Error('Error al eliminar el horario');

        setHorarios(response);
        Swal.fire('Eliminado', 'Horario eliminado con éxito', 'success');
      } catch (error) {
        console.error('Error al eliminar el horario:', error);
        Swal.fire('Error', 'No se pudo eliminar el horario', 'error');
      }
    }
  });
};

const generarCitas = async (horario) => {
  if (horario.estado === 'Activo') {
    return Swal.fire('Error', 'Solo se pueden modificar horarios inactivos', 'error');
  }
  Swal.fire({
    title: '¿Generar citas?',
    text: `Se crearán las citas a partir de hoy hasta fin de mes para el doctor ${horario.nomdoc} según su horario.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, generar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch(`${API_URL}/generarCitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coddoc: horario.coddoc,
          codhor: horario.id,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin
        }),
      });
      await response.json();
      Swal.fire('Éxito', 'Citas generadas correctamente', 'success');
    }
  });
};


const horarioColumns = (setHorarios, handleEditHorario) => [
  { name: '#', selector: row => row.coddoc, sortable: true, width: "53px" },
  { name: 'Doctor', selector: row => row.nomdoc, sortable: true, width: "150px" },
  { name: 'Día', selector: row => row.dia, sortable: true, wrap: true },
  { name: 'Hora inicio', selector: row => row.hora_inicio, sortable: true, wrap: true },
  { name: 'Hora fin', selector: row => row.hora_fin, sortable: true, wrap: true },
  { name: 'Estado', selector: row => row.estado, sortable: true, wrap: true },
  {
    name: 'Fecha creado',
    selector: row => `${row.fere ? row.fere.split('T')[0] : ''} ${row.hora_inicio}`,
    sortable: true,
    wrap: true
  },
  {
    name: 'Acción',
    cell: row => (
      <div>
        <FaTrash color='red' title='Eliminar' style={{ cursor: 'pointer', marginRight: 10 }}
          onClick={() => eliminarHorario(row, setHorarios)} />

        <FaEdit color='blue' title='Editar' style={{ cursor: 'pointer' }}
          onClick={() => handleEditHorario(row)} />
        <FaPlusCircle color='green' title='Generar Citas' style={{ cursor: 'pointer', marginLeft: 10 }}
          onClick={() => generarCitas(row)} />
      </div>
    ),
    ignoreRowClick: true,
  },
];

const FilterComponent = ({ filterText, onFilter, onClear, onShowModal }) => (
  <div className="input-group">
    <input type="text" className="form-control" placeholder="Buscar Doctor" value={filterText} onChange={onFilter} />
    <button className="btn btn-danger" onClick={onClear}>X</button>
    <button className="btn btn-success" onClick={onShowModal}>Añadir Horario</button>
  </div>
);

export const HorarioCitas = () => {
  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coddoc, setCoddoc] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('17:00');
  const [selectedDia, setSelectedDia] = useState('');
  const [selectedDias, setSelectedDias] = useState([]);
  const [editingHorario, setEditingHorario] = useState(null);
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horasDisponibles = Array.from({ length: 12 }, (_, i) => {
    const horaAM = (i + 1).toString().padStart(2, '0');  
    const horaPM = (i + 1 + 12).toString().padStart(2, '0');  

    return {
      horaAM: `${horaAM}:00`,
      horaPM: `${horaPM}:00`
    };
  });

  const handleShow = () => {
    setCoddoc('');
    setHoraInicio('08:00');
    setHoraFin('17:00');
    setSelectedDia('');
    setSelectedDias([]);
    setEditingHorario(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const convertirAHora24 = (hora) => {
    const horaNum = parseInt(hora.split(':')[0], 10);
    const esPM = hora.includes('PM');
    const esAM = hora.includes('AM');

    if (esAM && horaNum === 12) {
      return 0;
    }

    if (esPM && horaNum !== 12) {
      return horaNum + 12;
    }
    return horaNum;
  };

  const handleAddDia = () => {
    const horaInicio24 = convertirAHora24(horaInicio);
    const horaFin24 = convertirAHora24(horaFin);

    if (horaFin24 - horaInicio24 < 8) {
      Swal.fire('Error', 'La jornada debe ser de al menos 8 horas', 'error');
      return;
    }
    if (selectedDia && !selectedDias.some(d => d.dia === selectedDia)) {
      setSelectedDias([...selectedDias, { dia: selectedDia, hora_inicio: horaInicio, hora_fin: horaFin }]);
      setSelectedDia('');
    }
  };

  const handleRemoveDia = (dia) => {
    setSelectedDias(selectedDias.filter(d => d.dia !== dia));
  };

  useEffect(() => {
    const loadData = async () => {
      const doctoresData = await fetchDoctores(setDoctores);
      if (doctoresData.length > 0) {
        await fetchHorarios(setHorarios, doctoresData);
      }
    };
    loadData();
  }, []);


  const handleSaveHorario = async () => {
    if (!coddoc || !horaInicio || !horaFin || selectedDias.length === 0) {
      Swal.fire('Error', 'Todos los campos son obligatorios, incluyendo al menos un día', 'error');
      return;
    }

    try {
      let response;
      const horarioData = {
        coddoc,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        dias: selectedDias.map(dia => dia.dia),
      };

      if (editingHorario) {
        if (editingHorario.estado !== 'Inactivo') {
          return Swal.fire('Error', 'Solo se pueden modificar horarios inactivos', 'error');
        }

        response = await fetch(`${API_URL}/updateHorario/${editingHorario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(horarioData),
        });

      } else {
        response = await fetch(`${API_URL}/createHorario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(horarioData),
        });
      }

      if (!response.ok) throw new Error('Error al guardar el horario');

      Swal.fire('Éxito', 'Horario guardado correctamente', 'success');
      await fetchHorarios(setHorarios, doctores);
      handleClose();
    } catch (error) {
      console.error('Error al guardar el horario:', error);
      Swal.fire('Error', 'No se pudo guardar el horario', 'error');
    }
  };

  const handleEditHorario = (horario) => {
    setEditingHorario(horario);
    setCoddoc(horario.coddoc);
    setHoraInicio(horario.hora_inicio);
    setHoraFin(horario.hora_fin);
    setSelectedDias([{ dia: horario.dia, hora_inicio: horario.hora_inicio, hora_fin: horario.hora_fin }]);
    setShowModal(true);
  };

  const filteredItems = horarios.filter(item =>
    item.nomdoc && item.nomdoc.toLowerCase().includes(filterText.toLowerCase())
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
        title="Gestión de Horario Médico"
        columns={horarioColumns(setHorarios, handleEditHorario)}
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
          <Modal.Title>{editingHorario ? 'Editar Horario' : 'Agregar Nuevo Horario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Doctor</Form.Label>
              <Form.Select required value={coddoc} onChange={(e) => setCoddoc(e.target.value)}>
                <option value="">Seleccione un Doctor</option>
                {doctores.map(doc => (
                  <option key={doc.coddoc} value={doc.coddoc}>
                    {doc.nomdoc}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row mb-3">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Selecciona el día</Form.Label>
                  <Form.Select required value={selectedDia} onChange={(e) => setSelectedDia(e.target.value)}>
                    <option value="">Días</option>
                    {diasSemana
                      .filter(dia => !selectedDias.some(d => d.dia === dia))
                      .map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Hora Inicio AM</Form.Label>
                  <Form.Select required value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)}>
                    {horasDisponibles.map(({ horaAM }) => (
                      <option key={horaAM} value={horaAM}>{horaAM}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Hora Fin PM</Form.Label>
                  <Form.Select required value={horaFin} onChange={(e) => setHoraFin(e.target.value)}>
                    {horasDisponibles.map(({ horaPM }) => (
                      <option key={horaPM} value={horaPM}>{horaPM}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <Button variant="success" onClick={handleAddDia}>Agregar Día</Button>
            </div>
            {selectedDias.length > 0 && (
              <div className="mb-3">
                <Form.Label>Días Seleccionados:</Form.Label>
                <div>
                  {selectedDias.map(({ dia, hora_inicio, hora_fin }) => (
                    <Button
                      key={dia}
                      variant="primary"
                      size="sm"
                      className="me-2 mb-2"
                      onClick={() => handleRemoveDia(dia)}
                    >
                      {`${dia} (${hora_inicio} - ${hora_fin}) ×`}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Form.Label>Nota: Los horarios deben actualizarse por mes</Form.Label>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveHorario}>Guardar Horario</Button>
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

export default HorarioCitas;