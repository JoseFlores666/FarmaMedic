import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { useAuth } from '../../context/useAuth';

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth(); // Asegúrate de tener una función register en useAuth

    const { username, password, confirmPassword, onInputChange, onResetForm } = useForm({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            await register(username, password); // Asegúrate de que register maneje la lógica de registro
            navigate('/home', { replace: true });
            onResetForm();
        } catch (err) {
            console.error('Register error:', err.message);
            alert(err.message);
        }
    };

    return (
        <div className="container py-4 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                    <div className="card" style={{ borderRadius: '1rem' }}>
                        <div className="row g-0">
                            <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                <div className="card-body p-4 p-lg-5 text-black">
                                    <form onSubmit={handleRegister}>

                                        <div className="d-flex align-items-center mb-3 pb-1">
                                            <i className="fas fa-user-plus fa-2x me-3" style={{ color: '#ff6219' }}></i>
                                            <span className="h1 fw-bold mb-0">Registro</span>
                                        </div>

                                        <h5 className="fw-normal pb-1">Crea tu cuenta</h5>

                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="username">Nombre de usuario</label>
                                            <input
                                                type="text"
                                                id="username"
                                                className="form-control form-control-lg"
                                                name="username"
                                                value={username}
                                                onChange={onInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="password">Contraseña</label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="form-control form-control-lg"
                                                name="password"
                                                value={password}
                                                onChange={onInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label" htmlFor="confirmPassword">Repetir Contraseña</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                className="form-control form-control-lg"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={onInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="pt-1 mb-4">
                                            <button
                                                data-mdb-button-init
                                                data-mdb-ripple-init
                                                className="btn btn-dark btn-lg btn-block"
                                                type="submit"
                                            >
                                                Registrarse
                                            </button>
                                        </div>

                                        <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                                            Ya tienes una cuenta? <a href="/login" style={{ color: '#393f81' }}>Iniciar sesión</a>
                                        </p>
                                        <a href="#!" className="small text-muted">Terms of use.</a>
                                        <a href="#!" className="small text-muted">Privacy policy</a>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-5 d-none d-md-block">
                                <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                    alt="registration form"
                                    className="img-fluid"
                                    style={{ borderRadius: '0 1rem 1rem 0' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
