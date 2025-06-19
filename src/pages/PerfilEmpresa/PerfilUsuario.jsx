import { Card, Form, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import ThemeToggle from "../../util/theme-toggler";

const PerfilUsuario = () => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;

  const [user, setUser] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    correo: "",
    password: "",
    usuario: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    foto_perfil: "",
  });

  const [selectedSection, setSelectedSection] = useState("personal");

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`https://back-farmam.onrender.com/api/getPerfilbyid/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser({ ...user, foto_perfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};

    // Solo incluir los campos que no estén vacíos
    for (const key in user) {
      if (user[key] && user[key] !== "") {
        updatedFields[key] = user[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return alert("No se realizaron cambios para guardar.");
    }

    try {
      const response = await fetch(`https://back-farmam.onrender.com/api/updateperfilbyid/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      await response.json();
      if (response.ok) {
        alert("Datos actualizados correctamente");
      } else {
        alert("Error al actualizar los datos");
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
      alert("Error de conexión.");
    }
  };


  return (
    <Container className="mb-5 ">
      <Card className="mb-4" style={{ width: "auto", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "15px" }}>
        <Card.Body>
          <ThemeToggle />
          <div
            className="text-center mb-4"
            style={{
              backgroundColor: 'red',
              width: '150px',
              height: '150px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              margin: '0 auto'
            }}
          >
            <label htmlFor="avatarInput" className="d-block">
              <img
                src={user.foto_perfil || "Cargando..."}
                alt="Avatar"
                className="rounded-circle"
                width={120}
                height={120}
                style={{ cursor: "pointer" }}
              />
            </label>
            <input type="file" id="avatarInput" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>
          <h3 className="text-center mb-4">{user.nombre}</h3>

          <Row className="mb-4">
            <Col>
              <div className="text-center p-3 rounded border">
                <strong>Sección de Datos Personales</strong>
              </div>
            </Col>
            <Col>
              <div className="text-center p-3 rounded border">
                <strong>Sección de Seguridad</strong>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card style={{ width: "auto", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "15px" }}>
        <ListGroup horizontal className="mb-4">
          <ListGroup.Item
            action
            active={selectedSection === "personal"}
            onClick={() => setSelectedSection("personal")}
          >
            Datos Personales
          </ListGroup.Item>
          <ListGroup.Item
            action
            active={selectedSection === "password"}
            onClick={() => setSelectedSection("password")}
          >
            Seguridad
          </ListGroup.Item>
        </ListGroup>
        <Card.Body>
          {selectedSection === "personal" && (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" name="nombre" value={user.nombre} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" name="usuario" value={user.usuario} onChange={handleChange} />
                  </Form.Group>

                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido Paterno</Form.Label>
                    <Form.Control type="text" name="apellidoPaterno" value={user.apellidoPaterno} onChange={handleChange} />
                  </Form.Group>

                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido Materno</Form.Label>
                    <Form.Control type="text" name="apellidoMaterno" value={user.apellidoMaterno} onChange={handleChange} />
                  </Form.Group>

                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="correo" value={user.correo} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control type="text" name="telefono" value={user.telefono} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Edad</Form.Label>
                    <Form.Control type="text" name="edad" value={user.edad} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Género</Form.Label>
                    <Form.Control type="text" name="genero" value={user.genero} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <Button variant="primary" type="submit" style={{ borderRadius: "10px", padding: "10px 20px" }}>
                  Guardar Cambios
                </Button>
              </div>
            </Form>
          )}

          {selectedSection === "password" && (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña Nueva</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={user.password || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <Button variant="primary" type="submit" style={{ borderRadius: "10px", padding: "10px 20px" }}>
                  Cambiar Contraseña
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PerfilUsuario;
