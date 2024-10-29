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
import Eslogan from '../pages/PerfilEmpresa/Eslogan';
import Logo from '../pages/PerfilEmpresa/Logo';
import PageTitle from '../pages/PerfilEmpresa/TittlePage';
import Contact from '../pages/PerfilEmpresa/Contact';
import { Home2 } from '../pages/Home2';

export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route
					path='/'
					element={
						<PublicRoute>
							<Home2 />
						</PublicRoute>
					}
				/>
				<Route
					path='/login'
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>
				<Route
					path='/register'
					element={
						<PublicRoute>
							<Register />
						</PublicRoute>
					}
				/>
				<Route
					path='/otpinput'
					element={
						<PublicRoute>
							<OTPInput />
						</PublicRoute>
					} />

				<Route
					path='/forgotpassword'
					element={
						<PublicRoute>
							<ForgotPassword />
						</PublicRoute>
					} />
				<Route
					path='/home'
					element={
						<PrivateRoute>
							<Home />
						</PrivateRoute>
					}
				/>
				<Route
					path='/home2'
					element={
						<PublicRoute>
							<Home />
						</PublicRoute>
					}
				/>
				<Route
					path='/Enlaces'
					element={
						<AdminRoute>
							<Enlaces />
						</AdminRoute>
					}
				/>
				<Route
					path='/Eslogan'
					element={
						<AdminRoute>
							<Eslogan />
						</AdminRoute>
					}
				/>
				<Route
					path='/Logo'
					element={
						<AdminRoute>
							<Logo />
						</AdminRoute>
					}
				/>
					<Route
					path='/PageTittle'
					element={
						<AdminRoute>
							<PageTitle />
						</AdminRoute>
					}
				/>
				<Route
					path='/CRUDDeslinde'
					element={
						<AdminRoute>
							<Deslinde />
						</AdminRoute>
					}
				/>
				<Route
					path='/CRUDPoliticas'
					element={
						<AdminRoute>
							<Politicas />
						</AdminRoute>
					}
				/>
				<Route
					path='/CRUDTerminos'
					element={
						<AdminRoute>
							<Terminos />
						</AdminRoute>
					}
				/>
				<Route
					path='/about'
					element={
						<PrivateRoute>
							<About />
						</PrivateRoute>
					}
				/>
				<Route
					path='/contact'
					element={
						<AdminRoute>
							<Contact />
						</AdminRoute>
					}
				/>
				<Route
					path='/services'
					element={
						<PrivateRoute>
							<Services />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
};
