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
import { Analytics } from "@vercel/analytics/react";

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

        const puedeGirar = data.puedeGirar;
        const ultimaVezGiro = data.fecha_giro ? dayjs(data.fecha_giro) : null;
        const hace7dias = dayjs().subtract(7, "day");

        if (puedeGirar && (!ultimaVezGiro || ultimaVezGiro.isBefore(hace7dias))) {
          setShowRuleta(true);
        } else {
          setShowRuleta(false);
        }
      } catch (err) {
        console.error("Error verificando ruleta:", err);
      }
    };

    if (isAuthenticated) {
      verificarRuleta();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOffline = () => {
      console.warn("Sin conexión a Internet. Algunas funciones no estarán disponibles.");
    };

    const handleOnline = () => {
      console.log("✅ Conexión a Internet restaurada");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);


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
      <Analytics />
    </>
  );
}

export default App;
