import { useEffect, useState } from 'react';
import { FaCheck, FaEdit, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col, Container } from 'react-bootstrap';
const MySwal = withReactContent(Swal);

const PerfilEmpresa = () => {
  const [nombre, setNombre] = useState('');
  const [nosotros, setNosotros] = useState('');
  const [valores, setValores] = useState('');
  const [servicios, setServicios] = useState('');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [eslogan, setEslogan] = useState('');

  const [editField, setEditField] = useState(null);

  const handleEdit = (field) => {
    setEditField(field);
  };
  
  const handleCancel = () => {
    setEditField(null);
  };

  const apiUrl = 'https://back-farmam.onrender.com/api/';
  const getEmpresa = async () => {
    try {
      const response = await fetch(`${apiUrl}getEmpresa`);
      if (!response.ok) throw new Error('Error al obtener los datos de la empresa');
      const data = await response.json();

      if (data.length > 0) {
        const empresaData = data[0];
        setNombre(empresaData.nombre || '');
        setNosotros(empresaData.nosotros || '');
        setValores(empresaData.valores || '');
        setServicios(empresaData.servicios || '');
        setMision(empresaData.mision || '');
        setVision(empresaData.vision || '');
        setEslogan(empresaData.eslogan || '')
      }

    } catch (error) {
      console.error('Error al obtener los datos de la empresa:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;
    const updatedEmpresa = {
      nombre,
      nosotros,
      valores,
      servicios,
      mision,
      vision,
      eslogan,
      id_usuario:userId
    };

    const response = await fetch(`https://back-farmam.onrender.com/api/updateEmpresa/${1}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmpresa),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta del servidor:', errorText);
      MySwal.fire("Error", "No se pudo actualizar los datos", "error");
    } else {
      const data = await response.json();
      if (data.success) {
        MySwal.fire("Éxito", "Los datos de la empresa fueron actualizados correctamente", "success");
        getEmpresa();
      } else {
        MySwal.fire("Error", "No se pudo actualizar los datos", "error");
      }
    }

  };

  useEffect(() => {
    getEmpresa();
  }, []);

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <Container className="mt-5 mb-5">
      <h1 className="text-center mb-4">Gestión de Empresa</h1>
      <div className="card p-4 shadow-lg">
        <Row>
          <Col>
            <label className="form-label fw-bold">Nombre de la Empresa</label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={editField !== "nombre"}
                className="form-control"
              />
              {editField !== "nombre" ? (
                <button className="btn btn-outline-primary ms-2" onClick={() => handleEdit("nombre")}>
                  <FaEdit />
                </button>
              ) : (
                <>
                  <button className="btn btn-success ms-2" onClick={handleSubmit}>
                    <FaCheck />
                  </button>
                  <button className="btn btn-danger ms-2" onClick={handleCancel}>
                    <FaTimes />
                  </button>
                </>
              )}
            </div>
          </Col>
          <Col>
            <label className="form-label fw-bold">Eslogan de la Empresa</label>
            <div className="d-flex align-items-center">
              <input
                type="text"
                value={eslogan}
                onChange={(e) => setEslogan(e.target.value)}
                disabled={editField !== "eslogan"}
                className="form-control"
              />
              {editField !== "eslogan" ? (
                <button className="btn btn-outline-primary ms-2" onClick={() => handleEdit("eslogan")}>
                  <FaEdit />
                </button>
              ) : (
                <>
                  <button className="btn btn-success ms-2" onClick={handleSubmit}>
                    <FaCheck />
                  </button>
                  <button className="btn btn-danger ms-2" onClick={handleCancel}>
                    <FaTimes />
                  </button>
                </>
              )}
            </div>
          </Col>
        </Row>

        <label className="form-label fw-bold mt-3">Nosotros</label>
        <textarea
          value={nosotros}
          onChange={(e) => setNosotros(e.target.value)}
          onInput={autoResize}
          disabled={editField !== "nosotros"}
          className="form-control"
          rows="3"
          style={{ overflow: "hidden", resize: "none", minHeight: "100px" }}
        />
        <div className="d-flex justify-content-center mt-3">

          {editField !== "nosotros" ? (
            <button className="btn btn-outline-primary " onClick={() => handleEdit("nosotros")}>
              <FaEdit /> Editar
            </button>
          ) : (
            <>
              <button className="btn btn-success me-2" onClick={handleSubmit}>
                <FaCheck /> Actualizar
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>
                <FaTimes /> Cancelar
              </button>
            </>

          )}
        </div>
        <Row className="mt-3">
          <Col>
            <label className="form-label fw-bold">Misión</label>
            <textarea
              value={mision}
              onChange={(e) => setMision(e.target.value)}
              onInput={autoResize}
              disabled={editField !== "mision"}
              className="form-control"
              rows="4"
              style={{ overflow: "hidden", resize: "none", minHeight: "120px" }}
            />
            <div className="d-flex justify-content-center mt-3">
              {editField !== "mision" ? (
                <button className="btn btn-outline-primary" onClick={() => handleEdit("mision")}>
                  <FaEdit /> Editar
                </button>
              ) : (
                <>
                  <button className="btn btn-success me-2" onClick={handleSubmit}>
                    <FaCheck /> Actualizar
                  </button>
                  <button className="btn btn-danger" onClick={handleCancel}>
                    <FaTimes /> Cancelar
                  </button>
                </>
              )}
            </div>
          </Col>

          <Col>
            <label className="form-label fw-bold">Visión</label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              onInput={autoResize}
              disabled={editField !== "vision"}
              className="form-control"
              rows="4"
              style={{ overflow: "hidden", resize: "none", minHeight: "120px" }}
            />
            <div className="d-flex justify-content-center mt-3">
              {editField !== "vision" ? (
                <button className="btn btn-outline-primary" onClick={() => handleEdit("vision")}>
                  <FaEdit /> Editar
                </button>
              ) : (
                <>
                  <button className="btn btn-success me-2" onClick={handleSubmit}>
                    <FaCheck /> Actualizar
                  </button>
                  <button className="btn btn-danger" onClick={handleCancel}>
                    <FaTimes /> Cancelar
                  </button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default PerfilEmpresa;
