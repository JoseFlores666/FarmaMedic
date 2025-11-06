import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import ThemeToggle from "../../util/theme-toggler";

const PerfilUsuario = () => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;

  const [user, setUser] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    correo: "",
    usuario: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    foto_perfil: "",
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/getPerfilbyid/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const iniciarCamara = async () => {
    try {
      setShowCamera(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara");
    }
  };

  const tomarFoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setFotoFile(blob);
      const imageUrl = URL.createObjectURL(blob);
      setUser({ ...user, foto_perfil: imageUrl });
    }, "image/png");

    detenerCamara();
    setShowCamera(false);
  };

  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setUser({ ...user, foto_perfil: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    for (const key in user) {
      if (key !== "foto_perfil" && user[key] && user[key] !== "") updatedFields[key] = user[key];
    }

    if (Object.keys(updatedFields).length > 0) {
      try {
        const resDatos = await fetch(`${import.meta.env.VITE_API_URL}/updatePerfilDatos/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        });

        await resDatos.json();
        if (!resDatos.ok) {
          Swal.fire("Error", "Error al actualizar datos", "error");
          return;
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Error de conexión al actualizar datos", "error");
        return;

      }
    }

    if (fotoFile) {
      const formData = new FormData();
      formData.append("foto", fotoFile);

      try {
        const resFoto = await fetch(`${import.meta.env.VITE_API_URL}/updatePerfilFoto/${userId}`, {
          method: "PUT",
          body: formData,
        });

        const data = await resFoto.json();
        if (resFoto.ok) {
          Swal.fire("Éxito", "Perfil actualizado correctamente", "success");
          setFotoFile(null);
          if (data.foto_perfil) setUser(prev => ({ ...prev, foto_perfil: data.foto_perfil }));
        } else {
          Swal.fire("Error", "Error al actualizar la foto", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Error de conexión al actualizar la foto", "error");
      }
    } else if (Object.keys(updatedFields).length > 0) {
      Swal.fire("Éxito", "Datos actualizados correctamente", "success");
    } else {
      Swal.fire("Información", "No hubo cambios para guardar", "info");
    }
  };

  return (
    <Container className="mb-5 mt-5">
      <Card
        className="mb-4"
        style={{
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          position: "relative" 
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 15,
            zIndex: 20,
            backgroundColor: "gray",  
            padding: "5px 8px",          
            borderRadius: "8px",         
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)" 
          }}
        >
          <ThemeToggle />
        </div>


        <Card.Body className="text-center">
          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#ddd",
            }}
          >
            <img
              src={user.foto_perfil || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            />
          </div>

          <div className="d-flex justify-content-center gap-3 mb-3">
            <Button variant="outline-primary" onClick={iniciarCamara}>Tomar foto</Button>
            <Form.Label htmlFor="fileInput" className="btn btn-outline-success mb-0">Subir imagen</Form.Label>
            <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>

          {showCamera && (
            <div className="mt-3">
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "400px", borderRadius: "10px", backgroundColor: "#000" }}></video>
              <div className="mt-2">
                <Button variant="success" className="me-2" onClick={tomarFoto}>Capturar</Button>
                <Button variant="danger" onClick={() => { detenerCamara(); setShowCamera(false); }}>Cancelar</Button>
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
          )}
        </Card.Body>
      </Card>

      <Card style={{ borderRadius: "15px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>Datos Personales</div>
        <Card.Body>
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
              <Button variant="primary" type="submit" style={{ borderRadius: "10px", padding: "10px 20px" }}>Guardar Cambios</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PerfilUsuario;
