import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";

export const Servicios1 = () => {
  return (
    <div className="container">
      <Breadcrumbs/>

      <h1>Bienvenido a Servicios</h1>
      
      <Link to="/serviciosdetalles">
        <button className="btn btn-primary mb-3">Solicitar Cita</button>
      </Link>
    </div>
  );
};
