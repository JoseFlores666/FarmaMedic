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
import { AsignarServicios } from '../pages/GestionMedica/AsigancionServ';
import AvisoPriv from '../pages/DocRegulatorio/AvisoPriv';
import { NoticiasAdmin } from '../pages/noticias/NoticiasAdmin';
import NoticiasPost from '../pages/noticias/NoticiasAll';
import Resultados from '../pages/Predicciones/Resultados';
import ServicioDetalle from '../pages/servicios/ServicioDetalle';
import Ruleta from '../pages/Clients/Ruleta';
import AdminRuleta from '../pages/Admin/AdminRuleta';
import MisReservaciones from '../pages/Clients/MisReservaciones';
import MisRecetas from '../pages/Clients/MisRecetas';

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
				<Route path='/Inicio/Ruleta' element={<Ruleta />} />
				<Route path='/Inicio/Reservaciones' element={<MisReservaciones />} />
				<Route path="/Inicio/:id" element={<ServicioDetalle/>} />
				<Route path='/Inicio/Editar_Ruleta' element={<AdminRuleta/>}/>
				<Route path='/Inicio/Mis_Recetas' element={<MisRecetas/>}/>

				{/* {Documentos Regulatorios} */}
				<Route path='/Home/Deslinde_Legal' element={<PrivateRoute><Deslinde /></PrivateRoute>} />
				<Route path='/Home/Politicas_De_Privacidad' element={<PrivateRoute><Politicas /></PrivateRoute>} />
				<Route path='/Home/Terminos_Y_Condiciones' element={<PrivateRoute><Terminos /></PrivateRoute>} />
				<Route path='/Home/Aviso_De_Privacidad' element={<PrivateRoute><AvisoPriv /></PrivateRoute>} />

				{/* {Parte de la gestion medica} */}
				<Route path='/Citas' element={<PrivateRoute><CitasMedicas /></PrivateRoute>} />
				<Route path='/Servicios' element={<PrivateRoute><GestionServicios /></PrivateRoute>} />
				<Route path='/Doctores' element={<PrivateRoute><GestionDoctores /></PrivateRoute>} />

				<Route path='/Expedientes' element={<PrivateRoute><Expedientes /></PrivateRoute>} />
				<Route path='/Horarios_Citas' element={<PrivateRoute><HorarioCitas /></PrivateRoute>} />
				<Route path='/Recetas' element={<PrivateRoute><Recetas /></PrivateRoute>} />
				<Route path='/Asignar_Servicios' element={<PrivateRoute><AsignarServicios /></PrivateRoute>} />

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
				<Route path='/Inicio/NoticiasForm' element={<NoticiasAdmin />} />
				<Route path='/Inicio/Noticias' element={<NoticiasPost />} />

				{/* rutas de Administrador */}
				<Route path='/Wear_OS' element={<VincularWearOS />} />

				{/* Proyecto Doc */}
				<Route path='/Predicciones' element={<Resultados />} />

				{/* {Paginas de Error} */}
				<Route path='*' element={<Error404 />} />
				<Route path='/error400' element={<Error400 />} />
			</Routes>
		</ErrorBoundary>
	);
};
