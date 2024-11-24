import { useState, useEffect } from 'react';
import { useForm } from '../hook/useForm';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordChecklist from 'react-password-checklist';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const { correo, password, confirmPassword, onInputChange } = useForm({
        correo: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [logoActivo, setLogoActivo] = useState(null);

    useEffect(() => {
        fetchLogoActivo();

        const intervalId = setInterval(() => {
            fetchLogoActivo();
        }, 20000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchLogoActivo = async () => {
        try {
            const response = await fetch('https://localhost:4000/api/getLogoActivo');
            if (!response.ok) throw new Error("Error fetching active logo");
            const data = await response.json();

            if (data && data.url) {
                setLogoActivo(data);
            } else {
                setLogoActivo(null);
            }
        } catch (error) {
            console.error("Error fetching active logo:", error);
            setLogoActivo(null);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:4000/api/recuperar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: correo }),
                credentials: 'include',
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu token de verificacion se ha enviado.',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                })
                setStep(2);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Algo salió mal.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error enviando correo:', error);
        }
    };

    const handleVerifyToken = async (e) => {
        e.preventDefault();
        setStep(3);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:4000/api/cambiar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: correo, token: otp, nuevaContrasena: password }),
                credentials: 'include',
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu contraseña se ha restableido.',
                    icon: 'success',
                    confirmButtonText: 'Genial',
                })
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error restableciendo la contraseña:', error);
        }
    };

    return (
        <section className=" py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                        <div className="card shadow-lg" style={{ borderRadius: '1rem', border: '1px solid' }}>
                            <div className="card-body p-3 p-md-4 p-xl-5 ">
                                <div className="text-center mb-3">
                                    {logoActivo ? (
                                        <img src={logoActivo.url} alt="Logo Activo" style={{ height: '30px', width: 'auto' }} />
                                    ) : (
                                        'FarmaMedic'
                                    )}
                                </div>

                                {step === 1 && (
                                    <form onSubmit={handleForgotPassword}>
                                        <h2 className="fs-6 fw-normal text-center mb-4">
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
                                    </form>
                                )}

                                {step === 2 && (
                                    <form onSubmit={handleVerifyToken}>
                                        <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                                            Ingresa el token que llegó a tu correo asociado a tu cuenta.
                                        </h2>
                                        <div className='d-flex flex-column align-items-center justify-content-center mb-4'>
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
                                        <div className="mb-3">
                                            <button className="btn btn-primary btn-lg btn-block w-100" type="submit">
                                                Verificar token
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {step === 3 && (
                                    <form onSubmit={handleResetPassword}>
                                        <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                                            Ingresa tu nueva contraseña.
                                        </h2>
                                        <div className="form-outline mb-3">
                                            <label className="form-label" htmlFor="password">Nueva contraseña:</label>

                                            <div className='input-group'>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={password}
                                                    onChange={onInputChange}
                                                    required
                                                    minLength={8}
                                                    maxLength={50}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowPassword(!showPassword)}
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
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    className="form-control"
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={onInputChange}
                                                    required
                                                    minLength={8}
                                                    maxLength={50}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>

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
                                    </form>
                                )}

                                <div className="d-flex gap-2 justify-content-between mt-4">
                                    <NavLink to="/login">Iniciar Sesión</NavLink>
                                    <NavLink to="/register">Registrate</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
