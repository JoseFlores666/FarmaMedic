import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Footer from '../components/Layout/Footer/Footer';
import { Login, About, Contact, Home, Services, Register } from '../pages';
import OTPInput from '../components/OTP/OTPInput';
import { ForgotPassword } from '../components/ForgotPassword';
export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register/>} />
				<Route path='/footer' element={<Footer />} />
				<Route path='/otpinput' element={<OTPInput />} />
				<Route path='/forgotpassword' element={<ForgotPassword />} />
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