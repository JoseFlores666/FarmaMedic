import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { useAuth } from '../../context/useAuth';
import Input from '../../components/Input';
import Lottie from 'lottie-react';
import lockAnimation from '../../assets/Animation - 1729172775488.json';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [csrfToken, setCsrfToken] = useState('');
  const [errors, setErrors] = useState({}); // Estado para manejar errores

  const { correo, password, onInputChange, onResetForm } = useForm({
    correo: '',
    password: '',
  });

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error obteniendo el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const validateCorreo = (correo) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  };

  const validatePassword = (password) => {
    return password.trim() !== "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {}; // Almacena los errores

    // Validar correo
    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!validateCorreo(correo)) {
      newErrors.correo = "El correo no tiene un formato válido.";
    }

    // Validar contraseña
    if (!validatePassword(password)) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    // Si hay errores, actualiza el estado y no continúa
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
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
        <div className="col col-lg-7">
          <div className="card" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 p-lg-5 text-black">
              <form onSubmit={handleLogin}>
                <h5 className="fw-normal pb-1 text-center">Inicia sesión en tu cuenta</h5>

                <div className="d-flex justify-content-center">
                  <Lottie animationData={lockAnimation} style={{ width: '150px' }} />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="correo">Ingresa tu correo:</label>
                  <Input
                    type="email"
                    id="correo"
                    name="correo"
                    value={correo}
                    onChange={onInputChange}
                    placeholder="Introduce tu correo electrónico"
                  />
                  {errors.correo && <div className="text-danger">{errors.correo}</div>} {/* Mensaje de error */}
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">Ingresa tu contraseña:</label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onInputChange}
                    placeholder="Introduce tu contraseña"
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>} {/* Mensaje de error */}
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
                  ¿Olvidaste tu contraseña? <a href="http://localhost:5173/ForgotPassword" style={{ color: 'blue' }}>Recupérala aquí</a>
                </p>
                <p className="small text-muted mb-3" style={{ color: '#393f81' }}>
                  ¿No tienes una cuenta? <a href="http://localhost:5173/register" style={{ color: 'blue' }}>Regístrate aquí</a>
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
