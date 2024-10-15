import { useState } from 'react';
import { useForm } from '../hook/useForm';
import { nanoid } from 'nanoid';
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Capturar el token desde la URL (si existe)
  
  const [step] = useState('request'); // Controlar el paso del proceso (request o reset)
  const [message, setMessage] = useState('');
  
  const { correo, password, onInputChange, onResetForm } = useForm({
    correo: '',
    password: '',
  });

  const sendVerificationEmail = (link, correo) => {
    const templateParams = {
      verification_link: link,
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

  // 1. Función para manejar el envío del enlace de recuperación
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    const verificationToken = nanoid(6); // Generar token único de 6 dígitos
    const resetLink = `http://localhost:3000/resetpassword/${verificationToken}`; // Crear enlace con el token

    try {
      // Enviar token y correo al backend para almacenarlo
      const response = await fetch('http://localhost:4000/api/storetoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          token: verificationToken,
        }),
      });

      if (response.ok) {
        sendVerificationEmail(resetLink, correo); // Enviar el enlace con el token
        onResetForm(); // Limpiar el formulario
      } else {
        setMessage('Error al procesar la solicitud.');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMessage('Error de conexión. Inténtalo de nuevo.');
    }
  };

  // 2. Función para manejar el restablecimiento de contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Enviar la nueva contraseña y el token al backend para actualizarla
      const response = await fetch(`http://localhost:4000/api/resetpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      if (response.ok) {
        setMessage('Contraseña actualizada correctamente.');
        onResetForm();
        navigate('/login'); // Redirigir al usuario al login
      } else {
        setMessage('Error al actualizar la contraseña. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setMessage('Error de conexión. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container py-4 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-lg-6">
          <div className="card" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 p-lg-5 text-black">
              
              {step === 'request' && !token && (
                <>
                  <h5 className="fw-normal pb-1">Recupera tu contraseña</h5>
                  <form onSubmit={handleForgotPassword}>
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
                      <button className="btn btn-dark btn-lg btn-block w-100" type="submit">
                        Enviar enlace de recuperación
                      </button>
                    </div>

                    {message && <p className="text-muted">{message}</p>}
                  </form>
                </>
              )}

              {/* Si el token está presente en la URL, mostramos el formulario para la nueva contraseña */}
              {token && (
                <>
                  <h5 className="fw-normal pb-1">Restablece tu contraseña</h5>
                  <form onSubmit={handleResetPassword}>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">Nueva contraseña:</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <button className="btn btn-dark btn-lg btn-block w-100" type="submit">
                        Restablecer contraseña
                      </button>
                    </div>

                    {message && <p className="text-muted">{message}</p>}
                  </form>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
