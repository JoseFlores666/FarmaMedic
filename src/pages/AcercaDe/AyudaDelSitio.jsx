import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkedAlt, FaQuestionCircle, FaStar, FaGlobeAmericas } from "react-icons/fa";

const AyudaDelSitio = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-5 mb-5">
            <motion.h1
                className="text-center mb-4 fw-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Ayuda del Sitio
            </motion.h1>

            <div className="row">
                <div className="col-md-6">
                    <motion.div
                        className="card p-4 mb-4 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}

                    >
                        <h2 className="mb-3 text-primary">Requisitos Técnicos</h2>
                        <ul className="list-unstyled">
                            <li>Información sobre el sistema, el explorador y los complementos.</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="card p-4 mb-4 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}

                    >
                        <h2 className="mb-3 text-primary">Servicios de Suscripción</h2>
                        <ul className="list-unstyled">
                            <li>FarmaMedic.</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        className="card p-4 mb-4 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <h2 className="mb-3 text-primary">Para obtener más ayuda</h2>
                        <ul className="list-unstyled">
                            <motion.li
                                className="d-flex align-items-center gap-2 text-primary fw-semibold"
                                whileHover={{ scale: 1.05 }}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/Inicio/Ayuda/Mapa")}
                            >
                                <FaMapMarkedAlt />
                                Mapa del sitio
                            </motion.li>

                            <motion.li
                                className="d-flex align-items-center gap-2 text-primary fw-semibold mt-2"
                                whileHover={{ scale: 1.05 }}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/Inicio/Ayuda/Opiniones")}
                            >
                                <FaStar />
                                Puntúanos
                            </motion.li>
                            <motion.li
                                className="d-flex align-items-center gap-2 text-primary fw-semibold mt-2"
                                whileHover={{ scale: 1.05 }}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/Inicio/Ayuda/Preguntas")}
                            >
                                <FaQuestionCircle />
                                Preguntas Frecuentes
                            </motion.li>
                            <motion.li
                                className="d-flex align-items-center gap-2 text-primary fw-semibold mt-2"
                                whileHover={{ scale: 1.05 }}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/Inicio/Ayuda/Conocenos")}
                            >
                                <FaGlobeAmericas />
                                Conocenos
                            </motion.li>
                        </ul>
                    </motion.div>
                </div>

                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <motion.img
                        src="https://cdn-icons-png.freepik.com/512/4403/4403531.png"
                        alt="Ayuda"
                        className="img-fluid"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AyudaDelSitio;
