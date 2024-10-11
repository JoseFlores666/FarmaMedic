import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Login, About, Contact, Home, Services } from '../components/pages';
import { Register } from '../components/pages/Register';
import Footer from '../components/pages/Footer';
export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path='/' element={<Login />} />

				<Route path='/login' element={<Login />} />

				<Route path='/register' element={<Register/>} />
				<Route path='/footer' element={<Footer />} />


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
