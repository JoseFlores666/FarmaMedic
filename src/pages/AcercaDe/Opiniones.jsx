import { Form, Button, Col, Row, Container, Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Opiniones = () => {
    const API_URL = "https://localhost:4000/api/";
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [opinion, setOpinion] = useState("");
    const [opinions, setOpinions] = useState([]);
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;
    const [filteredOpinions, setFilteredOpinions] = useState([]);

    const handleReaction = async (reactionType, opinionId) => {
        try {
            const response = await fetch(`https://localhost:4000/api/updateReaction/${opinionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reaction: reactionType }),
            });

            const data = await response.json();
            if (data.success) {
                setOpinions(data)
                Swal.fire("Éxito", `Has dado ${reactionType === "like" ? "Me gusta" : "No me gusta"}`, "success");
            } else {
                Swal.fire("Error", "No se pudo registrar la reacción", "error");
            }
        } catch (error) {
            console.error("Error al actualizar reacción:", error);
        }
    };

    const getOpinions = async () => {
        try {
            const response = await fetch(`${API_URL}/getOpinions`);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            const result = await Swal.fire({
                title: 'No tienes una sesión activa',
                text: 'Inicia sesión para poder opinar',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Iniciar sesión',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                navigate('/Acceder');
            }

            return;
        }
        try {
            const response = await fetch("https://localhost:4000/api/createOpinion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, rating, opinion })
            });

            const data = await response.json();
            if (response.ok) {
                getOpinions(setOpinions)
                Swal.fire('Éxito', 'Opinion enviada con éxito', 'success');
                setOpinion("");
                setRating(0);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error al enviar la opinión:", error);
        }
    };

    const showAllOpinions = () => setFilteredOpinions(opinions);
    const showGoodOpinions = () => setFilteredOpinions(opinions.filter(op => op.rating >= 4));
    const showBadOpinions = () => setFilteredOpinions(opinions.filter(op => op.rating <= 2));
    const showMyOpinions = () => setFilteredOpinions(opinions.filter(op => op.user_id == userId));

    return (
        <Container className="mt-5 ">
            <h2 className="text-center mb-4">Opinión sobre la página FarmaMedic</h2>
            <Row>
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Califica tu experiencia:</Form.Label>
                            <div className="d-flex justify-content-center mb-3">
                                {[...Array(5)].map((_, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                        <label key={i} className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="rating"
                                                className="d-none"
                                                value={ratingValue}
                                                onClick={() => setRating(ratingValue)}
                                            />
                                            <FaStar
                                                className={`transition-colors ${ratingValue <= (hover || rating) ? "text-warning" : "text-muted"
                                                    }`}
                                                size={30}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Escribe tu opinión:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={8}
                                placeholder="Escribe tu opinión aquí..."
                                value={opinion}
                                onChange={(e) => setOpinion(e.target.value)}
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-4">
                            Enviar Opinión
                        </Button>
                    </Form>
                </Col>

                <Col md={6} className="d-flex justify-content-center align-items-center">
                    <img
                        src="https://media.istockphoto.com/id/1387057507/es/vector/peque%C3%B1os-m%C3%A9dicos-y-pacientes-cerca-del-hospital-ilustraci%C3%B3n-vectorial-plana.jpg?s=612x612&w=0&k=20&c=MPPZNvODOcflaMRbKRG8nnBck2aGTXLBqkp_7RpL2b8="
                        alt="Clínica"
                        className="img-fluid rounded shadow"
                    />
                </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-4 mb-4 flex-wrap">
  <Button
    variant="info"
    onClick={showAllOpinions}
    className="shadow-lg rounded-pill px-4 py-2 text-white fw-bold"
  >
    Todas
  </Button>
  <Button
    variant="success"
    onClick={showGoodOpinions}
    className="shadow-lg rounded-pill px-4 py-2 text-white fw-bold"
  >
    Buenas Opiniones
  </Button>
  <Button
    variant="danger"
    onClick={showBadOpinions}
    className="shadow-lg rounded-pill px-4 py-2 text-white fw-bold"
  >
    Malas Opiniones
  </Button>
  <Button
    variant="secondary"
    onClick={showMyOpinions}
    className="shadow-lg rounded-pill px-4 py-2 text-white fw-bold"
  >
    Mis Opiniones
  </Button>
</div>


            <Container className="mt-5 mb-5">
                <h3 className="text-center">Opiniones de nuestros clientes</h3>
                <Row className="justify-content-center mt-5">
                    {filteredOpinions.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {filteredOpinions.map((opinion, i) => (
                                <Col key={opinion.id} xs={12} md={6} lg={4} className="rounded mt-3">
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.6, delay: i * 0.2 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Card
                                            className="text-center mt-4 p-3 shadow-lg"
                                            style={{
                                                border: "6px solid #d3b79a",
                                                backgroundColor: "#2c245b",
                                                height: "250px",
                                            }}
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={opinion.foto_perfil}
                                                className="rounded-circle mx-auto"
                                                style={{
                                                    width: "90px",
                                                    height: "90px",
                                                    objectFit: "cover",
                                                    border: "6px solid #d3b79a",
                                                    marginTop: "-60px",
                                                    zIndex: "1",
                                                }}
                                            />
                                            <h5 className="text-white fs-3">{opinion.usuario_nombre}</h5>
                                            <div className="d-flex justify-content-center mt-2">
                                                {[...Array(opinion.rating || 5)].map((_, j) => (
                                                    <FaStar key={j} style={{ color: "#f39c12", margin: "0 2px" }} />
                                                ))}
                                            </div>
                                            <Card.Body>
                                                <Card.Text className="text-white">{opinion.opinion}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <p className="text-center text-muted">No hay opiniones disponibles.</p>
                    )}
                </Row>
            </Container>;



        </Container>
    );
};

export default Opiniones;
