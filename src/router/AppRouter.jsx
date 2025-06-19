import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Home } from '../pages';

import { Error400, Error500, Error404 } from '../components/ErrorPages';
import { Register, Login, OTPInput, ForgotPassword } from '../pages/auth';

import Deslinde from '../pages/DocRegulatorio/Deslinde';
import Politicas from '../pages/DocRegulatorio/Politicas';
import Terminos from '../pages/DocRegulatorio/Terminos';
import Enlaces from '../pages/PerfilEmpresa/Enlaces';
import Logo from '../pages/PerfilEmpresa/Logo';
import Auditoria from '../pages/PerfilEmpresa/Auditoria';
import GestionUsuarios from '../pages/MonitorDeIncidencias/GestionUsuarios';

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
import ReservarCita from '../pages/Clients/ExpedienteUsuario';
import ExpedienteUsuario from '../pages/Clients/ExpedienteUsuario';
import Busqueda from '../pages/Clients/Busqueda';
import PanelAdmin from '../pages/Admin/PanelAdmin';
import Conocenos from '../pages/Clients/Conocenos';
import HorarioEmpresa from '../pages/Clients/HorarioEmpresa';
import VincularWearOS from '../pages/WearOs/vincularWearOs';
import { ErrorBoundary } from 'react-error-boundary';
export const AppRouter = () => {
	return (
		<ErrorBoundary FallbackComponent={Error500}>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/Inicio' element={<Home />} />
				{/* {Parte del auth login resgitro verificacion etc} */}
				<Route path='/Acceder' element={<Login />} />
				<Route path='/Registrarse' element={<Register />} />
				<Route path='/Verificacion' element={<OTPInput />} />
				<Route path='/Recuperacion' element={<ForgotPassword />} />

				{/* {Perfil Empresa} */}
				<Route path='/Inicio/Empresa/Gestion_De_Enlaces' element={<PrivateRoute><Enlaces /></PrivateRoute>} />
				<Route path='/Inicio/Empresa/Gestion_De_Servicios' element={<PrivateRoute><Servicios /></PrivateRoute>} />
				<Route path='/Inicio/Empresa/Gestion_De_Logos' element={<PrivateRoute><Logo /></PrivateRoute>} />
				<Route path='/Inicio/Empresa/Gestion_De_Valores' element={<PrivateRoute><Valores /></PrivateRoute>} />
				<Route path='/Inicio/Empresa/Gestion_De_Contacto' element={<PrivateRoute><ContactoEmpresa /></PrivateRoute>} />
				<Route path='/Inicio/Empresa/Perfil_Empresa' element={<PrivateRoute><PerfilEmpresa /></PrivateRoute>} />
				<Route path='/Inicio/Empresa' element={<PrivateRoute><Empresa /></PrivateRoute>} />
				<Route path='/Inicio/Horario_Empresa' element={<PrivateRoute><HorarioEmpresa /></PrivateRoute>} />

				{/* Auditoria */}
				<Route path='/Auditoria' element={<PrivateRoute><Auditoria /></PrivateRoute>} />
				<Route path='/Gestion_Usuarios' element={<PrivateRoute><GestionUsuarios /></PrivateRoute>} />
				<Route path='/Perfil' element={<PrivateRoute><PerfilUsuario /></PrivateRoute>} />

				{/* Cliente */}
				<Route path='/Inicio/Doctor' element={<PrivateRoute><VerDoctores /></PrivateRoute>} />
				<Route path='/Inicio/Doctor/Reservar_Cita' element={<PrivateRoute><ReservarCita /></PrivateRoute>} />
				<Route path='/Inicio/Expediente' element={<PrivateRoute><ExpedienteUsuario /></PrivateRoute>} />
				<Route path='/Inicio/Busqueda' element={<Busqueda />} />


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
				<Route path='/Inicio/Ayuda/Conocenos' element={<Conocenos />} />
				<Route path='/Inicio/Ayuda/Preguntas_Frecuentes' element={<Opiniones />} />

				{/* rutas de Administrador */}
				<Route path='/Panel_Administrativo' element={<PanelAdmin />} />

				{/* rutas de Administrador */}
				<Route path='/Wear_OS' element={<VincularWearOS />} />


				{/* {Paginas de Error} */}
				<Route path='*' element={<Error404 />} />
				<Route path='/error400' element={<Error400 />} />
			</Routes>
		</ErrorBoundary>
	);
};
