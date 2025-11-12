// src/components/Layout/Menu/Menu.jsx
import { useAuth } from "../../../context/useAuth";
import { Navigate } from "react-router-dom";
import { Dashboard, Navbar2 } from "../../Layout";

export const Menu = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navbar2 />;

  switch (role) {
    case 1:
    case 3:
      return <Dashboard />;
    case 2:
      return <Navbar2 />;
    default:
      return <Navigate to="/Inicio" replace />;
  }
};
