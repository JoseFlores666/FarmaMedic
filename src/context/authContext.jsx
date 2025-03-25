import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);  

    const login = async(name, adminStatus,userRole, id) => {
        setIsAuthenticated(true);
        setUsername(name);
        setIsAdmin(adminStatus);
        setUserId(id);
        setRole(userRole); 

        localStorage.setItem('authData', JSON.stringify({ usuario: name, isAdmin: adminStatus,role:userRole, id }));
    };

    const logout = async () => {
        await fetch('https://localhost:4000/api/logout', {
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
                const response = await fetch('https://localhost:4000/api/session', {
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    login(data.usuario, data.isAdmin,data.role, data.id);
                } else if (response.status === 401) {
                    console.log("No hay sesión activa.");
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
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, role,username, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
