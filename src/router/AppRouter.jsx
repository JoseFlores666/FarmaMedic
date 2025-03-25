import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
// import { AdminRoute } from './AdminRoute';
import { Login, Home, Register } from '../pages';
import OTPInput from '../components/OTP/OTPInput';
import { ForgotPassword } from '../pages/ForgotPassword';
import Deslinde from '../pages/DocRegulatorio/Deslinde';
import Politicas from '../pages/DocRegulatorio/Politicas';
import Terminos from '../pages/DocRegulatorio/Terminos';
import Enlaces from '../pages/PerfilEmpresa/Enlaces';
import Logo from '../pages/PerfilEmpresa/Logo';
import Auditoria from '../pages/PerfilEmpresa/Auditoria';
import GestionUsuarios from '../pages/MonitorDeIncidencias/GestionUsuarios';
import { Servicios1 } from '../pages/Servicios/Servicios1';
import { ServiciosDetalles } from '../pages/Servicios/Detalles/ServiciosDetalles';
import Error404 from '../components/ErrorPages/Error404';
import Error500 from '../components/ErrorPages/Error500';
import Error400 from '../components/ErrorPages/Error400';
import GestionDoctores from '../pages/GestionMedica/GestionDoctores';
import CitasMedicas from '../pages/GestionMedica/CitasMedicas';
import GestionServicios from '../pages/GestionMedica/GestionServicios';
import HorarioCitas from '../pages/GestionMedica/HorariosCitas';
import MapaDelSitio from '../pages/AcercaDe/MapaDelSitio';
import AyudaDelSitio from '../pages/AcercaDe/AyudaDelSitio';
import Opiniones from '../pages/AcercaDe/Opiniones';
import GestionOpiniones from '../pages/GestionMedica/GestionOpiniones';
import Expedientes from '../pages/GestionMedica/GestionExpedientes';
import Recetas from '../pages/GestionMedica/RecetasMedicas';
import ActualizacionExped from '../pages/GestionMedica/ActualizacionExped';
import Empresa from '../pages/PerfilEmpresa/Empresa';
import Valores from '../pages/PerfilEmpresa/Valores';
import Servicios from '../pages/PerfilEmpresa/Servicios';
import PerfilEmpresa from '../pages/PerfilEmpresa/PerfilEmpresa';
import ContactoEmpresa from '../pages/PerfilEmpresa/ContactoEmpresa';
import PerfilUsuario from '../pages/PerfilEmpresa/PerfilUsuario';
import VerDoctores from '../pages/Clients/VerDoctores';
import ReservarCita from '../pages/Clients/ReservarCita';

export const AppRouter = () => {
	return (
		<Routes>

			<Route path='/' element={<Home />} />

			<Route path='/Inicio' element={<Home />} />

			{/* {Parte del auth login resgitro verificacion etc} */}
			<Route path='/Acceder' element={<PublicRoute><Login /></PublicRoute>} />
			<Route path='/Registrarse' element={<PublicRoute><Register /></PublicRoute>} />
			<Route path='/Verificacion' element={<PublicRoute><OTPInput /></PublicRoute>} />
			<Route path='/Recuperacion' element={<PublicRoute><ForgotPassword /></PublicRoute>} />

			{/* {Perfil Empresa} */}
			<Route path='/Inicio/Empresa/Gestion_De_Enlaces' element={<PrivateRoute><Enlaces /></PrivateRoute>} />
			<Route path='/Inicio/Empresa/Gestion_De_Servicios' element={<PrivateRoute><Servicios /></PrivateRoute>} />
			<Route path='/Inicio/Empresa/Gestion_De_Logos' element={<PrivateRoute><Logo /></PrivateRoute>} />
			<Route path='/Inicio/Empresa/Gestion_De_Valores' element={<PrivateRoute><Valores /></PrivateRoute>} />
			<Route path='/Inicio/Empresa/Gestion_De_Contacto' element={<PrivateRoute><ContactoEmpresa /></PrivateRoute>} />
			<Route path='/Inicio/Empresa/Perfil_Empresa' element={<PrivateRoute><PerfilEmpresa /></PrivateRoute>} />
			<Route path='/Inicio/Empresa' element={<PrivateRoute><Empresa /></PrivateRoute>} />

			{/* Auditoria */}
			<Route path='/Auditoria' element={<PrivateRoute><Auditoria /></PrivateRoute>} />
			<Route path='/Gestion_Usuarios' element={<PrivateRoute><GestionUsuarios /></PrivateRoute>} />
			<Route path='/Perfil' element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />

			{/* Cliente */}
			<Route path='/Inicio/Doctor' element={<PrivateRoute><VerDoctores /></PrivateRoute>}/>
			<Route path='/Inicio/Doctor/Reservar_Cita' element={<PrivateRoute><ReservarCita /></PrivateRoute>} />


			{/* {Documentos Regulatorios} */}
			<Route path='/CRUDDeslinde' element={<PrivateRoute><Deslinde /></PrivateRoute>} />
			<Route path='/CRUDPoliticas' element={<PrivateRoute><Politicas /></PrivateRoute>} />
			<Route path='/CRUDTerminos' element={<PrivateRoute><Terminos /></PrivateRoute>} />

			{/* {Parte de la gestion medica} */}
			<Route path='/Citas' element={<PrivateRoute><CitasMedicas /></PrivateRoute>} />
			<Route path='/Servicios' element={<PrivateRoute><GestionServicios /></PrivateRoute>} />
			<Route path='/Doctores' element={<PrivateRoute><GestionDoctores /></PrivateRoute>} />

			<Route path='/Expedientes' element={<PrivateRoute><Expedientes /></PrivateRoute>} />
			<Route path='/Horarios_Citas' element={<PrivateRoute><HorarioCitas /></PrivateRoute>} />
			<Route path='/Recetas' element={<PrivateRoute><Recetas /></PrivateRoute>} />
			<Route path='/Act_Expediente' element={<PrivateRoute><ActualizacionExped /></PrivateRoute>} />

			{/* {Parte de la gestion clientes} */}
			<Route path='/CRUDOpiniones' element={<PrivateRoute><GestionOpiniones /></PrivateRoute>} />

			{/*Acerca del sitio */}
			<Route path='/Inicio/Ayuda' element={<AyudaDelSitio />} />
			<Route path='/Inicio/Ayuda/Mapa_Del_Sitio' element={<MapaDelSitio />} />
			<Route path='/Inicio/Ayuda/Opiniones' element={<Opiniones />} />
			<Route path='/Inicio/Ayuda/Conocenos' element={<Opiniones />} />
			<Route path='/Inicio/Ayuda/Preguntas_Frecuentes' element={<Opiniones />} />

			{/* {Aun no decidido} */}
			<Route path='/Inicio/servicios1' element={<Servicios1 />} />
			<Route path='/serviciosdetalles' element={<ServiciosDetalles />} />

			{/* {Paginas de Error} */}
			<Route path='*' element={<Error404 />} />
			<Route path='/error500' element={<Error500 />} />
			<Route path='/error400' element={<Error400 />} />
		</Routes>
	);
};
