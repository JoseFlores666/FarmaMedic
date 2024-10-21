import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const OTPInput = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); 
  const location = useLocation();
  const { correo } = location.state || {};
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include', 
        body: JSON.stringify({ correo }), 
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: '¡Éxito!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      console.error('Error en la solicitud:', err);
      setError('Error en la verificación. Inténtalo de nuevo.');
    }
  };

  const handleResend = () => {
    console.log('Reenviar código');
  };

  return (
    <section className="container-fluid bg-body-tertiary d-block">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4" style={{ minWidth: '500px' }}>
          <div className="card bg-white mb-5 mt-5 border-0" style={{ boxShadow: '0 12px 15px rgba(0, 0, 0, 0.02)' }}>
            <div className="card-body p-5 text-center">
              <h4>Verificar</h4>
              <p>Tu código de verificación se ha enviado al correo {correo}</p>

              <div className="d-flex flex-column align-items-center justify-content-center">
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
                          borderRadius: '4px',
                        }}
                      />
                    )}
                  />
                  <button className="btn btn-primary mt-3" type="submit">
                    Verify
                  </button>
                </form>
                {error && <p className="text-danger">{error}</p>}
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
