import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input'; 

const OTPInput = () => {
  const [otp, setOtp] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF
  const navigate = useNavigate();
  const location = useLocation();
  const { correo } = location.state || {};

  // Obtener el token CSRF desde el backend
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/csrf-token', {
          credentials: 'include' // Incluir credenciales para manejar cookies
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Guardar el token CSRF
      } catch (error) {
        console.error('Error obteniendo el token CSRF:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Incluir el token CSRF en el encabezado
        },
        body: JSON.stringify({
          correo: correo,
          token: otp,
        }),
        credentials: 'include' // Incluir credenciales para manejar cookies
      });

      if (response.ok) {
        alert('Cuenta verificada con éxito!');
        navigate('/login', { replace: true });
      } else {
        const errorMessage = await response.text();
        alert(`Error al verificar el correo: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      alert('Error de conexión al servidor. Inténtalo de nuevo más tarde.');
    }
  };

  const handleResend = () => {
    console.log('Resend Token');
  };

  return (
    <section className="container-fluid bg-body-tertiary d-block">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4" style={{ minWidth: '500px' }}>
          <div className="card bg-white mb-5 mt-5 border-0" style={{ boxShadow: '0 12px 15px rgba(0, 0, 0, 0.02)' }}>
            <div className="card-body p-5 text-center">
              <h4>Verificar</h4>
              <p>Tu código de verificación se ha enviado al correo {correo}</p>

              <div className='d-flex flex-column align-items-center justify-content-center'>
                <form onSubmit={handleSubmit} className="otp-field mb-4 d-flex flex-column align-items-center">
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
                          borderRadius: '4px'
                        }}
                      />
                    )}
                  />
                  <button className="btn btn-primary mt-3" type="submit">
                    Verify
                  </button>
                </form>
              </div>

              <p className="resend text-muted mb-0">
                No recibiste el código? <a href="#" onClick={handleResend}>Reenviar código</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPInput;
