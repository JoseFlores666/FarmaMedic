import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { Wheel } from "react-custom-roulette";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  FaGift, FaQuestionCircle, FaTrophy, FaHourglassHalf, FaExclamationTriangle, FaBullseye, FaInfoCircle, FaStar, FaBan,
} from "react-icons/fa";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import "animate.css";

export default function Ruleta() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [premioTexto, setPremioTexto] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [colores, setColores] = useState([]);
  const [textColors, setTextColors] = useState([]);
  const [imagen, setImagen] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [puedeGirar, setPuedeGirar] = useState(false);
  const intervalRef = useRef(null);

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;

  const guardarDescuento = async (userId, premio) => {
    if (!userId || !premio) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/ruleta/insertDiscountWheel`, { id_usuario: userId, premio });
    } catch (err) {
      console.error("Error guardando descuento:", err);
    }
  };

  const startCronometro = (limite) => {
    clearInterval(intervalRef.current);
    const actualizarTiempo = () => {
      const ahora = dayjs();
      const diff = dayjs.duration(limite.diff(ahora));

      if (diff.asMilliseconds() <= 0) {
        clearInterval(intervalRef.current);
        setTiempoRestante(null);
        setPremioTexto("Tu oportunidad para girar ha expirado.");
        setPuedeGirar(false);
        return;
      }

      setTiempoRestante({
        dias: diff.days(),
        horas: diff.hours(),
        minutos: diff.minutes(),
        segundos: diff.seconds(),
      });
    };
    actualizarTiempo();
    intervalRef.current = setInterval(actualizarTiempo, 1000);
  };

  useEffect(() => {
    if (!userId) return;

    const verificarGiro = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/ruleta/puedeGirar/${userId}`);
        const data = res.data;

        if (!data.puedeGirar) {
          setPuedeGirar(false);
          if (data.motivo === "Ya giraste una vez.") {
            setPremioTexto(`Ya giraste tu ruleta el ${dayjs(data.fecha_giro).format("DD/MM/YYYY")}.`);
          } else if (data.motivo?.includes("expiró")) {
            const limite = dayjs(data.fecha_limite).format("DD/MM/YYYY");
            setPremioTexto(`Tu oportunidad para girar expiró el ${limite}.`);
          }
        } else {
          const limite = dayjs(data.fecha_limite);
          setPremioTexto(`Puedes girar tu ruleta (hasta el ${limite.format("DD/MM/YYYY")}).`);
          setPuedeGirar(true);
          startCronometro(limite);
        }
      } catch (err) {
        console.error("Error verificando ruleta:", err);
      }
    };

    verificarGiro();
    return () => clearInterval(intervalRef.current);
  }, [userId]);

  useEffect(() => {
    const fetchActiveWheel = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/ruleta/getWheelActive`);
        const wheel = res.data;

        if (wheel && wheel.id) {
          const opciones = wheel.ofertas?.map(o => ({ option: o.oferta || "Sin premio" })) || [];
          const coloresSolo = wheel.colores?.map(c => c.color || "#ffffff") || [];
          const textColors = wheel.ofertas?.map(o => o.colorTexto || "#000000") || [];
          setData(opciones);
          setColores(coloresSolo);
          setTextColors(textColors);
          setImagen(wheel.imagen || "");
        }
      } catch (err) {
        console.error("Error cargando ruleta activa:", err);
      }
    };

    fetchActiveWheel();
  }, []);

const girarRuleta = () => {
  if (!data.length || !puedeGirar) return;
  clearInterval(intervalRef.current); 
  const nuevoPremio = Math.floor(Math.random() * data.length);
  setPrizeNumber(nuevoPremio);
  setMustSpin(true);
  setShowConfetti(false);
  setTiempoRestante(null); 
  setPremioTexto(""); 
};
const aplicarDescuento = async () => {
  const premio = data[prizeNumber]?.option || "";
  setMustSpin(false);

  const premioLower = premio.toLowerCase();

  const invalidos = ["sin premio", "vuelve a intentar"];

  if (premio && !invalidos.some(inv => premioLower.includes(inv))) {
    setPremioTexto(`¡Ganaste: ${premio}!`);
    await guardarDescuento(userId, premio);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
    setPuedeGirar(false); 
  } else {
    setPremioTexto("¡No ganaste ningún premio esta vez!");
    setPuedeGirar(true); 
  }
};


  return (
    <div
      style={{
        backgroundImage: `url(${imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center mt-4">
        {showConfetti && <Confetti className="w-100" numberOfPieces={500} />}
        <Row>
          <Col className="text-center">
            <div className="bg-light p-3 rounded">
              <h2 className="fw-bold d-flex justify-content-center align-items-center gap-2">
                <FaGift color="red" /> Ruleta de Descuentos <FaGift color="red" />
                <FaQuestionCircle
                  color="blue"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowModal(true)}
                />
              </h2>
            </div>

            <div className="d-flex justify-content-center mb-4">
              {data.length > 0 ? (
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={data}
                  backgroundColors={colores.length ? colores : ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"]}
                  textColors={textColors.length ? textColors : ["#ffffff"]}
                  onStopSpinning={aplicarDescuento}
                />
              ) : (
                <p className="fw-bold text-danger">No hay ninguna ruleta activa</p>
              )}
            </div>

            <Button
              onClick={girarRuleta}
              disabled={mustSpin || !data.length || !puedeGirar}
              variant="danger"
              className="mb-4"
            >
              Girar Ruleta
            </Button>

            {tiempoRestante && !mustSpin && puedeGirar && (
              <div className="bg-light rounded shadow-sm">
                <p className="fw-bold text-danger fs-4 mb-0">El giro expira en:</p>
                <p className="text-primary fw-bold" style={{ fontSize: "2rem" }}>
                  {tiempoRestante.dias}d {tiempoRestante.horas}h {tiempoRestante.minutos}m {tiempoRestante.segundos}s
                </p>
              </div>
            )}

            {premioTexto && (
              <div
                className={`p-3 rounded shadow-sm text-center mt-3 animate__animated ${
                  premioTexto.includes("Ganaste")
                    ? "bg-success text-white animate__pulse"
                    : premioTexto.includes("expiró") || premioTexto.includes("espera")
                    ? "bg-warning text-dark animate__fadeIn"
                    : premioTexto.includes("Ya giraste")
                    ? "bg-danger text-white animate__shakeX"
                    : "bg-info text-white animate__fadeIn"
                }`}
                style={{ border: "2px solid rgba(0,0,0,0.1)" }}
              >
                <p className="fs-4 fw-bold m-0 d-flex align-items-center justify-content-center gap-2">
                  {premioTexto.includes("Ganaste") && <FaTrophy size={28} />}
                  {premioTexto.includes("Ya giraste") && <FaHourglassHalf size={28} />}
                  {premioTexto.includes("expiró") && <FaExclamationTriangle size={28} />}
                  {premioTexto.includes("Puedes girar") && <FaBullseye size={28} />}
                  {!(
                    premioTexto.includes("Ganaste") ||
                    premioTexto.includes("Ya giraste") ||
                    premioTexto.includes("expiró") ||
                    premioTexto.includes("Puedes girar")
                  ) && <FaInfoCircle size={28} />}
                  {premioTexto}
                </p>
              </div>
            )}

          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <FaInfoCircle /> Cómo funciona la Ruleta
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light">
          <p className="d-flex align-items-center gap-2 fs-6">
            <FaBullseye className="text-primary" />
            Los nuevos usuarios tienen 7 días desde su registro para girar la ruleta.
          </p>
          <p className="d-flex align-items-center gap-2 fs-6">
            <FaGift className="text-success" />
            Solo puedes girar una vez, así que aprovecha tu oportunidad.
          </p>
          <p className="d-flex align-items-center gap-2 fs-6">
            <FaStar className="text-warning" />
            Tu premio se guarda automáticamente en tu cuenta.
          </p>
          <p className="d-flex align-items-center gap-2 fs-6">
            <FaBan className="text-danger" />
            Si pasan 7 días y no giraste, perderás tu oportunidad.
          </p>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button
            variant="secondary"
            className="fw-semibold px-4"
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
