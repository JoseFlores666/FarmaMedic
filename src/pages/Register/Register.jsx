import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hook/useForm';
import { checkPasswordCompromise, containsCommonPatterns } from '../../services/passwordService';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from "react-password-checklist";
import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from 'emailjs-com';
import { nanoid } from 'nanoid'; 

export const Register = () => {
    const navigate = useNavigate();
    const [captchaValue, setCaptchaValue] = useState(null);
    const { nombre, apellidos, edad, telefono, correo, password, confirmPassword, onInputChange, onResetForm } = useForm({
        nombre: '',
        apellidos: '',
        edad: '',
        telefono: '',
        correo: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
    
        if (containsCommonPatterns(password)) {
            alert("La contraseña contiene patrones comunes como '12345' o 'password'.");
            return;
        }
    
        const isCompromised = await checkPasswordCompromise(password);
        if (isCompromised) {
            alert("La contraseña ha sido comprometida. Por favor, elige una diferente.");
            return;
        }
    
        if (!captchaValue) {
            alert("Por favor, verifica que no eres un robot.");
            return;
        }
    
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
                },
                body: JSON.stringify({
                    nombre,
                    apellidos,
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
                navigate('/otpinput', { replace: true, state: { correo } });
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
                <div className="col col-lg-6">
                    <div className="card" style={{ borderRadius: '1rem' }}>
                        <div className="card-body p-4 p-lg-5 text-black">
                            <form onSubmit={handleRegister}>
                                <h5 className="fw-normal pb-1">Regístrate</h5>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="nombre">Nombre:</label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            className="form-control"
                                            name="nombre"
                                            value={nombre}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="apellidos">Apellidos:</label>
                                        <input
                                            type="text"
                                            id="apellidos"
                                            className="form-control"
                                            name="apellidos"
                                            value={apellidos}
                                            onChange={onInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="edad">Edad:</label>
                                        <input
                                            type="number"
                                            id="edad"
                                            className="form-control"
                                            name="edad"
                                            value={edad}
                                            onChange={onInputChange}
                                            required
                                            min={18}
                                            max={100}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="telefono">Número de Teléfono:</label>
                                        <input
                                            type="text"
                                            id="telefono"
                                            className="form-control"
                                            name="telefono"
                                            value={telefono}
                                            onChange={onInputChange}
                                            required
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div className="form-outline mb-3">
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

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="password">Ingresa tu contraseña:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        name="password"
                                        value={password}
                                        onChange={onInputChange}
                                        required
                                        minLength={8}
                                        maxLength={50}
                                    />
                                    {password && (
                                        <PasswordStrengthBar
                                            password={password}
                                            shortScoreWord="Muy Corta"
                                            scoreWords={['Muy Corta', 'Corta', 'Bien', 'Fuerte', 'Muy fuerte']}
                                        />
                                    )}

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
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={onInputChange}
                                        required
                                        minLength={8}
                                        maxLength={50}
                                    />
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

                                <div className="mb-3 d-flex justify-content-center">
                                    <ReCAPTCHA
                                        sitekey="6LfrrmAqAAAAAO2vOQixcHrRZiYkPDOVAExv4MaE"
                                        onChange={(value) => setCaptchaValue(value)}
                                    />
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
