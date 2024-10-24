import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Footer from '../components/Layout/Footer/Footer';
import { Login, About, Contact, Home, Services, Register } from '../pages';
import OTPInput from '../components/OTP/OTPInput';
import { ForgotPassword } from '../components/ForgotPassword';
import { PublicRoute } from './PublicRoute';
import { AdminRoute } from './AdminRoute';
import Deslinde from '../pages/Deslinde';
import Politicas from '../pages/Politicas';
import Terminos from '../pages/Terminos';
import Enlaces from '../pages/Enlaces';
import Eslogan from '../pages/Eslogan';
import Logo from '../pages/Logo';
import PageTitle from '../pages/TittlePage';

export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route
					path='/'
					element={
						<PublicRoute>
							<Login />
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
					path='/footer'
					element={
						<PublicRoute>
							<Footer />
						</PublicRoute>
					} />
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
