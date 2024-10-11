import { useAuth } from '../../context/useAuth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <nav>
        <p to="/" className="title">
          FarmaMedic
        </p>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          {isAuthenticated ? (
            <>
              <li>
                <span className='username'>{username}</span>
              </li>
              <li>
                <button className='btn-logout' onClick={onLogout}>
                  Cerrar sesión
                </button>
              </li>
              <li>
                <NavLink to="/home">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/services">Services</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Iniciar sesión</NavLink>
              </li>
              <li>
                <NavLink to="/register">Registrarse</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};
