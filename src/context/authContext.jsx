import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { socket } from './socket'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const login = async (name, adminStatus, userRole, id) => {
    setIsAuthenticated(true);
    setUsername(name);
    setIsAdmin(adminStatus);
    setUserId(id);
    setRole(userRole);

    localStorage.setItem(
      'authData',
      JSON.stringify({ usuario: name, isAdmin: adminStatus, role: userRole, id })
    );

    if (userRole === 1) {
      socket.emit('joinPaciente', id); 
    }
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setIsAuthenticated(false);
    setUsername(null);
    setIsAdmin(false);
    setUserId(null);
    setRole(null);
    localStorage.removeItem('authData');
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/session`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          login(data.usuario, data.isAdmin, data.role, data.id);
        } else if (response.status === 401) {
          console.log('No hay sesión activa.');
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error verificando la sesión:', error);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        role,
        username,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
