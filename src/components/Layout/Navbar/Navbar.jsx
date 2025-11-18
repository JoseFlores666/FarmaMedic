import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
import ScrollToTop from './ScrollTop';
import { FaBell, FaCheck, FaCog, FaHome, FaSignInAlt, FaTrashAlt, FaUserPlus } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Navbar from 'react-bootstrap/Navbar';
import { SearchB } from '../SearchBar/Search';
import { AppRouter } from '../../../router/AppRouter';
import Breadcrumbs from '../../Breadcrumbs';
import "../../Layout/Navbar/style.css"
import ThemeToggle from '../../../util/theme-toggler';
import axios from "axios";
import { socket } from "../../../context/socket";

export const Navbar2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, username, logout, role } = useAuth();
  const navigate = useNavigate();
  const [logoActivo, setLogoActivo] = useState(null);

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userId = authData ? authData.id : null;

  const [setNotificaciones] = useState([]);

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
    if (!userId) return;

    socket.emit("joinRoom", `paciente_${userId}`);

    getNotificaciones();

    socket.on("notificacion:nueva", () => {
      getNotificaciones();
    });

    return () => {
      socket.off("notificacion:nueva");
    };
  },);

  const marcarTodasNotiLeidas = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/notiLeidas/${userId}`);
      getNotificaciones();
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
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
      console.error("Error al marcar como leída:", error);
    }
  };
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
    }
  }, []);

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/Inicio', { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    fetchLogoActivo()
  },);

  return (
    <>
      <ScrollToTop />
      <Navbar expand="lg" style={{ backgroundColor: '#2c245b' }} variant="dark" sticky="top" expanded={menuOpen}>
        <Container fluid>
          <div>
            <Navbar.Brand as={NavLink} to="/Inicio" onClick={closeMenu}>
              {logoActivo ? (
                <img
                  src={logoActivo}
                  className="navbar-brand-img"

                />
              ) : (
                "Cargando..."
              )}
            </Navbar.Brand>
          </div>

          <div style={{ position: "relative", flexGrow: 1 }}>
            <SearchB />
          </div>

          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={toggleMenu} />
          <Navbar.Offcanvas id="offcanvasNavbar" placement="end" show={menuOpen} onHide={closeMenu}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>FarmaMedic</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ms-auto">

                <Nav.Link as={NavLink} to="/Inicio" end onClick={closeMenu}>
                  <FaHome className="me-1" /> Inicio
                </Nav.Link>
                {isAuthenticated ? (
                  <>
                    {role === 1 && (
                      <>
                        <NavDropdown title="Gestión Médica" >
                          <NavDropdown.Item as={NavLink} to="/Citas" onClick={closeMenu}>
                            Gestión de Citas Médicas
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Servicios" onClick={closeMenu}>
                            Gestión de Especialidades Médicas
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Doctores" onClick={closeMenu}>
                            Gestión de Doctores
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Expedientes" onClick={closeMenu}>
                            Gestión de Expedientes
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Horarios_Citas" onClick={closeMenu}>
                            Gestión de Horario Médico
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Recetas" onClick={closeMenu}>
                            Gestión de Recetas Médicas
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Act_Expediente" onClick={closeMenu}>
                            Actualización de Expediente
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Gestion Empresa">
                          <NavDropdown.Item as={NavLink} to="/Inicio/Empresa" onClick={closeMenu}>
                            Información Empresa
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Gestion_Usuarios" onClick={closeMenu}>
                            Gestión de Usuarios
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Auditoria" onClick={closeMenu}>
                            Auditoría
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/CRUDOpiniones" onClick={closeMenu}>
                            Gestión de Opiniones
                          </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Doc Regulatorio">
                          <NavDropdown.Item as={NavLink} to="/CRUDPoliticas" onClick={closeMenu}>
                            Políticas de Privacidad
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/CRUDTerminos" onClick={closeMenu}>
                            Términos y Condiciones
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/CRUDDeslinde" onClick={closeMenu}>
                            Deslinde Legal
                          </NavDropdown.Item>
                        </NavDropdown>
                      </>
                    )}
                    {role === 2 && (
                      <>
                        <NavDropdown title="Mis Citas" >
                          <NavDropdown.Item as={NavLink} to="/Inicio/Doctor" onClick={closeMenu}>
                            Doctores Disponibles
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Inicio/Expediente" onClick={closeMenu}>
                            Mi Expediente Médico
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Inicio/Reservaciones" onClick={closeMenu}>
                            Mis Reservaciones
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Inicio/Mis_Recetas" onClick={closeMenu}>
                            Mis Recetas
                          </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Mini Juegos" >
                          <NavDropdown.Item as={NavLink} to="/Inicio/Ruleta" onClick={closeMenu}>
                            Ruleta de la suerte
                          </NavDropdown.Item>
                        </NavDropdown>
                      </>
                    )}
                    {role === 3 && (
                      <>
                        <NavDropdown
                          title="Gestión Médica"
                          align="end"
                          menuAlign="right"
                          container="body"
                        >
                          <NavDropdown.Item as={NavLink} to="/Citas" onClick={closeMenu}>
                            Gestión de Citas Médicas
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Expedientes" onClick={closeMenu}>
                            Gestión de Expedientes
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Horarios_Citas" onClick={closeMenu}>
                            Gestión de Horario Médico
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Recetas" onClick={closeMenu}>
                            Gestión de Recetas Médicas
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Act_Expediente" onClick={closeMenu}>
                            Actualización de Expediente
                          </NavDropdown.Item>
                        </NavDropdown>
                      </>
                    )}

                    <NavDropdown
                      title={<><FaCog /> {username}</>}
                      id="user-dropdown"
                      align="end"
                      container="body"
                    >
                      <NavDropdown.Item as={NavLink} to={"/Perfil"}>
                        Mi Perfil
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={onLogout}>
                        Cerrar sesión
                      </NavDropdown.Item>
                      <NavDropdown.Item as={NavLink} to={"/Wear_OS"}>
                        Wear Os
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link as={NavLink} to="/Acceder" onClick={closeMenu}>
                      <FaSignInAlt className="me-1" /> Iniciar Sesion
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/Registrarse" onClick={closeMenu}>
                      <FaUserPlus className="me-1" /> Registrarse
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div style={{ display: "none" }}>
            <ThemeToggle></ThemeToggle>
          </div>
          <div style={{ display: 'none' }}>

            {authData && (
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
                      <span
                        className="position-absolute top-14 start-40 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                      </span>
                    </>
                  }
                >
                  <div style={{ maxHeight: "250px", overflowY: "auto" }}>

                    <NavDropdown.Item
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong></strong>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>

                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-success me-1"
                          title="Marcar como leída"
                          onClick={() => marcarNotiLeida()}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Eliminar notificación"
                          onClick={() => eliminarNoti()}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </NavDropdown.Item>

                  </div>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={() => marcarTodasNotiLeidas(userId)}>
                    <FaCheck className="me-2 text-success" /> Marcar todas como leídas
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => eliminarTodasNoti(userId)}>
                    <FaTrashAlt className="me-2 text-danger" /> Eliminar todas
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </div>

        </Container>

      </Navbar>
      <div style={{
        width: '100%', backgroundColor: '#0b0342',
        position: 'fixed', color: 'rgba(0, 0, 0, 0.2)', zIndex: '997'
      }}>
        <Breadcrumbs />
      </div>
      <div>
        <AppRouter />
      </div>
      <Outlet />
    </>
  );
};