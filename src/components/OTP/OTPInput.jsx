import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input'; 

const OTPInput = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { correo } = location.state || {}; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          token: otp, 
        }),
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
              <p>Tu codigo de verificación se a enviado al correo {correo}</p>

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
                No recibiste el codigo? <a href="#" onClick={handleResend}>Reenviar codigo</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPInput;
