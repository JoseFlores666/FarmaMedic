import { Form, Button, Col, Row, Carousel } from "react-bootstrap";
import { FaPaperPlane, FaQuoteRight, FaStar } from "react-icons/fa";
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
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userId = authData ? authData.id : null;

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
        const total = opinions.reduce((sum, opinion) => sum + opinion.rating, 0);
        return (total / opinions.length).toFixed(1); // Redondea a 1 decimal
    };

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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/createOpinion`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, rating, opinion })
            });

            if (response.ok) {
                getOpinions();
                Swal.fire('Éxito', 'Opinión enviada con éxito', 'success');
                setOpinion("");
                setRating(0);
                getOpinions(setOpinions)
            } else {
                const data = await response.json();
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
        <div className="mb-5">
            <div className="text-center">

                <h5 className="text-muted mb-2">Testimonios</h5>
                <h2 className="fw-bold mb-2">Comparte tu experiencia</h2>

            </div>
            <Row className="g-4">
                <Col md={8}>
                    <div className="card h-100 border shadow">
                        <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center border-bottom">
                                <h3 className="card-title text-primary fw-semibold">Opiniones de Clientes</h3>
                                <div className="d-flex align-items-center">
                                    <div className="d-flex align-items-center me-1">
                                        <FaStar className="text-warning" />
                                        <span className="fw-bold ms-2">{calculateAverageRating()}</span>
                                    </div>
                                    <span className="text-muted small">({opinions.length} opiniones)</span>
                                </div>
                            </div>

                            <div className="my-2 d-flex justify-content-center flex-wrap gap-2 w-100">
                                <Button variant="outline-primary" size="sm" onClick={showAllOpinions}>Todas</Button>
                                <Button variant="outline-success" size="sm" onClick={showGoodOpinions}>Mejores</Button>
                                <Button variant="outline-danger" size="sm" onClick={showBadOpinions}>Peores</Button>
                                <Button variant="outline-secondary" size="sm" onClick={showMyOpinions}>Mis Opiniones</Button>
                            </div>


                            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '450px' }}>
                                {filteredOpinions.length > 0 ? (
                                    <Carousel
                                        indicators={false}
                                        prevIcon={<span className="carousel-control-prev-icon bg-secondary rounded-circle" />}
                                        nextIcon={<span className="carousel-control-next-icon bg-secondary rounded-circle" />}
                                        className="testimonial-carousel w-100"
                                    >
                                        {filteredOpinions.map((testimonial, index) => (
                                            <Carousel.Item key={index}>
                                                <div className="card border-0 h-100">
                                                    <div className="card-body text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <div className="d-flex align-items-center" style={{ marginRight: '6rem' }}>
                                                                <div>
                                                                    <img style={{ width: '70px', height: '70px' }} src={testimonial.foto_perfil} alt="img" className="bg-secondary rounded-circle" />
                                                                </div>

                                                                <div className="ms-2 text-start">
                                                                    <h5 className="mb-1 fw-bold">{testimonial.usuario}</h5>
                                                                    <p className="text-muted small mb-0">
                                                                        Rol: {testimonial.rol_id === 1 ? 'Admin' : testimonial.rol_id === 2 ? 'Usuario' : testimonial.rol_id === 3 ? 'Doctor' : 'Desconocido'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <FaQuoteRight className="display-4 text-body-tertiary mb-0 opacity-20 ms-5" />
                                                        </div>

                                                        <div className="mt-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={i < testimonial.rating ? "text-warning" : "text-secondary"}
                                                                    size={30}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="fst-italic px-lg-5 mx-lg-5 px-md-3 mx-md-3 px-2 mx-2 text-center mt-3" style={{ fontSize: '1.4rem' }}>
                                                            “{testimonial.opinion}”
                                                        </p>

                                                        <p className="text-muted small mt-3">{new Date(testimonial.created_at).toLocaleDateString()}</p>
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
                                        style={{ resize: 'none' }}
                                        placeholder="Describe tu experiencia con detalles..."
                                        value={opinion}
                                        onChange={(e) => setOpinion(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <Button type="submit" variant="primary" className="w-100 mb-3">
                                    <FaPaperPlane className="me-2" />
                                    Enviar Opinión
                                </Button>
                            </Form>

                            <div className="border-top pt-3">
                                <h6 className="fw-semibold">Normas para Opiniones</h6>
                                <ul className="small ps-3" style={{ listStyle: 'square' }}>
                                    <li>Sé específico sobre tu experiencia</li>
                                    <li>Sé respetuoso con otros usuarios</li>
                                    <li>Enfócate en caracteristicas del sistema o servicio</li>
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
