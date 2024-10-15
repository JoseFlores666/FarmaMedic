import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from '../../hook/useForm';
import { useAuth } from '../../context/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const { correo, password, onInputChange, onResetForm } = useForm({
    correo: '',
    password: '',
  });

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      if (response.ok) {
        await login(correo);
        const data = await response.json();
        console.log('Usuario logueado:', data);
        navigate('/home', { replace: true });
        onResetForm();
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error de conexión o credenciales incorrectas');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container py-4 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-lg-6">
          <div className="card" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 p-lg-5 text-black">
              <form onSubmit={handleLogin}>
                <h5 className="fw-normal pb-1">Inicia sesión en tu cuenta</h5>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="correo">Ingresa tu correo:</label>
                  <input
                    type="email"
                    id="correo"
                    className="form-control"
                    name="correo"
                    value={correo}
                    onChange={onInputChange}
                    required
                  />
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">Ingresa tu contraseña:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <button
                    className="btn btn-dark btn-lg btn-block w-100"
                    type="submit"
                  >
                    Iniciar sesión
                  </button>
                </div>

                <p className='small text-muted mb-3'>
                  ¿Olvidaste tu contraseña? <a onClick={handleForgotPassword} href="#!" style={{ color: 'blue' }}>Recupérala aquí</a>
                </p>
                <p className="small text-muted mb-3" style={{ color: '#393f81' }}>
                  ¿No tienes una cuenta? <a onClick={handleRegister} href="#!" style={{ color: 'blue' }}>Regístrate aquí</a>
                </p>

                <div className="row">
                  <div className="col-md-6">
                    <a href="#!" className="small text-muted">Términos de uso</a>
                  </div>
                  <div className="col-md-6">
                    <a href="#!" className="small text-muted">Política de privacidad</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
