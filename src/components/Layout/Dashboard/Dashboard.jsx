import { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  ListGroup,
  Accordion,
} from "react-bootstrap";
import {
  FaUserSecret,
  FaAlignLeft,
  FaBell,
  FaCalendarAlt,
  FaStethoscope,
  FaUserMd,
  FaFolderOpen,
  FaClock,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaBuilding,
  FaUserCog,
  FaClipboardCheck,
  FaComments,
  FaShieldAlt,
  FaFileContract,
  FaGavel,
  FaLink,
  FaLock,
  FaCheck,
  FaTrashAlt
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AppRouter } from "../../../router/AppRouter";
import { useAuth } from "../../../context/useAuth";
import "./styles.css";
import ScrollToTop from '../Navbar/ScrollTop';
import Breadcrumbs from "../../Breadcrumbs";
import ThemeToggle from "../../../util/theme-toggler";
import axios from "axios";

export const Sidebar = () => {
  const { isAuthenticated, role } = useAuth();
  const [logoActivo, setLogoActivo] = useState(null);
  const [mostrarPredicciones] = useState(false);

  const fetchLogoActivo = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getLogoActivo`);
      if (!response.ok) throw new Error("Error fetching active logo");
      const data = await response.json();

      if (data && data.url) {
        setLogoActivo(data.url);
      } else {
        setLogoActivo(null);
      }
    } catch (error) {
      console.error("Error fetching active logo:", error);
      setLogoActivo(null);
    }
  }, []);

  useEffect(() => {
    fetchLogoActivo()
  }, []);

  return (
    <div
      className="sidebar-wrapper"
      id="sidebar-wrapper"
      style={{ backgroundColor: "#2c245b" }}
    >
      <div className="sidebar-heading text-center py-2 px-4 text-white ">
        {logoActivo ? (
          <img
            src={logoActivo}
            style={{ height: "50px", width: "auto" }}
          />
        ) : (
          "Cargando..."
        )}
      </div>
      {isAuthenticated && role === 1 && (
        <Accordion flush className="mt-2">
          <ListGroup variant="flush">
            <ListGroup.Item as={NavLink} to="/Panel_Administrativo" style={{ backgroundColor: "#2c245b", color: "white" }}>
              <FaCalendarAlt className="me-2" />
              Panel General
            </ListGroup.Item>
          </ListGroup>
          <Accordion.Item eventKey="0" style={{ backgroundColor: "#2c245b", }}>
            <Accordion.Header>Gestión de Médica</Accordion.Header>
            <Accordion.Body className="p-0" style={{ backgroundColor: "#2c245b" }}>
              <ListGroup variant="flush">
                <ListGroup.Item as={NavLink} to="/Citas" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaCalendarAlt className="me-2" />
                  Citas Médicas
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Servicios" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaStethoscope className="me-2" />
                  Especialidades
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Doctores" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaUserMd className="me-2" />
                  Doctores
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Expedientes" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaFolderOpen className="me-2" />
                  Expedientes
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Asignar_Servicios" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaLink className="me-2" />
                  Asignar Servicios
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Horarios_Citas" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaClock className="me-2" />
                  Horarios Citas
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Recetas" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaPrescriptionBottleAlt className="me-2" />
                  Recetas
                </ListGroup.Item>
                {mostrarPredicciones && (
                  <ListGroup.Item as={NavLink} to="/Predicciones" style={{ backgroundColor: "#2c245b", color: "white" }}>
                    <FaPrescriptionBottleAlt className="me-2" />
                    Predicciones
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" style={{ backgroundColor: "#2c245b" }}>
            <Accordion.Header>Gestionar Empresa</Accordion.Header>
            <Accordion.Body className="p-0" style={{ backgroundColor: "#2c245b" }}>
              <ListGroup variant="flush">
                <ListGroup.Item as={NavLink} to="/Inicio/Empresa" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaBuilding className="me-2" />
                  Empresa
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Inicio/Horario_Empresa" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaClock className="me-2" />
                  Horario
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Inicio/NoticiasForm" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaUserCog className="me-2" />
                  Noticias
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Gestion_Usuarios" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaUserCog className="me-2" />
                  Gestionar Usuarios
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Auditoria" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaClipboardCheck className="me-2" />
                  Auditoria
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/CRUDOpiniones" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaComments className="me-2" />
                  Gestión de Opiniones
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Inicio/Editar_Ruleta" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaComments className="me-2" />
                  Ruleta
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>

          </Accordion.Item>

          <Accordion.Item eventKey="2" style={{ backgroundColor: "#2c245b" }}>
            <Accordion.Header>Doc Regulatorio</Accordion.Header>
            <Accordion.Body className="p-0" style={{ backgroundColor: "#2c245b" }}>
              <ListGroup variant="flush">
                <ListGroup.Item as={NavLink} to="/Home/Politicas_De_Privacidad" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaShieldAlt className="me-2" />
                  Políticas de Privacidad
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Home/Terminos_Y_Condiciones" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaFileContract className="me-2" />
                  Términos y Condiciones
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Home/Deslinde_Legal" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaGavel className="me-2" />
                  Deslinde Legal
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Home/Aviso_De_Privacidad" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaLock className="me-2" />
                  Aviso De Privacidad
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

        </Accordion>
      )}

      {isAuthenticated && role === 3 && (
        <Accordion flush className="mt-2">
          <ListGroup variant="flush">
            <ListGroup.Item as={NavLink} to="/Panel_Administrativo" style={{ backgroundColor: "#2c245b", color: "white" }}>
              <FaCalendarAlt className="me-2" />
              Panel Médico
            </ListGroup.Item>
          </ListGroup>
          <Accordion.Item eventKey="0" style={{ backgroundColor: "#2c245b", }}>
            <Accordion.Header>Gestión Médica</Accordion.Header>
            <Accordion.Body className="p-0" style={{ backgroundColor: "#2c245b" }}>
              <ListGroup variant="flush">
                <ListGroup.Item as={NavLink} to="/Citas" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaCalendarAlt className="me-2" />
                  Mis Citas
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Servicios" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaStethoscope className="me-2" />
                  servicios aqui se elegira los servicios que imparte
                </ListGroup.Item>

                <ListGroup.Item as={NavLink} to="/Expedientes" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaFolderOpen className="me-2" />
                  Expedientes
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Horarios_Citas" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaClock className="me-2" />
                  Mi Horario
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Recetas" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaPrescriptionBottleAlt className="me-2" />
                  Recetas
                </ListGroup.Item>
                <ListGroup.Item as={NavLink} to="/Act_Expediente" style={{ backgroundColor: "#2c245b", color: "white" }}>
                  <FaFileMedical className="me-2" />
                  Actualizar Expediente
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

    </div>
  );
};

export const Dashboard = ({ notificationCount, setNotificationCount, consNoti }) => {
  const [toggled, setToggled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoActivo, setLogoActivo] = useState(null);
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;
  
  const fetchLogoActivo = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getLogoActivo`);
      if (!response.ok) throw new Error("Error fetching active logo");
      const data = await response.json();

      if (data && data.url) {
        setLogoActivo(data.url);
      } else {
        setLogoActivo(null);
      }
    } catch (error) {
      console.error("Error fetching active logo:", error);
      setLogoActivo(null);
    }
  }, []);

  useEffect(() => {
    fetchLogoActivo();
  }, []);

  const toggleSidebar = () => setToggled(!toggled);

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/Inicio", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const getNotificaciones = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/getNotiById/${userId}`);
      setNotificaciones(res.data);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    getNotificaciones();
  }, [userId]);

  const marcarTodasNotiLeidas = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notiLeidas/${userId}`);
      getNotificaciones();
    } catch (error) {
      console.error("Error al marcar todas:", error);
    }
  };

  const eliminarNoti = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/deleteNoti/${id}`);
      getNotificaciones();
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const eliminarTodasNoti = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/deleteNotisAll/${userId}`);
      getNotificaciones();
    } catch (error) {
      console.error("Error al eliminar todas:", error);
    }
  };

  const marcarNotiLeida = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notiLeida/${id}`);
      getNotificaciones();
    } catch (error) {
      console.error("Error al marcar notificación:", error);
    }
  };

  return (
    <div className={`d-flex  ${toggled ? "toggled" : ""}`} id="wrapper" >
      <ScrollToTop />

      <Sidebar />

      <div id="page-content-wrapper">
        <Navbar expand="lg" variant="dark" className="px-4 py-3 sticky-top text-white" style={{ backgroundColor: '#2c245b' }} >
          <div className="d-flex align-items-center">
            <FaAlignLeft className="fs-4 me-3" onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
            <Breadcrumbs></Breadcrumbs>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <NavDropdown
                title={
                  <span style={{ color: "white" }}>
                    <FaUserSecret className="me-2" color="white" />
                    {username || "Usuario"}
                  </span>
                }
                id="user-dropdown"
              >
                <NavDropdown.Item
                  as={NavLink}
                  to="/Recetas"
                  onClick={closeMenu}
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="me-3">
              <NavDropdown
                align="end"
                id="notification-dropdown"
                title={
                  <>
                    <div
                      className="position-relative"
                      style={{ color: "white", cursor: "pointer" }}
                    ></div>
                    <FaBell size={20} />
                    {notificationCount > 0 && (
                      <span
                        className="position-absolute top-14 start-40 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {notificationCount}
                      </span>
                    )}
                  </>
                }
              >
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {consNoti && consNoti.length > 0 ? (
                    consNoti.map((noti, index) => (
                      <NavDropdown.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{noti.titulo || "Notificación"}</strong>
                          <div style={{ fontSize: "0.75rem", color: "#666" }}>
                            {noti.descripcion || "Sin descripción"}
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-success me-1"
                            title="Marcar como leída"
                            onClick={() => marcarNotiLeida(noti.id)}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Eliminar notificación"
                            onClick={() => eliminarNoti(noti.id)}
                          >

                            <FaTrashAlt />
                          </button>
                        </div>
                      </NavDropdown.Item>
                    ))
                  ) : (
                    <NavDropdown.Item disabled>
                      No tienes notificaciones nuevas
                    </NavDropdown.Item>
                  )}
                </div>

                <NavDropdown.Divider />

                {/* Acciones generales */}
                <NavDropdown.Item onClick={() => marcarTodasNotiLeidas(userId)}>
                  <FaCheck className="me-2 text-success" /> Marcar todas como leídas
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => eliminarTodasNoti(userId)}>
                  {/* Cambia aquí también el ícono si quieres */}
                  <FaTrashAlt className="me-2 text-danger" /> Eliminar todas
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

          </Navbar.Collapse>
          <ThemeToggle></ThemeToggle>

        </Navbar>

        <div className="px-4 pt-3">
          <AppRouter />
        </div>
      </div>
    </div>
  );
};
