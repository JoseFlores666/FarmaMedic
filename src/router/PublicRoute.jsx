import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PropTypes from 'prop-types';

export const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); 

    return isAuthenticated ? <Navigate to="/Inicio" replace /> : children; 
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
