import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('logged') === 'true';
    });

    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username');
    });

    const login = (name) => {
        setIsAuthenticated(true);
        setUsername(name);
        localStorage.setItem('logged', 'true');
        localStorage.setItem('username', name);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUsername(null);
        localStorage.removeItem('logged');
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, 
};