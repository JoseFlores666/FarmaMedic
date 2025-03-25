import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PropTypes from 'prop-types';

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); 

    return isAuthenticated ? children : <Navigate to="/Acceder" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};