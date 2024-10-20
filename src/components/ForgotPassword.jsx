import { useState, useEffect } from 'react';
import { useForm } from '../hook/useForm';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import OtpInput from 'react-otp-input';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from 'react-password-checklist';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('request');
    const [otp, setOtp] = useState('');
    const [csrfToken, setCsrfToken] = useState(''); 
    const { correo, password, confirmPassword, onInputChange, onResetForm } = useForm({
        correo: '',
        password: '',
        confirmPassword: '',
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = nanoid(6); 

        try {
            const response = await fetch('http://localhost:4000/api/storetoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken, 
                },
                credentials: 'include', 
                body: JSON.stringify({
                    correo,
                    token, 
                }),
            });

            if (response.ok) {
                sendVerificationEmail(token, correo);
                setStep('verify');
                onResetForm();
            } else {
                setMessage('Error al procesar la solicitud.');
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            setMessage('Error de conexión. Inténtalo de nuevo.');
        }
    };

    const sendVerificationEmail = (token, correo) => {
        const templateParams = {
            verification_token: token,
            email: correo,
            company_name: 'FarmaMedic'
        };

        emailjs.send(
            'service_v6e3kyv',
            'template_l1efa7s',
            templateParams,
            'sRaz79F3ov2M-1wak'
        )
            .then((response) => {
                console.log('Correo enviado exitosamente', response.status, response.text);
                setMessage('Hemos enviado un enlace de recuperación a tu correo.');
            })
            .catch((error) => {
                console.error('Error al enviar correo de verificación:', error);
                setMessage('Error al enviar el correo. Inténtalo de nuevo.');
            });
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const responseVerify = await fetch('http://localhost:4000/api/verifytoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include', 
                body: JSON.stringify({
                    token: otp,
                    correo,
                }),
            });

            if (!responseVerify.ok) {
                const errorMessage = await responseVerify.text();
                setMessage(`Error: ${errorMessage}`);
                return;
            }

            const responseReset = await fetch('http://localhost:4000/api/resetpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken, 
                },
                credentials: 'include', 
                body: JSON.stringify({
                    token: otp, 
                    password,
                }),
            });

            if (!responseReset.ok) {
                const errorMessage = await responseReset.text();
                setMessage(`Error: ${errorMessage}`);
                return;
            }

            setMessage('Contraseña actualizada correctamente.');
            onResetForm();
            navigate('/login');
        } catch (error) {
            console.error('Error al manejar el restablecimiento de la contraseña:', error);
            setMessage('Error de conexión. Inténtalo de nuevo.');
        }
    };

    return (
        <section className="bg-light py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="card border border-light-subtle rounded-3 shadow-sm">
                            <div className="card-body p-3 p-md-4 p-xl-5">
                                <div className="text-center mb-3">
                                    <a href="#!">
                                        <img src="./assets/img/bsb-logo.svg" alt="BootstrapBrain Logo" width="175" height="57" />
                                    </a>
                                </div>

                                {step === 'request' && (
                                    <form onSubmit={handleForgotPassword}>
                                        <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                                            Proporciona la dirección de correo asociada a tu cuenta para recuperar tu contraseña.
                                        </h2>
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

                                        <div className="mb-3">
                                            <button className="btn btn-primary btn-lg btn-block w-100" type="submit">
                                                Enviar token de recuperación
                                            </button>
                                        </div>

                                        {message && <p className="text-muted">{message}</p>}
                                    </form>
                                )}

                                {step === 'verify' && (
                                    <>
                                        <form onSubmit={handleResetPassword}>
                                            <div className="form-outline mb-4">
                                                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                                                    Ingresa el token que llegó a tu correo asociado a tu cuenta para recuperar tu contraseña.
                                                </h2>
                                                <div className='d-flex flex-column align-items-center justify-content-center'>
                                                    <h5 className="fw-normal pb-1">Restablece tu contraseña</h5>

                                                    <label className="form-label" htmlFor="token">Token de verificación:</label>
                                                    <OtpInput
                                                        value={otp}
                                                        onChange={setOtp}
                                                        numInputs={6}
                                                        renderSeparator={<span>-</span>}
                                                        renderInput={(props) => (
                                                            <input
                                                                {...props}
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    textAlign: 'center',
                                                                    margin: '0 5px',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                }}
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Nueva contraseña */}
                                            <div className="form-outline mb-3">
                                                <label className="form-label" htmlFor="password">Ingresa tu nueva contraseña:</label>
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

                                            {/* Confirmar contraseña */}
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

                                            <div className="mb-3">
                                                <button className="btn btn-primary btn-lg btn-block w-100" type="submit">
                                                    Restablecer contraseña
                                                </button>
                                            </div>

                                            {message && <p className="text-muted">{message}</p>}
                                        </form>
                                    </>
                                )}

                                <div className="d-flex gap-2 justify-content-between mt-4">
                                    <a href="#!" className="link-primary text-decoration-none">Iniciar sesión</a>
                                    <a href="#!" className="link-primary text-decoration-none">Registrarse</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
