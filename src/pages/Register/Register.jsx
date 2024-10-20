import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { checkPasswordCompromise, containsCommonPatterns } from '../../services/passwordService';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from "react-password-checklist";
import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from 'emailjs-com';
import { nanoid } from 'nanoid';
import Input from '../../components/Input';
import { validateUsuario, validateNombre, validateApellidoPaterno, validateApellidoMaterno, validateEdad, validateTelefono, validateCorreo, validatePassword, validateConfirmPassword, validatePregunta, validateGenero } from '../../validations/validacionRegistro';

export const Register = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [captchaValue, setCaptchaValue] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const { usuario, nombre, apellidoPaterno, apellidoMaterno, edad, telefono, genero, correo, password, confirmPassword, pregunta, respuestaSecreta, onInputChange, onResetForm } = useForm({
        usuario: '',
        genero: '',
        nombre: '',
        apellidos: '',
        edad: '',
        telefono: '',
        correo: '',
        password: '',
        confirmPassword: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        pregunta: '',
        respuestaSecreta: ''
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
        newErrors.pregunta = validatePregunta(pregunta);
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

        if (Object.keys(newErrors).length > 0) return;

        const verificationToken = nanoid(6);

        const sendVerificationEmail = (token, correo) => {
            const templateParams = {
                to_name: nombre,
                verification_token: token,
                email: correo,
                company_name: 'FarmaMedic'
            };

            emailjs.send(
                'service_v6e3kyv',
                'template_l1efa7s',
                templateParams,
                'sRaz79F3ov2M-1wak'
            ).then((response) => {
                console.log('Correo enviado exitosamente', response.status, response.text);
            }).catch((error) => {
                console.error('Error al enviar correo de verificación:', error);
            });
        };

        try {
            const response = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    usuario,
                    nombre,
                    apellidoMaterno,
                    apellidoPaterno,
                    edad,
                    telefono,
                    correo,
                    password,
                    captcha: captchaValue,
                    verification_token: verificationToken
                }),
            });

            if (response.ok) {
                sendVerificationEmail(verificationToken, correo);
                alert('Registro exitoso! Un código de verificación ha sido enviado a tu correo.');
                navigate('/otpInput', { replace: true, state: { correo } });
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
                <div className="col col-lg-7">
                    <div className="card" style={{ borderRadius: '1rem' }}>
                        <div className="card-body p-4 p-lg-5 text-black">
                            <form onSubmit={handleRegister}>
                                <h5 className="fw-normal pb-1">Regístrate</h5>

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

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="respuestaSecreta">Método de recuperación de contraseña:</label>
                                    <select
                                        id="miSelect"
                                        value={pregunta}
                                        onChange={onInputChange}
                                        className="form-select"
                                        name="pregunta"
                                    >
                                        <option value="">Selecciona una pregunta</option>
                                        <option value="1">¿Pregunta 1?</option>
                                        <option value="2">¿Pregunta 2?</option>
                                        <option value="3">¿Pregunta 3?</option>
                                    </select>

                                    {pregunta && (
                                        <div className='mb-3'>
                                            <Input
                                                type="text"
                                                id="respuestaSecreta"
                                                name="respuestaSecreta"
                                                value={respuestaSecreta}
                                                onChange={onInputChange}
                                                placeholder={"Solo tú sabrás la respuesta"}
                                            />
                                        </div>
                                    )}
                                    {errors.pregunta && <div className="text-danger">{errors.pregunta}</div>}

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
                                            <a href="#!" className="text-muted">Acepto los Términos y Condiciones</a>
                                        </label>
                                    </div>

                                    <div className="col-md-6 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id="privacidad"
                                            className="me-2"
                                            required
                                        />
                                        <label htmlFor="privacidad" className="small text-muted">
                                            <a href="#!" className="text-muted">Acepto la Política de privacidad</a>
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <button
                                        className="btn btn-dark btn-lg btn-block w-100"
                                        type="submit"
                                    >
                                        Registrarse
                                    </button>
                                </div>

                                <p className="small text-muted mb-3">
                                    ¿Olvidaste tu contraseña? <a href="#!" style={{ color: 'blue' }}>Recupérala aquí</a>
                                </p>
                                <p className="small text-muted mb-3">
                                    ¿Ya tienes una cuenta? <a href="#!" style={{ color: 'blue' }}>Inicia sesión aquí</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
