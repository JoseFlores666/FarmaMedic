import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import ThemeToggle from '../../../util/theme-toggler';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, username, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [logoActivo, setLogoActivo] = useState(null); 

  useEffect(() => {
    fetchLogoActivo(); 

    const intervalId = setInterval(() => {
      fetchLogoActivo(); 
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchLogoActivo = async () => {
    try {
      const response = await fetch('https://localhost:4000/api/getLogoActivo');
      if (!response.ok) throw new Error("Error fetching active logo");
      const data = await response.json();

      if (data && data.url) {
        setLogoActivo(data); 
      } else {
        setLogoActivo(null); 
      }
    } catch (error) {
      console.error("Error fetching active logo:", error);
      setLogoActivo(null); 
    }
  };

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ backgroundColor: '#1c2331' }}>
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
            {logoActivo ? (
              <img src={logoActivo.url} alt="Logo Activo" style={{ height: '30px', width: 'auto' }} />
            ) : (
              'FarmaMedic'
            )}
          </NavLink>

          <ThemeToggle />

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
                    <NavLink className="nav-link" to="/home" onClick={closeMenu}>Inicio</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/about" onClick={closeMenu}>About</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/services" onClick={closeMenu}>Services</NavLink>
                  </li>

                  {isAdmin && (
                    <>
                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Perfil Empresa
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/contact" onClick={closeMenu}>Información Empresa</NavLink>
                          </li>
                          <li className="nav-item active">
                            <NavLink className="dropdown-item" to="/Enlaces" onClick={closeMenu}>Redes Sociales</NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/Logo" onClick={closeMenu}>Logo</NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/gestionUsuarios" onClick={closeMenu}>Gestion De Usuarios</NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/auditoria" onClick={closeMenu}>Auditoria</NavLink>
                          </li>
                        </ul>
                      </li>

                      <li className="nav-item dropdown">
                        <a
                          className="nav-link dropdown-toggle"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Doc Regulatorio
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/CRUDPoliticas" onClick={closeMenu}>Políticas de Privacidad</NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/CRUDTerminos" onClick={closeMenu}>Términos y Condiciones</NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="dropdown-item" to="/CRUDDeslinde" onClick={closeMenu}>Deslinde Legal</NavLink>
                          </li>
                        </ul>
                      </li>
                    </>
                  )}

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {username}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={onLogout}>Cerrar sesión</a>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/home2" onClick={closeMenu}>Inicio</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login" onClick={closeMenu}>Iniciar sesión</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register" onClick={closeMenu}>Registrarse</NavLink>
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
