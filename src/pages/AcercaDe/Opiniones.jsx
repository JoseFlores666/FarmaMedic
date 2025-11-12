import { Form, Button, Col, Row, Carousel } from "react-bootstrap";
import {
  FaPaperPlane,
  FaQuoteRight,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Opiniones = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [opinion, setOpinion] = useState("");
  const [opinions, setOpinions] = useState([]);
  const [filteredOpinions, setFilteredOpinions] = useState([]);
  const [myOpinionId, setMyOpinionId] = useState(null); // Para actualizar opinión

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;
  const rolId = authData ? authData.rol_id : null;
  const nombreUsuario = authData ? authData.nombre : null;

  const getOpinions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getOpinions`);
      if (!response.ok) throw new Error("Error al obtener opiniones");
      const data = await response.json();
      setOpinions(data);
      setFilteredOpinions(data);
    } catch (error) {
      console.error("Error al obtener opiniones:", error);
    }
  };

  useEffect(() => {
    getOpinions();
  }, []);

  const calculateAverageRating = () => {
    if (opinions.length === 0) return 0;
    const total = opinions.reduce((sum, op) => sum + op.rating, 0);
    return (total / opinions.length).toFixed(1);
  };

  // Cargar opinión propia para actualizar
  const handleLoadMyOpinion = () => {
    if (!userId) {
      Swal.fire("Inicia sesión", "Debes iniciar sesión para actualizar tu opinión.", "info");
      return;
    }

    const myOpinion = opinions.find(op => op.user_id === userId);
    if (!myOpinion) {
      Swal.fire("No tienes opinión", "Primero debes crear una opinión para poder actualizarla.", "info");
      return;
    }

    setOpinion(myOpinion.opinion);
    setRating(myOpinion.rating);
    setMyOpinionId(myOpinion.id); // Guardamos el id para actualizar
    Swal.fire("Listo", "Tu opinión ha sido cargada para actualizar.", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      const result = await Swal.fire({
        title: "No tienes una sesión activa",
        text: "Inicia sesión para poder opinar",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) navigate("/Acceder");
      return;
    }

    try {
      const url = myOpinionId
        ? `${import.meta.env.VITE_API_URL}/updateOpinion/${myOpinionId}`
        : `${import.meta.env.VITE_API_URL}/createOpinion`;
      const method = myOpinionId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          rating,
          opinion,
          rol_id: rolId,
          nombre: nombreUsuario,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire(
          "Éxito",
          myOpinionId ? "Opinión actualizada con éxito" : "Opinión enviada con éxito",
          "success"
        );
        setOpinion("");
        setRating(0);
        setMyOpinionId(null);
        getOpinions();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error al enviar la opinión:", error);
    }
  };

  const handleReaction = async (id, reaction) => {
    if (!userId) {
      Swal.fire("Inicia sesión", "Debes iniciar sesión para reaccionar.", "info");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/updateReaction/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, tipo: reaction }),
        }
      );

      const data = await response.json();
      if (data.success) {
        getOpinions();
      } else {
        Swal.fire("Error", data.message || "No se pudo actualizar la reacción.", "error");
      }
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
  };

  const showAllOpinions = () => setFilteredOpinions(opinions);
  const showGoodOpinions = () => setFilteredOpinions(opinions.filter(op => op.rating >= 4));
  const showBadOpinions = () => setFilteredOpinions(opinions.filter(op => op.rating <= 2));
  const showMyOpinions = () => setFilteredOpinions(opinions.filter(op => op.user_id === userId));

  return (
    <div className="mb-5">
      <div className="text-center mb-4">
        <h5 className="text-muted mb-1">Testimonios</h5>
        <h2 className="fw-bold">Comparte tu experiencia</h2>
        <div
          style={{
            height: "3px",
            width: "160px",
            margin: "10px auto 20px",
            backgroundColor: "#0d6efd",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      <Row className="g-4">
        <Col md={8}>
          <div className="card h-100 border shadow">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center border-bottom">
                <h3 className="card-title text-primary fw-semibold">
                  Opiniones de Clientes
                </h3>
                <div className="d-flex align-items-center">
                  <FaStar className="text-warning" />
                  <span className="fw-bold ms-2">{calculateAverageRating()}</span>
                  <span className="text-muted small ms-2">
                    ({opinions.length} opiniones)
                  </span>
                </div>
              </div>

              <div className="my-2 d-flex justify-content-center flex-wrap gap-2 w-100">
                <Button variant="outline-primary" size="sm" onClick={showAllOpinions}>
                  Todas
                </Button>
                <Button variant="outline-success" size="sm" onClick={showGoodOpinions}>
                  Mejores
                </Button>
                <Button variant="outline-danger" size="sm" onClick={showBadOpinions}>
                  Peores
                </Button>
                {userId && (
                  <Button variant="outline-secondary" size="sm" onClick={showMyOpinions}>
                    Mis Opiniones
                  </Button>
                )}
              </div>

              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "450px" }}
              >
                {filteredOpinions.length > 0 ? (
                  <Carousel
                    indicators={false}
                    prevIcon={
                      <span className="carousel-control-prev-icon bg-secondary rounded-circle" />
                    }
                    nextIcon={
                      <span className="carousel-control-next-icon bg-secondary rounded-circle" />
                    }
                    className="testimonial-carousel w-100"
                  >
                    {filteredOpinions.map((testimonial, index) => (
                      <Carousel.Item key={index}>
                        <div className="card border-0 h-100">
                          <div className="card-body text-center">
                            <div className="d-flex align-items-center justify-content-center">
                              <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "6rem" }}
                              >
                                <div>
                                  <img
                                    style={{ width: "70px", height: "70px" }}
                                    src={
                                      testimonial.foto_perfil ||
                                      "/assets/default-profile.png"
                                    }
                                    alt="img"
                                    className="bg-secondary rounded-circle"
                                  />
                                </div>
                                <div className="ms-2 text-start">
                                  <h5 className="mb-1 fw-bold">
                                    {testimonial.nombre || testimonial.usuario}
                                  </h5>
                                  <p className="text-muted small mb-0">
                                    Rol:{" "}
                                    {testimonial.rol_id === 1
                                      ? "Administrador"
                                      : testimonial.rol_id === 2
                                      ? "Paciente"
                                      : testimonial.rol_id === 3
                                      ? "Doctor"
                                      : "Desconocido"}
                                  </p>
                                </div>
                              </div>

                              <FaQuoteRight className="display-4 text-body-tertiary mb-0 opacity-20 ms-5" />
                            </div>

                            <div className="mt-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={
                                    i < testimonial.rating
                                      ? "text-warning"
                                      : "text-secondary"
                                  }
                                  size={30}
                                />
                              ))}
                            </div>

                            <p
                              className="fst-italic px-5 mx-3 text-center mt-3"
                              style={{ fontSize: "1.6rem" }}
                            >
                              “{testimonial.opinion}”
                            </p>

                            <div className="d-flex justify-content-center align-items-center gap-4 mt-3">
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleReaction(testimonial.id, "like")}
                              >
                                <FaThumbsUp /> {testimonial.megusta || 0}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleReaction(testimonial.id, "dislike")}
                              >
                                <FaThumbsDown /> {testimonial.nomegusta || 0}
                              </Button>
                            </div>

                            <p className="text-muted small mt-3">
                              {new Date(testimonial.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <p className="text-muted">No hay opiniones disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="card border shadow">
            <div className="card-body p-4">
              <h5 className="mb-4 fw-semibold text-primary">Comparte tu Opinión</h5>

              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium">Calificación</label>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar
                        key={idx}
                        size={20}
                        className="me-2 cursor-pointer"
                        color={idx < (hover || rating) ? "#f7b500" : "#e4e4e4"}
                        onClick={() => setRating(idx + 1)}
                        onMouseEnter={() => setHover(idx + 1)}
                        onMouseLeave={() => setHover(0)}
                      />
                    ))}
                    <span className="ms-2 small text-muted">(Click para calificar)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Tu Opinión</label>
                  <textarea
                    className="form-control"
                    rows="6"
                    style={{ resize: "none" }}
                    placeholder="Describe tu experiencia..."
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                    required
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" className="w-100 mb-3">
                  <FaPaperPlane className="me-2" />
                  {myOpinionId ? "Actualizar Opinión" : "Enviar Opinión"}
                </Button>

                {/* Botón para cargar la opinión existente */}
                {!myOpinionId && userId && (
                  <Button
                    variant="warning"
                    className="w-100 mb-3"
                    onClick={handleLoadMyOpinion}
                  >
                    Cargar mi Opinión
                  </Button>
                )}
              </Form>

              <div className="border-top pt-3">
                <h6 className="fw-semibold">Normas para Opiniones</h6>
                <ul className="small ps-3" style={{ listStyle: "square" }}>
                  <li>Sé específico sobre tu experiencia</li>
                  <li>Sé respetuoso con otros usuarios</li>
                  <li>Enfócate en el servicio o la atención recibida</li>
                </ul>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Opiniones;
