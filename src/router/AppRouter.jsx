import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Footer from '../components/Layout/Footer/Footer';
import { Login, About, Contact, Home, Services, Register } from '../pages';
import OTPInput from '../components/OTP/OTPInput';
import { ForgotPassword } from '../components/ForgotPassword';
import { PublicRoute } from './PublicRoute';

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
						<PrivateRoute>
							<Contact />
						</PrivateRoute>
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
