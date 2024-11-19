import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { AdminRoute } from './AdminRoute';
import { Login, About, Home, Services, Register } from '../pages';
import OTPInput from '../components/OTP/OTPInput';
import { ForgotPassword } from '../pages/ForgotPassword';
import Deslinde from '../pages/DocRegulatorio/Deslinde';
import Politicas from '../pages/DocRegulatorio/Politicas';
import Terminos from '../pages/DocRegulatorio/Terminos';
import Enlaces from '../pages/PerfilEmpresa/Enlaces';
import Logo from '../pages/PerfilEmpresa/Logo';
import Contact from '../pages/PerfilEmpresa/Contact';
import { Home2 } from '../pages/Home2';
import Auditoria from '../pages/PerfilEmpresa/Auditoria';
import GestionUsuarios from '../pages/MonitorDeIncidencias/GestionUsuarios';

export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<PublicRoute><Home2 /></PublicRoute>} />
				<Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
				<Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
				<Route path='/otpinput' element={<PublicRoute><OTPInput /></PublicRoute>} />
				<Route path='/forgotpassword' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
				<Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
				<Route path='/home2' element={<PublicRoute><Home /></PublicRoute>} />
				<Route path='/Enlaces' element={<AdminRoute><Enlaces /></AdminRoute>} />
				<Route path='/Logo' element={<AdminRoute><Logo /></AdminRoute>} />
				<Route path='/CRUDDeslinde' element={<AdminRoute><Deslinde /></AdminRoute>}/>
				<Route path='/CRUDPoliticas' element={<AdminRoute><Politicas /></AdminRoute>}/>
				<Route path='/CRUDTerminos' element={<AdminRoute><Terminos /></AdminRoute>}/>
				<Route path='/about' element={<PrivateRoute><About /></PrivateRoute>}/>
				<Route path='/contact' element={<AdminRoute><Contact /></AdminRoute>}/>
				<Route path='/auditoria' element={<AdminRoute><Auditoria /></AdminRoute>}/>
				<Route path='/services' element={<PrivateRoute><Services /></PrivateRoute>}/>
				<Route path='/gestionUsuarios' element={<AdminRoute><GestionUsuarios /></AdminRoute>}/>
			</Routes>
		</>
	);
};
