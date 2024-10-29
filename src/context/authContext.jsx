import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('logged') === 'true';
    });

    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username');
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        return localStorage.getItem('isAdmin') === 'true';
    });

    let timeout;

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        setIsAdmin(false);
        localStorage.removeItem('logged');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
    };

    const resetTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(logout, 15 * 60 * 1000); 
    };

    const login = (name, adminStatus = false) => {
        setIsAuthenticated(true);
        setUsername(name);
        setIsAdmin(adminStatus);
        localStorage.setItem('logged', 'true');
        localStorage.setItem('username', name);
        localStorage.setItem('isAdmin', adminStatus);
        resetTimeout();
    };

    useEffect(() => {
        window.onload = resetTimeout;
        document.onmousemove = resetTimeout;
        document.onkeydown = resetTimeout;
        document.onclick = resetTimeout;
        document.onscroll = resetTimeout;

        return () => {
            clearTimeout(timeout);
        };
    }, );

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
