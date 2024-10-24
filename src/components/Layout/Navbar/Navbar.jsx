import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/useAuth';
import ThemeToggle from '../../../util/theme-toggler';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, username, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState('FarmaMedic'); // Estado para almacenar el título

  useEffect(() => {
    fetchTitle();
  }, []);

    useEffect(() => {
    // Establecer el título del documento cada vez que pageTitle cambie
    document.title = pageTitle || 'FarmaMedic'; // Usa 'FarmaMedic' si pageTitle está vacío
  }, [pageTitle]);

  const fetchTitle = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getTitle'); 
      const data = await response.json();
      
      if (data && data[0]?.title) {
        setPageTitle(data[0].title); // Si la respuesta es un array
      }
    } catch (error) {
      console.error('Error al obtener el título:', error);
      setPageTitle('FarmaMedic'); // Valor por defecto si hay error
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
            {pageTitle}
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
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/home" onClick={closeMenu}>
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/about" onClick={closeMenu}>
                      About
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/services" onClick={closeMenu}>
                      Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/contact" onClick={closeMenu}>
                      Contact
                    </NavLink>
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
                            <NavLink className="nav-link" to="/Enlaces" onClick={closeMenu}>
                              Enlaces
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="nav-link" to="/Eslogan" onClick={closeMenu}>
                              Eslogan
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="nav-link" to="/Logo" onClick={closeMenu}>
                              Logo
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="nav-link" to="/PageTittle" onClick={closeMenu}>
                              PageTittle
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="nav-link" to="/CRUDDeslinde" onClick={closeMenu}>
                              Deslinde
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="nav-link" to="/CRUDPoliticas" onClick={closeMenu}>
                              Politicas
                            </NavLink>
                          </li>
                          <li className="nav-item">
                            <NavLink className="nav-link" to="/CRUDTerminos" onClick={closeMenu}>
                              Terminos
                            </NavLink>
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
                        <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={onLogout}>
                          Cerrar sesión
                        </a>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/profile">
                          Perfil
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login" onClick={closeMenu}>
                      Iniciar sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register" onClick={closeMenu}>
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
