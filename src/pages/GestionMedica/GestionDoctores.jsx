import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { FaDollarSign, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { Button, Form, Row, Col, ModalHeader, ModalTitle, ModalBody, ModalFooter } from 'react-bootstrap';
import CustomDataTable from '../../components/Tables/CustomDataTable';
import FilterComponent from '../../components/FilterComponent';

const fetchDoctores = async (setServices) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los doctores');
    }

    const data = await response.json();
    setServices(data.length > 0 ? data : []);
  } catch (error) {
    console.error('Error al obtener los doctores:', error);
    Swal.fire('Error', 'No se pudo obtener los doctores', 'error');
  }
};

const createDoctor = async (doctorData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/createDoc`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el doctor');
    }

    Swal.fire('Éxito', 'Doctor agregado correctamente', 'success');
    return true;

  } catch (error) {
    console.error('Error al crear el doctor:', error);
    Swal.fire('Error', 'No se pudo agregar el doctor', 'error');
  }
};

const updateDoctor = async (id, doctorData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/updateDoc/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Swal.fire('Error', `No se pudo agregar el doctor: ${errorData.message}`, 'error');
    }
    Swal.fire('Éxito', 'Doctor actualizado correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al actualizar el doctor:', error);
    Swal.fire('Error', 'No se pudo actualizar el doctor', 'error');
  }
};

const initialDoctorState = {
  nomdoc: '',
  apepaternodoc: '',
  apematernodoc: '',
  edad: '',
  genero: '',
  correo: '',
  telefo: '',
  especialidad: '',
  foto_doc: '',
  password: ''
};

const GestionDoctores = () => {
  const [services, setServices] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalCostos, setModalCostos] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    nomdoc: '',
    apepaternodoc: '',
    apematernodoc: '',
    edad: '',
    genero: '',
    correo: '',
    telefo: '',
    especialidad: '',
    foto_doc: '',
    password: '',
    vista_previa: null,
    precio_base: '',
    descuento: ''
  });
  const [selectedField, setSelectedField] = useState('doctor');

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getDoc`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al obtener los doctores');

        const data = await response.json();
        setServices(data.length > 0 ? data : []);
      } catch (error) {
        console.error('Error al obtener los doctores:', error);
        Swal.fire('Error', 'No se pudo obtener los doctores', 'error');
      }
    };

    fetchDoctores();

    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getEspecialidades`);
        const data = await response.json();
        setEspecialidades(data);

      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      }
    };

    fetchEspecialidades();
  }, []);


  const filteredItems = (services || []).filter(item => {
    const filter = filterText.toLowerCase();
    let fieldValue = '';

    switch (selectedField) {
      case 'doctor':
        fieldValue = item.nombreCompleto?.toLowerCase() || '';
        break;
      case 'especialidad':
        fieldValue = item.especialidad?.toLowerCase() || '';
        break;
      case 'fecha':
        fieldValue = item.fecha_create || '';
        break;
      case 'correo':
        fieldValue = item.correo.toLowerCase() || '';
        break;
      default:
        return true;
    }

    return fieldValue.includes(filter);
  });


  const serviceColumns = [
    { name: '#', selector: row => row.coddoc, sortable: true, width: "53px" },
    { name: 'Doctor', selector: row => row.nomdoc, sortable: true, wrap: true },
    { name: 'Apellido Paterno', selector: row => row.apepaternodoc, sortable: true, wrap: true },
    { name: 'Apellido Materno', selector: row => row.apematernodoc, sortable: true, wrap: true },
    { name: 'Edad', selector: row => row.edad, sortable: true, wrap: true, width: "80px" },
    { name: 'Genero', selector: row => row.genero, sortable: true, wrap: true },
    { name: 'Correo', selector: row => row.correo, sortable: true, wrap: true },
    { name: 'Telefono', selector: row => row.telefo, sortable: true, wrap: true },
    { name: 'Especialidad', selector: row => row.especialidad, sortable: true, wrap: true },
    { name: 'Contraseña', selector: row => row.password, sortable: true, wrap: true },
    {
      name: 'Foto perfil',
      selector: row => (
        <img
          src={row.foto_doc}
          alt="Foto perfil"
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
        />
      ),
      sortable: false,
      wrap: true,
    },
    { name: 'Creado', selector: row => row.fecha_create, sortable: true, wrap: true, format: row => new Date(row.fecha_create).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
    {
      name: 'Acción',
      cell: row => (
        <div>
          <FaTrash
            color='red'
            title='Eliminar'
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => eliminarDoctor(row.coddoc)}
          />
          <FaEdit
            color='blue'
            title='Editar'
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => handleEditDoctor(row)}
          />
          <FaDollarSign
            color='blue'
            title='Editar'
            style={{ cursor: 'pointer', marginRight: 10 }}
            onClick={() => handleNewCostos(row)}
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const eliminarDoctor = async (id) => {
    if (!id) {
      console.error("Error: ID no válido");
      Swal.fire("Error", "ID no válido", "error");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/deleteDoc/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error("Error al eliminar el doctor");
          }

          const data = await response.json();
          Swal.fire("¡Eliminado!", data.message, "success");
          fetchDoctores(setServices);
        } catch (error) {
          console.error("Error al eliminar el doctor:", error);
          Swal.fire("Error", "No se pudo eliminar el doctor", "error");
        }
      }
    });
  };

  const handleAddDoctor = () => {
    setCurrentDoctor(null);
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setCurrentDoctor(doctor);
    let especialidadCode = doctor.codespe || doctor.especialidad;
    if (!especialidades.some(e => e.codespe === especialidadCode)) {
      const match = especialidades.find(e => e.titulo === doctor.titulo);
      especialidadCode = match ? match.codespe : '';
    }
    setNewDoctor({
      nomdoc: doctor.nomdoc,
      apepaternodoc: doctor.apepaternodoc,
      apematernodoc: doctor.apematernodoc,
      edad: doctor.edad,
      genero: doctor.genero,
      correo: doctor.correo,
      telefo: doctor.telefo,
      foto_doc: doctor.foto_doc,
      password: doctor.password,
      especialidad: especialidadCode,
      precio_base: doctor.precio_base,
      descuento: doctor.descuento,
    });
    setShowModal(true);
  };

  const handleNewCostos = (doctor) => {
    setCurrentDoctor(doctor);
    setNewDoctor({
      precio_base: doctor.precio_base,
      descuento: doctor.descuento,
    });
    setModalCostos(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setModalCostos(false);
    setNewDoctor(initialDoctorState);
  }
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
        onShowModal={handleAddDoctor}
        buttonText={'Añadir Doctor'}
        filterText={filterText}
        selectedField={selectedField}
        onFieldChange={handleFieldChange}
        fieldsToShow={['doctor', 'correo', 'especialidad', 'fecha']}
      />
    );
  }, [filterText, resetPaginationToggle, selectedField]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'perfil') {
      const file = files[0];
      if (file) {
        setNewDoctor((prev) => ({
          ...prev,
          foto_doc: file.name,
          vista_previa: URL.createObjectURL(file),
        }));
      }
    } else {
      setNewDoctor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async () => {
    if (currentDoctor) {
      const updated = await updateDoctor(currentDoctor.coddoc, newDoctor);

      if (updated) {
        await fetchDoctores(setServices);
      }
    } else {
      const created = await createDoctor(newDoctor);
      if (created) {
        await fetchDoctores(setServices);
      }
    }
    handleClose();
  };

  const guardarCostosDoctor = async (doctor_id, precio_base, descuento) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upsertCostosDoctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id,
          precio_base: parseFloat(precio_base),
          descuento: parseFloat(descuento),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Error al guardar costos:", data.message);
        return false;
      }

      console.log("Costos guardados correctamente");
      return true;
    } catch (error) {
      console.error("Error en guardarCostosDoctor:", error);
      return false;
    }
  };

  const handleSubmitCostos = async () => {
    const base = parseFloat(newDoctor.precio_base);
    const desc = parseFloat(newDoctor.descuento);

    if (isNaN(base) || isNaN(desc)) {
      return Swal.fire('Error', 'Debe ingresar valores numéricos válidos para costo y descuento', 'error');
    }
    if (currentDoctor) {
      const guardado = await guardarCostosDoctor(
        currentDoctor.coddoc,
        base,
        desc
      );

      if (guardado) {
        await fetchDoctores(setServices);
        Swal.fire('Éxito', 'Costos actualizados correctamente', 'success');
        handleClose();
      } else {
        Swal.fire('Error', 'No se pudieron guardar los costos', 'error');
      }
    }
  };

  return (
    <div className=''>
      <CustomDataTable
        title="Gestión de Doctores"
        columns={serviceColumns}
        data={filteredItems}
        subHeaderComponent={subHeaderComponentMemo}
      />

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentDoctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="nomdoc"
                    value={newDoctor.nomdoc}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="apepaternodoc"
                    value={newDoctor.apepaternodoc}
                    onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="apematernodoc"
                    value={newDoctor.apematernodoc}
                    onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Edad</Form.Label>
                  <Form.Control required type="number" name="edad" value={newDoctor.edad} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Genero</Form.Label>
                  <Form.Control
                    as="select"
                    required
                    name="genero"
                    value={newDoctor.genero}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona tu genero</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control required type="text" name="telefo" value={newDoctor.telefo} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control required type="email" name="correo" value={newDoctor.correo} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control
                    as="select"
                    required
                    name="especialidad"
                    value={newDoctor.especialidad || ''}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona tu especialidad</option>
                    {especialidades.length > 0 ? (
                      especialidades.map((especialidad) => (
                        <option key={especialidad.codespe} value={especialidad.codespe}>
                          {especialidad.titulo}
                        </option>
                      ))
                    ) : (
                      <option value="">Cargando especialidades...</option>
                    )}
                  </Form.Control>
                </Form.Group>

              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control required type="password" name="password" value={newDoctor.password} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Foto de Perfil</Form.Label>
                  <Form.Control
                    type="file"
                    name="perfil"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {newDoctor.vista_previa || newDoctor.foto_doc ? (
                    <img
                      src={newDoctor.foto_doc || `/ruta/del/servidor/${newDoctor.foto_doc}`}
                      alt="Previsualización"
                      className="mt-2"
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  ) : null}
                </Form.Group>
              </Col>


            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {currentDoctor ? 'Actualizar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalCostos} onHide={handleClose} centered>
        <ModalHeader closeButton>
          <ModalTitle>
            Editar Precios de la Consulta
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Costo</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="precio_base"
                    value={newDoctor.precio_base}
                    step="0.01"
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Descuento</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    name="descuento"
                    value={newDoctor.descuento}
                    onChange={handleChange}
                    step="0.01"
                    min={0}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSubmitCostos}>
            {currentDoctor ? 'Actualizar' : 'Crear'}
          </Button>

        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GestionDoctores;