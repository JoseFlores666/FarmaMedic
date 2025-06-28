import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hook/useForm';
import { useAuth } from '../../../context/useAuth';
import Lottie from 'lottie-react';
import lockAnimation from '../../../assets/Animation - 1729172775488.json';
import Swal from 'sweetalert2';
import VistaDeslinde from '../../DocRegulatorio/Informacion/VistaDeslinde';
import VistaPolitica from '../../DocRegulatorio/Informacion/VistaPolitica';
import VistaTerminos from '../../DocRegulatorio/Informacion/VistaTerminos';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { motion } from 'framer-motion';
export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated,role } = useAuth();
  const [errors, setErrors] = useState({});
  const [showDeslindeModal, setShowDeslindeModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);  // Variable para saber si el usuario es doctor

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
      let url = `${import.meta.env.VITE_API_URL}/login`; 
  
      if (isDoctor) { 
        url = `${import.meta.env.VITE_API_URL}/loginDoc`;
      }
  
      const response = await fetch(url, {
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
        if (isDoctor) {
          await login(data.doctor.nombre, data.doctor.isAdmin, data.doctor.role, data.doctor.id);
        } else {
          await login(data.user.usuario, data.user.isAdmin, data.user.role, data.user.id);
        }
  
        Swal.fire({
          title: '¡Éxito!',
          text: 'Has iniciado sesión correctamente.',
          icon: 'success',
          confirmButtonText: 'Continuar',
        }).then((result) => {
          if (result.isConfirmed) {
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
            text: errorData.message,
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
      switch (role) {
        case 1:
          navigate('/Panel_Administrativo', { replace: true });
          break;
        case 2:
          navigate('/Inicio', { replace: true });
          break;
        case 3:
          navigate('/Inicio', { replace: true });
          break;
        default:
          navigate('/Inicio', { replace: true }); 
      }
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <Container className='mt-5 mb-5'>
      <Row className="justify-content-center">
        <Col md={10} lg={11}>

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-lg overflow-hidden">
              <Row className="g-0">
                <Col md={5} className="d-none d-md-block">
                  <img
                    src="https://medicinainternaynefrologiaenmonterrey.com/assets/image/img-seo/los-mejores-doctores-en-medicina-interna.png"
                    alt="login"
                    className="img-fluid h-100"
                    style={{ objectFit: "cover" }}
                  />
                </Col>

                <Col md={7} className="d-flex align-items-center">
                  <Card.Body className="p-5">
                    <h3 className="fw-bold text-center text-primary mb-3">¡Bienvenido!</h3>
                    <p className="text-muted text-center">Inicia sesión en tu cuenta</p>

                    <div className="d-flex justify-content-center mb-3">
                      <Lottie animationData={lockAnimation} style={{ width: "100px" }} />
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label={isDoctor ? "Doctor" : "Usuario"} 
                        checked={isDoctor}
                        onChange={() => setIsDoctor(!isDoctor)} 
                      />
                    </Form.Group>

                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          name="correo"
                          placeholder="Introduce tu correo"
                          onChange={(e) => {
                            onInputChange(e);
                            handleValidation(e);
                          }}
                        />
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: errors.password ? 1 : 0, height: errors.password ? "20px" : "0px" }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden", minHeight: "20px" }}
                        >
                          {errors.correo && <div className="text-danger">{errors.correo}</div>}
                        </motion.div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Introduce tu contraseña"
                            onChange={(e) => {
                              onInputChange(e);
                              handleValidation(e);
                            }}
                          />
                          <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </Button>
                        </InputGroup>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: errors.password ? 1 : 0, height: errors.password ? "20px" : "0px" }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden", minHeight: "20px" }}
                        >
                          {errors.password && <div className="text-danger">{errors.password}</div>}
                        </motion.div>
                      </Form.Group>

                      <Button variant="primary" className="w-100 mb-3" type="submit">
                        Iniciar sesión
                      </Button>

                      <div className="text-center">
                        <NavLink to="/Recuperacion" className="small ">¿Olvidaste tu contraseña?</NavLink>
                      </div>
                      <div className="text-center">
                        <NavLink to="/Registrarse" className="small ">¿No tienes cuenta? Regístrate aquí</NavLink>
                      </div>

                      <Row className="mt-4 text-center">
                        <Col md={4}>
                          <a href="#" className="small " onClick={(e) => { e.preventDefault(); openDeslindeModal3(); }}>
                            Términos y Condiciones
                          </a>
                          <VistaTerminos showModal={showModal3} onClose={closeDeslindeModal3} />
                        </Col>
                        <Col md={4}>
                          <a href="#" className="small " onClick={(e) => { e.preventDefault(); openDeslindeModal2(); }}>
                            Política de Privacidad
                          </a>
                          <VistaPolitica showModal={showModal2} onClose={closeDeslindeModal2} />
                        </Col>
                        <Col md={4}>
                          <a href="#" className="small " onClick={(e) => { e.preventDefault(); openDeslindeModal(); }}>
                            Deslinde Legal
                          </a>
                          <VistaDeslinde showModal={showDeslindeModal} onClose={closeDeslindeModal} />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </motion.div>

        </Col>
      </Row>
    </Container>
  );
};
