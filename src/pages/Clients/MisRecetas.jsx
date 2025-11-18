import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Badge, Spinner, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUserMd, FaCalendarAlt, FaPills, FaFilePdf } from "react-icons/fa";
import dayjs from "dayjs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RecetaPDF from "../GestionMedica/RecetaPDF";
import { getLogoActivo } from '../../Api/apiLogoActivo';

const MisRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const authData = JSON.parse(localStorage.getItem("authData") || "{}");
  const userId = authData?.id || null;
  const [logoActivo, setLogoActivo] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = await getLogoActivo();
        setLogoActivo(url);
      } catch (err) {
        console.error("Error obteniendo logo:", err);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/getMisRecetas/${userId}`)
      .then((res) => {
        setRecetas(res.data || []);
      })
      .catch((err) => {
        console.error("Error obteniendo recetas:", err);
        setRecetas([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (!recetas || recetas.length === 0)
    return (
      <Container className="mt-4 text-center">
        <h4>No tienes recetas registradas.</h4>
      </Container>
    );

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Mis Recetas Médicas</h2>

      <Row>
        {recetas.map((receta) => (
          <Col md={6} key={receta.id} className="mb-3">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center gap-2">
                    <FaUserMd size={22} />
                    <span>{receta.doctor || "Doctor desconocido"}</span>
                  </Card.Title>

                  <Card.Subtitle className="mb-2 text-muted">
                    Paciente: {receta.paciente || "N/A"}
                  </Card.Subtitle>

                  <div className="mt-2">
                    <FaCalendarAlt /> <strong>Inicio:</strong>{" "}
                    {receta.fecha_inicio
                      ? dayjs(receta.fecha_inicio).format("DD/MM/YYYY")
                      : "N/A"}
                    <br />
                    <FaCalendarAlt /> <strong>Finaliza:</strong>{" "}
                    {receta.fecha_fin
                      ? dayjs(receta.fecha_fin).format("DD/MM/YYYY")
                      : "N/A"}
                  </div>

                  <div className="mt-3">
                    <strong>Estado: </strong>
                    {receta.estado === 1 ? (
                      <Badge bg="success">Activa</Badge>
                    ) : (
                      <Badge bg="danger">Inactiva</Badge>
                    )}
                  </div>

                  <h5 className="mt-4 d-flex align-items-center gap-2">
                    <FaPills />
                    Medicamentos
                  </h5>

                  <ul className="mt-2">
                    {(receta.medicamentos || []).map((m, index) => (
                      <li key={index}>
                        <strong>{m.medicamento || m.nombre || "Sin nombre"}</strong>
                        {" — "}
                        {m.dosis || "Sin dosis"}
                        <br />
                        <small className="text-muted">
                          {m.instrucciones || m.indicaciones || "Sin instrucciones"}
                        </small>
                        <hr />
                      </li>
                    ))}
                  </ul>

                  <PDFDownloadLink
                    document={
                      <RecetaPDF
                        paciente={receta.paciente || "Paciente no especificado"}
                        doctor={receta.doctor || "Doctor no especificado"}
                        fecha_inicio={
                          receta.fecha_inicio
                            ? dayjs(receta.fecha_inicio).format("DD/MM/YYYY")
                            : "N/A"
                        }
                        fecha_fin={
                          receta.fecha_fin
                            ? dayjs(receta.fecha_fin).format("DD/MM/YYYY")
                            : "N/A"
                        }
                        medicamentos={receta.medicamentos || []}
                        logo={logoActivo}
                      />
                    }
                    fileName={`receta-${receta.id}.pdf`}
                    style={{ textDecoration: "none" }}
                  >
                    {({ loading }) =>
                      loading ? (
                        <Button variant="secondary" disabled>
                          Generando PDF...
                        </Button>
                      ) : (
                        <Button variant="danger" className="mt-2 d-flex align-items-center justify-content-center gap-2">
                          <span>Descargar PDF</span>
                          <FaFilePdf size={18} />
                        </Button>
                      )
                    }
                  </PDFDownloadLink>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MisRecetas;

