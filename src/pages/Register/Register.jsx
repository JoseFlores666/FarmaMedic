import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { checkPasswordCompromise, containsCommonPatterns } from '../../services/passwordService';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from "react-password-checklist";
import ReCAPTCHA from 'react-google-recaptcha';
import Input from '../../components/Input';
import { validateUsuario, validateNombre, validateApellidoPaterno, validateApellidoMaterno, validateEdad, validateTelefono, validateCorreo, validatePassword, validateConfirmPassword, validateGenero } from '../../validations/validacionRegistro';
import Swal from 'sweetalert2';
import VistaDeslinde from '../DocRegulatorio/Informacion/VistaDeslinde';
import VistaPolitica from '../DocRegulatorio/Informacion/VistaPolitica';
import VistaTerminos from '../DocRegulatorio/Informacion/VistaTerminos';

export const Register = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [showDeslindeModal, setShowDeslindeModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);

    const [captchaValue, setCaptchaValue] = useState(null);
    // const [csrfToken, setCsrfToken] = useState('');
    const { usuario, nombre, apellidoPaterno, apellidoMaterno, edad, telefono, genero, correo, password, confirmPassword, onInputChange, onResetForm } = useForm({
        usuario: '',
        genero: '',
        nombre: '',
        edad: '',
        telefono: '',
        correo: '',
        password: '',
        confirmPassword: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
    });


    const openDeslindeModal = () => {
        setShowDeslindeModal(true);
    };

    const closeDeslindeModal = () => {
        setShowDeslindeModal(false);
    };

    const openDeslindeModal2 = () => {
        setShowModal2(true);
    };

    const closeDeslindeModal2 = () => {
        setShowModal2(false);
    };

    const openDeslindeModal3 = () => {
        setShowModal3(true);
    };

    const closeDeslindeModal3 = () => {
        setShowModal3(false);
    };



    // useEffect(() => {
    //     const fetchCsrfToken = async () => {
    //         try {
    //             const response = await fetch('http://localhost:4000/api/csrf-token', {
    //                 credentials: 'include',
    //             });
    //             const data = await response.json();
    //             setCsrfToken(data.csrfToken);
    //         } catch (error) {
    //             console.error('Error obteniendo el token CSRF:', error);
    //         }
    //     };
    //     fetchCsrfToken();
    // }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        let newErrors = {};

        newErrors.usuario = validateUsuario(usuario);
        newErrors.nombre = validateNombre(nombre);
        newErrors.apellidoPaterno = validateApellidoPaterno(apellidoPaterno);
        newErrors.apellidoMaterno = validateApellidoMaterno(apellidoMaterno);
        newErrors.edad = validateEdad(edad);
        newErrors.telefono = validateTelefono(telefono);
        newErrors.correo = validateCorreo(correo);
        newErrors.password = validatePassword(password);
        newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
        newErrors.genero = validateGenero(genero);

        if (containsCommonPatterns(password)) {
            newErrors.password = "La contraseña contiene patrones comunes como '12345' o 'password'.";
        }

        const isCompromised = await checkPasswordCompromise(password);
        if (isCompromised) {
            newErrors.password = "La contraseña ha sido comprometida. Por favor, elige una diferente.";
        }

        if (!captchaValue) {
            newErrors.captcha = "Por favor, verifica que no eres un robot.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).some((key) => newErrors[key])) {
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    usuario,
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    edad,
                    telefono,
                    genero,
                    correo,
                    password,
                    captcha: captchaValue,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Registro exitoso. Un codigo de verificacion de ha enviado a tu correo.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
                navigate('/otpInput', {
                    state: {
                        replace: true,
                        correo: correo
                    },
                    replace: true
                });
                onResetForm();
            } else {
                const errorMessage = await response.text();
                alert(`Error al registrarse: ${errorMessage}`);
            }
        } catch (err) {
            console.error('Register error:', err.message);
            alert('Error de conexión al servidor. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="container py-4 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-lg-7 ">
                    <div className="card shadow-lg" style={{ borderRadius: '1rem', border: '1px solid' }}>
                        <div className="card-body p-4 p-lg-5">
                            <form onSubmit={handleRegister}>
                                <h5 className="fw-normal text-center pb-1">Regístrate</h5>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="usuario">Usuario:</label>
                                        <Input
                                            id="usuario"
                                            name="usuario"
                                            value={usuario}
                                            onChange={onInputChange}
                                            placeholder={"Introduce tu usuario"}
                                            min={3}
                                            max={15}
                                        />
                                        {errors.usuario && <div className="text-danger">{errors.usuario}</div>}

                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="nombre">Nombre:</label>
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            value={nombre}
                                            onChange={onInputChange}
                                            placeholder={"Introduce tu nombre"}
                                        />
                                        {errors.nombre && <div className="text-danger">{errors.nombre}</div>}

                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
                                        <Input
                                            id="apellidoPaterno"
                                            name="apellidoPaterno"
                                            value={apellidoPaterno}
                                            onChange={onInputChange}
                                            placeholder={"Apellido paterno"}
                                        />
                                        {errors.apellidoPaterno && <div className="text-danger">{errors.apellidoPaterno}</div>}

                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="apellidoMaterno">Apellido Materno:</label>
                                        <Input
                                            id="apellidoMaterno"
                                            name="apellidoMaterno"
                                            value={apellidoMaterno}
                                            onChange={onInputChange}
                                            placeholder={"Apellido Materno"}
                                        />
                                        {errors.apellidoMaterno && <div className="text-danger">{errors.apellidoMaterno}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="edad">Edad:</label>
                                        <Input
                                            type="number"
                                            id="edad"
                                            name="edad"
                                            value={edad}
                                            onChange={onInputChange}
                                            min={18}
                                            max={100}
                                            placeholder={"Introduce tu edad"}
                                        />
                                        {errors.edad && <div className="text-danger">{errors.edad}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="telefono">Número de Teléfono/Celular:</label>
                                        <Input
                                            id="telefono"
                                            name="telefono"
                                            value={telefono}
                                            onChange={onInputChange}
                                            placeholder={"Telefono o Celular"}
                                            maxLength={10}
                                        />
                                        {errors.telefono && <div className="text-danger">{errors.telefono}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="genero">Género:</label>

                                    <div className="d-flex align-items-center mb-2">
                                        <div className="form-check me-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="genero"
                                                id="generoMasculino"
                                                value="Masculino"
                                                checked={genero === 'Masculino'}
                                                onChange={onInputChange}
                                            />
                                            <label className="form-check-label" htmlFor="generoMasculino">
                                                Masculino
                                            </label>
                                        </div>

                                        <div className="form-check me-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="genero"
                                                id="generoFemenino"
                                                value="Femenino"
                                                checked={genero === 'Femenino'}
                                                onChange={onInputChange}
                                            />
                                            <label className="form-check-label" htmlFor="generoFemenino">
                                                Femenino
                                            </label>
                                        </div>

                                        <div className="form-check d-flex align-items-center">
                                            <input
                                                className="form-check-input me-2"
                                                type="radio"
                                                name="genero"
                                                id="generoOtro"
                                                value="Otro"
                                                checked={genero === 'Otro'}
                                                onChange={onInputChange}
                                            />
                                            <label className="form-check-label me-2" htmlFor="generoOtro">
                                                Otro:
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${genero === 'Otro' ? '' : 'd-none'}`}
                                                placeholder="Especifica"
                                                onChange={onInputChange}
                                                name="generoPersonalizado"
                                            />
                                        </div>
                                    </div>
                                    {errors.genero && <div className="text-danger">{errors.genero}</div>}

                                </div>

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="correo">Ingresa tu correo electrónico:</label>
                                    <Input
                                        id="correo"
                                        name="correo"
                                        value={correo}
                                        onChange={onInputChange}
                                        placeholder={"Introduce tu correo"}
                                    />
                                    {errors.correo && <div className="text-danger">{errors.correo}</div>}
                                </div>

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="password">Ingresa tu contraseña:</label>
                                    <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onInputChange}
                                        minLength={8}
                                        maxLength={50}
                                        placeholder={"Introduce tu contraseña"}
                                    />
                                    {password && (
                                        <PasswordStrengthBar
                                            password={password}
                                            shortScoreWord="Muy Corta"
                                            scoreWords={['Muy Corta', 'Corta', 'Bien', 'Fuerte', 'Muy fuerte']}
                                        />
                                    )}
                                    {errors.password && <div className="text-danger">{errors.password}</div>}

                                    {password && (
                                        <PasswordChecklist
                                            rules={["minLength", "specialChar", "number", "capital"]}
                                            minLength={8}
                                            value={password}
                                            messages={{
                                                minLength: "La contraseña tiene más de 8 caracteres.",
                                                specialChar: "La contraseña tiene caracteres especiales.",
                                                number: "La contraseña tiene un número.",
                                                capital: "La contraseña tiene una letra mayúscula.",
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="confirmPassword">Repite tu contraseña:</label>
                                    <Input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={onInputChange}
                                        minLength={8}
                                        maxLength={50}
                                        placeholder={"Repite tu contraseña"}
                                    />
                                    {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                                    {password && confirmPassword && (
                                        <PasswordChecklist
                                            rules={["match"]}
                                            value={password}
                                            valueAgain={confirmPassword}
                                            messages={{
                                                match: "Las contraseñas coinciden."
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="mb-3 d-flex flex-column align-items-center">
                                    <ReCAPTCHA
                                        sitekey="6LfrrmAqAAAAAO2vOQixcHrRZiYkPDOVAExv4MaE"
                                        onChange={(value) => setCaptchaValue(value)}
                                    />
                                    {errors.captcha && <div className="text-danger mt-2">{errors.captcha}</div>}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id="terminos"
                                            className="me-2"
                                            required
                                        />
                                        <label htmlFor="terminos" className="small text-muted">
                                        <a href="#!" className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal3(); }}>
                                        Acepto los Términos y Condiciones</a>
                                        </label>
                                        <VistaTerminos showModal={showModal3} onClose={closeDeslindeModal3} />

                                    </div>

                                    <div className="col-md-6 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id="privacidad"
                                            className="me-2"
                                            required
                                        />
                                        <label htmlFor="privacidad" className="small text-muted">
                                        <a href="#!" className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal2(); }}>
                                        Acepto la Política de privacidad</a>
                                        </label>
                                        <VistaPolitica showModal={showModal2} onClose={closeDeslindeModal2} />
                                    </div>
                                    <div>
                                        <div className="text-center align-items-center">
                                            <input
                                                type="checkbox"
                                                id="deslinde"
                                                className="me-2"
                                                required
                                            />
                                            <label htmlFor="deslinde" className="small text-muted">
                                                <a href="#!" className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal(); }}>
                                                    Acepto el deslinde legal
                                                </a>
                                            </label>
                                        </div>
                                        <VistaDeslinde showModal={showDeslindeModal} onClose={closeDeslindeModal} />
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <button
                                        className="btn btn-primary btn-lg btn-block w-100"
                                        type="submit"
                                    >
                                        Registrarse
                                    </button>
                                </div>

                                <p className='small text-muted mb-3'>
                                    ¿Olvidaste tu contraseña? <a href="http://localhost:5173/ForgotPassword" style={{ color: 'blue' }}>Recupérala aquí</a>
                                </p>
                                <p className="small text-muted mb-3" style={{ color: '#393f81' }}>
                                    ¿Ya tienes una cuenta? <a href="http://localhost:5173/login" style={{ color: 'blue' }}>Inicia sesion aquí</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
