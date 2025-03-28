import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/useAuth';
import ScrollToTop from './ScrollTop';
import { FaCog, FaHome, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Navbar from 'react-bootstrap/Navbar';
import SearchBar from '../SearchBar/Search';

export const Navbar2 = () => {
  //elimine isAdmin para recordarlo
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, username, logout, role } = useAuth();
  const navigate = useNavigate();
  const [logoActivo, setLogoActivo] = useState(null);

  const fetchLogoActivo = useCallback(async () => {
    try {
      const response = await fetch("https://back-farmam.onrender.com/api/getLogoActivo");
      if (!response.ok) throw new Error("Error fetching active logo");
      const data = await response.json();

      if (data && data.url) {
        setLogoActivo(data.url);
      } else {
        setLogoActivo(null);
      }
    } catch (error) {
      navigate("/error500");
      console.error("Error fetching active logo:", error);
      setLogoActivo(null);
    }
  }, [navigate]);





  useEffect(() => {
    fetchLogoActivo();
    const interval = setInterval(fetchLogoActivo, 20000);

    return () => clearInterval(interval);
  }, [fetchLogoActivo]);

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
                  style={{ height: "50px", width: "auto" }}
                />
              ) : (
                "Cargando..."
              )}
            </Navbar.Brand>
          </div>

          <div style={{ position: "relative", flexGrow: 1 }}>
  <SearchBar />
</div>


          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={toggleMenu} />
          <Navbar.Offcanvas id="offcanvasNavbar" placement="end" show={menuOpen} onHide={closeMenu}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>FarmaMedic</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ms-auto">

                <Nav.Link as={NavLink} to="/Inicio" end onClick={closeMenu}>
                  <FaHome className="me-2" /> Inicio
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
                            Doctores disponibles
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="/Inicio/Expediente" onClick={closeMenu}>
                            Mi expediente medico
                          </NavDropdown.Item>
                          <NavDropdown.Item as={NavLink} to="" onClick={closeMenu}>
                            Mis Reservaciones
                          </NavDropdown.Item>
                        </NavDropdown>
                      </>
                    )}
                    {role === 3 && (
                      <>
                        <NavDropdown
                          align="end"
                          menuAlign="right"
                          container="body"
                          title="Gestión Médica"
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
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    <Nav.Link as={NavLink} to="/Acceder" onClick={closeMenu}>
                      <FaSignInAlt className="me-2" /> Iniciar Sesion
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/Registrarse" onClick={closeMenu}>
                      <FaUserPlus className="me-2" /> Registrarse
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};