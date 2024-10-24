import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import PropTypes from 'prop-types';

export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
