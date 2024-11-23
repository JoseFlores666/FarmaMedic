import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { useAuth } from '../../context/useAuth';
import Input from '../../components/Input';
import Lottie from 'lottie-react';
import lockAnimation from '../../assets/Animation - 1729172775488.json';
import Swal from 'sweetalert2';
import VistaDeslinde from '../DocRegulatorio/Informacion/VistaDeslinde';
import VistaPolitica from '../DocRegulatorio/Informacion/VistaPolitica';
import VistaTerminos from '../DocRegulatorio/Informacion/VistaTerminos';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [errors, setErrors] = useState({});
  const [showDeslindeModal, setShowDeslindeModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { correo, password, onInputChange, onResetForm } = useForm({
    correo: '',
    password: '',
  });

  const openDeslindeModal = () => setShowDeslindeModal(true);
  const closeDeslindeModal = () => setShowDeslindeModal(false);
  const openDeslindeModal2 = () => setShowModal2(true);
  const closeDeslindeModal2 = () => setShowModal2(false);
  const openDeslindeModal3 = () => setShowModal3(true);
  const closeDeslindeModal3 = () => setShowModal3(false);

  const validateCorreo = (correo) => {
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexCorreo.test(correo);
  };

  const validatePassword = (password) => {
    return password.trim() !== '';
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "correo") {
      if (!value.trim()) {
        error = "El correo es obligatorio.";
      } else if (!validateCorreo(value)) {
        error = "El correo no tiene un formato válido.";
      }
    }

    if (name === "password") {
      if (!validatePassword(value)) {
        error = "La contraseña es obligatoria.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!correo) newErrors.correo = "El correo es obligatorio.";
    else if (!validateCorreo(correo)) newErrors.correo = "Formato de correo inválido.";
  
    if (!password) newErrors.password = "La contraseña es obligatoria.";
    else if (!validatePassword(password)) newErrors.password = "Formato de contraseña inválido.";
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;
  
    try {
      const response = await fetch('https://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        const errorData = await response.json();
  
        if (response.status === 403 && errorData.message.includes('bloqueada')) {
          Swal.fire({
            title: 'Cuenta Bloqueada',
            text: errorData.message,  
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: errorData.message || 'Credenciales incorrectas o error desconocido.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
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
                    onChange={(e) => {
                      onInputChange(e);
                      handleValidation(e);
                    }}
                    placeholder="Introduce tu correo electrónico"
                  />
                  {errors.correo && <div className="text-danger">{errors.correo}</div>}
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">Ingresa tu contraseña:</label>
                  <div className='input-group'>

                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        onInputChange(e);
                        handleValidation(e);
                      }}
                      placeholder="Introduce tu contraseña"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >

                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
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
                  ¿Olvidaste tu contraseña? <NavLink to="/forgotpassword">Recuperala aquí</NavLink>
                </p>
                <p className="small text-muted mb-3">
                  ¿No tienes una cuenta? <NavLink to="/register">Registrate aquí</NavLink>
                </p>

                <div className="row mb-3  text-center">
                  <div className="col-md-4 ">
                    <label htmlFor="terminos" className="small text-muted">
                      <a className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal3(); }}>
                        Términos y Condiciones</a>
                    </label>
                    <VistaTerminos showModal={showModal3} onClose={closeDeslindeModal3} />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="privacidad" className="small text-muted">
                      <a className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal2(); }}>
                        Política de privacidad</a>
                    </label>
                    <VistaPolitica showModal={showModal2} onClose={closeDeslindeModal2} />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="deslinde" className="small text-muted">
                      <a className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal(); }}>
                        Deslinde legal
                      </a>
                    </label>
                    <VistaDeslinde showModal={showDeslindeModal} onClose={closeDeslindeModal} />
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
