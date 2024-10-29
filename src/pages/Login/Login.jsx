import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { useAuth } from '../../context/useAuth';
import Input from '../../components/Input';
import Lottie from 'lottie-react';
import lockAnimation from '../../assets/Animation - 1729172775488.json';
import Swal from 'sweetalert2';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  // const [csrfToken, setCsrfToken] = useState('');
  const [errors, setErrors] = useState({});

  const { correo, password, onInputChange, onResetForm } = useForm({
    correo: '',
    password: '',
  });

  // useEffect(() => {
  //   const fetchCsrfToken = async () => {
  //     try {
  //       const response = await fetch('https://back-farmam.onrender.com/api/csrf-token', {
  //         credentials: 'include',
  //       });
  //       const data = await response.json();
  //       // setCsrfToken(data.csrfToken);
  //     } catch (error) {
  //       console.error('Error obteniendo el token CSRF:', error);
  //     }
  //   };
  //   fetchCsrfToken();
  // }, []);

  const validateCorreo = (correo) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  };

  const validatePassword = (password) => {
    return password.trim() !== '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!correo.trim()) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!validateCorreo(correo)) {
      newErrors.correo = "El correo no tiene un formato válido.";
    }

    if (!validatePassword(password)) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('https://back-farmam.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.usuario, data.isAdmin);

        Swal.fire({
          title: '¡Éxito!',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          confirmButtonText: 'Continuar',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/home', { replace: true });
            onResetForm();
          }
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Credenciales incorrectas. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
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
          <div className="card shadow-lg" style={{ borderRadius: '1rem', border: '1px solid' }}>
            <div className="card-body p-4 p-lg-5">
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
                  {errors.correo && <div className="text-danger">{errors.correo}</div>}
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
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <div className="mb-3">
                  <button
                    className="btn btn-primary btn-lg btn-block w-100"
                    type="submit"
                  >
                    Iniciar sesión
                  </button>
                </div>

                <p className='small text-muted mb-3'>
                  ¿Olvidaste tu contraseña? <a href="https://back-farmam.onrender.com/ForgotPassword" style={{ color: 'blue' }}>Recupérala aquí</a>
                </p>
                <p className="small text-muted mb-3" style={{ color: '#393f81' }}>
                  ¿No tienes una cuenta? <a href="https://back-farmam.onrender.com/register" style={{ color: 'blue' }}>Regístrate aquí</a>
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
