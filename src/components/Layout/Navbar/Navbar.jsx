import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from 'mdb-react-ui-kit';
import './Navbar.css';
import { useAuth } from '../../../context/useAuth';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Estado para el menú desplegable
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    setMenuOpen(false); // Cerrar el menú al hacer logout
    navigate('/login', { replace: true });
  };

  // Función para cerrar el menú después de seleccionar un enlace
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1c2331' }}>
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand title" onClick={closeMenu}>
            FarmaMedic
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={menuOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/home" onClick={closeMenu}> {/* Cierra el menú al hacer clic */}
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/about" onClick={closeMenu}> {/* Cierra el menú al hacer clic */}
                      About
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/services" onClick={closeMenu}> {/* Cierra el menú al hacer clic */}
                      Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/contact" onClick={closeMenu}> {/* Cierra el menú al hacer clic */}
                      Contact
                    </NavLink>
                  </li>

                  {/* Dropdown para información del usuario y cerrar sesión */}
                  <MDBDropdown>
                    <MDBDropdownToggle tag="a" className="nav-link d-flex align-items-center" role="button">
                      <MDBIcon fas icon="user" className="me-2" /> {username}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link onClick={onLogout}>
                        <MDBIcon fas icon="sign-out-alt" className="me-2" /> Cerrar sesión
                      </MDBDropdownItem>
                      <MDBDropdownItem link>
                        <MDBIcon fas icon="user-cog" className="me-2" /> Perfil
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login" onClick={closeMenu}> {/* Cierra el menú al hacer clic */}
                      Iniciar sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register" onClick={closeMenu}> {/* Cierra el menú al hacer clic */}
                      Registrarse
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
