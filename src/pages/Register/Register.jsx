import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { checkPasswordCompromise, containsCommonPatterns } from '../../services/passwordService';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from "react-password-checklist";
import ReCAPTCHA from 'react-google-recaptcha';
import Input from '../../components/Input';
import Swal from 'sweetalert2';
import VistaDeslinde from '../DocRegulatorio/Informacion/VistaDeslinde';
import VistaPolitica from '../DocRegulatorio/Informacion/VistaPolitica';
import VistaTerminos from '../DocRegulatorio/Informacion/VistaTerminos';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const Register = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [showDeslindeModal, setShowDeslindeModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [terminosChecked, setTerminosChecked] = useState(false);
    const [privacidadChecked, setPrivacidadChecked] = useState(false);
    const [deslindeChecked, setDeslindeChecked] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleCheckboxChange = (checkboxName, isChecked) => {
        if (checkboxName === "terminos") setTerminosChecked(isChecked);
        if (checkboxName === "privacidad") setPrivacidadChecked(isChecked);
        if (checkboxName === "deslinde") setDeslindeChecked(isChecked);
    };

    const openDeslindeModal = () => setShowDeslindeModal(true);
    const closeDeslindeModal = () => setShowDeslindeModal(false);
    const openDeslindeModal2 = () => setShowModal2(true);
    const closeDeslindeModal2 = () => setShowModal2(false);
    const openDeslindeModal3 = () => setShowModal3(true);
    const closeDeslindeModal3 = () => setShowModal3(false);

    const validateCorreo = (correo) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(correo);
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,50}$/.test(password);
    const validateUsuario = (usuario) => /^[a-zA-ZÀ-ÿ\d\s\S]{2,50}$/.test(usuario);
    const validateNombre = (nombre) => /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/.test(nombre);
    const validateApellido = (apellido) => /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/.test(apellido);

    const validateEdad = (edad) => /^(1[89]|[2-9]\d|99)$/.test(edad);
    const validateTelefono = (telefono) => /^\d{10}$/.test(telefono);

    const handleValidation = (e) => {
        const { name, value } = e.target;
        let error = "";

        if (name === "usuario") {
            if (!value.trim()) error = "El usuario es obligatorio.";
            else if (!validateUsuario(value)) error = "El usuario no tiene un formato válido.";
        }
        if (name === "nombre") {
            if (!value.trim()) error = "El nombre es obligatorio.";
            else if (!validateNombre(value)) error = "Formato inválido en el nombre.";
        }
        if (name === "apellidoPaterno") {
            if (!value.trim()) error = "El apellido paterno es obligatorio.";
            else if (!validateApellido(value)) error = "Formato inválido en el apellido paterno.";
        }
        if (name === "apellidoMaterno") {
            if (!value.trim()) error = "El apellido materno es obligatorio.";
            else if (!validateApellido(value)) error = "Formato inválido en el apellido materno.";
        }
        if (name === "edad") {
            if (!value.trim()) error = "La edad es obligatoria.";
            else if (!validateEdad(value)) error = "La edad debe ser entre 18 y 99 años.";
        }
        if (name === "telefono") {
            if (!value.trim()) error = "El teléfono es obligatorio.";
            else if (!validateTelefono(value)) error = "El teléfono debe tener 10 dígitos.";
        }
        if (name === "correo") {
            if (!value.trim()) error = "El correo es obligatorio.";
            else if (!validateCorreo(value)) error = "Formato de correo inválido.";
        }
        if (name === "password") {
            if (!value.trim()) error = "La contraseña es obligatoria.";
            else if (!validatePassword(value)) error = "Formato de contraseña inválido.";
        }
        if (name === "password" && containsCommonPatterns(value)) {
            error = "La contraseña contiene patrones comunes.";
        }
        // if (name === "password" && checkPasswordCompromise(value)) {
        //     error = "La contraseña a sido comprometida.";
        // }
        if (name === "confirmPassword") {
            if (!value.trim()) error = "La confirmación de la contraseña es obligatoria.";
            else if (value !== password) error = "Las contraseñas no coinciden.";
        }
        if (name === "genero" && !value.trim()) error = "El género es obligatorio.";

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!usuario) newErrors.usuario = "El usuario es obligatorio.";
        else if (!validateUsuario(usuario)) newErrors.usuario = "El usuario no tiene un formato válido.";

        if (!nombre) newErrors.nombre = "El nombre es obligatorio.";
        else if (!validateNombre(nombre)) newErrors.nombre = "Formato inválido en el nombre.";

        if (!apellidoPaterno) newErrors.apellidoPaterno = "El apellido paterno es obligatorio.";
        else if (!validateApellido(apellidoPaterno)) newErrors.apellidoPaterno = "Formato inválido en el apellido paterno.";

        if (!apellidoMaterno) newErrors.apellidoMaterno = "El apellido materno es obligatorio.";
        else if (!validateApellido(apellidoMaterno)) newErrors.apellidoMaterno = "Formato inválido en el apellido materno.";

        if (!edad) newErrors.edad = "La edad es obligatoria.";
        else if (!validateEdad(edad)) newErrors.edad = "La edad debe ser entre 18 y 99 años.";

        if (!telefono) newErrors.telefono = "El teléfono es obligatorio.";
        else if (!validateTelefono(telefono)) newErrors.telefono = "El teléfono debe tener 10 dígitos.";

        if (!correo) newErrors.correo = "El correo es obligatorio.";
        else if (!validateCorreo(correo)) newErrors.correo = "Formato de correo inválido.";

        if (!password) newErrors.password = "La contraseña es obligatoria.";
        else if (!validatePassword(password)) newErrors.password = "Formato de contraseña inválido.";

        if (!confirmPassword) newErrors.confirmPassword = "La confirmación de la contraseña es obligatoria.";
        else if (confirmPassword !== password) newErrors.confirmPassword = "Las contraseñas no coinciden.";

        if (!genero) newErrors.genero = "El género es obligatorio.";


        if (!terminosChecked || !privacidadChecked || !deslindeChecked) {
            newErrors.terminos = "Debe aceptar los Términos y Condiciones, Política de privacidad y deslinde legal.";
        }
        if (containsCommonPatterns(password)) {
            newErrors.password = "La contraseña contiene patrones comunes.";
        }
        if (await checkPasswordCompromise(password)) {
            newErrors.password = "La contraseña ha sido comprometida.";
        }
        if (!captchaValue) {
            newErrors.captcha = "Por favor, verifica el captcha.";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;
        const response = await fetch('https://back-farmam.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                usuario, nombre, apellidoPaterno, apellidoMaterno,
                edad, telefono, genero, correo, password, captcha: captchaValue
            }),
        });
        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Registro exitoso. Revisa tu correo para el código de verificación.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            navigate('/otpInput', { state: { replace: true, correo }, replace: true });
            onResetForm();
        } else {
            const errorMessage = await response.text();
            Swal.fire({ title: 'Error', text: errorMessage, icon: 'error' });
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
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
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
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
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
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
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
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
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
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
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
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
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
                                                onChange={(e) => {
                                                    onInputChange(e);
                                                    handleValidation(e);
                                                }}
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
                                                onChange={(e) => {
                                                    onInputChange(e);
                                                    handleValidation(e);
                                                }}
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
                                                onChange={(e) => {
                                                    onInputChange(e);
                                                    handleValidation(e);
                                                }}
                                            />
                                            <label className="form-check-label me-2" htmlFor="generoOtro">
                                                Otro:
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${genero === 'Otro' ? '' : 'd-none'}`}
                                                placeholder="Especifica"
                                                onChange={(e) => {
                                                    onInputChange(e);
                                                    handleValidation(e);
                                                }}
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
                                        onChange={(e) => {
                                            onInputChange(e);
                                            handleValidation(e);
                                        }}
                                        placeholder={"Introduce tu correo"}
                                    />
                                    {errors.correo && <div className="text-danger">{errors.correo}</div>}
                                </div>

                                <div className="form-outline mb-3">
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
                                            minLength={8}
                                            maxLength={50}
                                            placeholder={"Introduce tu contraseña"}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ zIndex: 0 }}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>

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
                                    <div className='input-group'>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                onInputChange(e);
                                                handleValidation(e);
                                            }}
                                            minLength={8}
                                            maxLength={50}
                                            placeholder={"Repite tu contraseña"}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            style={{ zIndex: 0 }}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>

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
                                            checked={terminosChecked}
                                            onChange={(e) => handleCheckboxChange("terminos", e.target.checked)}

                                        />
                                        <label htmlFor="terminos" className="small text-muted">
                                            <a className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal3(); }}>
                                                Acepto los Términos y Condiciones</a>
                                        </label>
                                        <VistaTerminos showModal={showModal3} onClose={closeDeslindeModal3} />
                                    </div>

                                    <div className="col-md-6 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id="privacidad"
                                            className="me-2"
                                            checked={privacidadChecked}
                                            onChange={(e) => handleCheckboxChange("privacidad", e.target.checked)}
                                        />
                                        <label htmlFor="privacidad" className="small text-muted">
                                            <a className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal2(); }}>
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
                                                checked={deslindeChecked}
                                                onChange={(e) => handleCheckboxChange("deslinde", e.target.checked)}
                                            />
                                            <label htmlFor="deslinde" className="small text-muted m-3">
                                                <a className="text-muted" onClick={(e) => { e.preventDefault(); openDeslindeModal(); }}>
                                                    Acepto el deslinde legal
                                                </a>
                                            </label>
                                        </div>
                                        <VistaDeslinde showModal={showDeslindeModal} onClose={closeDeslindeModal} />
                                    </div>
                                    {errors.terminos && <div className="text-danger mt-2">{errors.terminos}</div>}
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
                                    ¿Olvidaste tu contraseña? <NavLink to="/forgotpassword">Recuperala aquí</NavLink>
                                </p>
                                <p className="small text-muted mb-3">
                                    ¿Ya tienes una cuenta? <NavLink to="/login">Inicia sesión aquí</NavLink>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
