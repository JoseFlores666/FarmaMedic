import { Footer } from "./components/Layout";
import Chatbot from "./components/Chatbot/Chatbot";
import { Menu } from "./components/Layout/Menu/Menu";
import { useAuth } from "./context/useAuth";
import Notificactions from "./components/Notifictions/Notifications";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Modal, Button } from "react-bootstrap";
import Ruleta from "../src/pages/Clients/Ruleta";

function App() {
  const { isAuthenticated } = useAuth();
  const [notificationCount, setNotificationCount] = useState(() => {
    const storedCount = localStorage.getItem("notificationCount");
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  const [showRuleta, setShowRuleta] = useState(false);

  useEffect(() => {
    localStorage.setItem("notificationCount", notificationCount);
  }, [notificationCount]);

  useEffect(() => {
    const verificarRuleta = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("authData"));
        const userId = authData ? authData.id : null;
        if (!userId) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/ruleta/puedeGirar/${userId}`
        );
        const data = res.data;

        /**
         * Se espera que el backend devuelva algo como:
         * { puedeGirar: true, fecha_giro: "2025-10-20T00:00:00Z" }
         */
        const puedeGirar = data.puedeGirar;
        const ultimaVezGiro = data.fecha_giro ? dayjs(data.fecha_giro) : null;
        const hace7dias = dayjs().subtract(7, "day");

        // ✅ Mostrar ruleta SOLO si el usuario puede girar y han pasado 7 días
        if (puedeGirar && (!ultimaVezGiro || ultimaVezGiro.isBefore(hace7dias))) {
          setShowRuleta(true);
        } else {
          setShowRuleta(false); // 🔒 No mostrar si ya giró o no puede
        }
      } catch (err) {
        console.error("Error verificando ruleta:", err);
      }
    };

    if (isAuthenticated) {
      verificarRuleta();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Menu
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
      <Footer />
      <Chatbot />

      {isAuthenticated && (
        <>
          <Notificactions setNotificationCount={setNotificationCount} />

          {/* 👇 Modal que contiene la ruleta */}
          <Modal
            show={showRuleta}
            onHide={() => setShowRuleta(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton className="bg-danger text-white">
              <Modal.Title className="fw-bold">
                🎁 ¡Tu oportunidad de ganar descuentos!
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light">
              <Ruleta onFinish={() => setShowRuleta(false)} /> 
              {/* 👈 Cierra el modal cuando termina el giro */}
            </Modal.Body>

            <Modal.Footer className="bg-light">
              <Button
                variant="secondary"
                className="fw-semibold px-4"
                onClick={() => setShowRuleta(false)}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default App;
