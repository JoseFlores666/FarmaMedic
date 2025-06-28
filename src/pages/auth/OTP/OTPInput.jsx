import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const OTPInput = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const location = useLocation();
  const { correo } = location.state || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('El código de verificación debe tener 6 dígitos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verifyOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ correo, otp }),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: '¡Éxito!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/Acceder');
          }
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al verificar el código.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Error en la solicitud:', err);
      setError('Error en la verificación. Inténtalo de nuevo.');
    }
  };

  const maskEmail = (email) => {
    if (!email) return 'correo no disponible';
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 2 ? `${'*'.repeat(user.length - 2)}${user.slice(-2)}` : '*'.repeat(user.length);
    return `${maskedUser}@${domain}`;
  };

  return (
    <section className="container-fluid bg-body-tertiary d-block">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4" style={{ minWidth: '500px' }}>
          <div className="card shadow-lg mb-5 mt-5" style={{ borderRadius: '1rem', border: '1px solid ' }}>
            <div className="card-body p-5 text-center">
              <h4>Verificar</h4>
              <p>Tu código de verificación se ha enviado al correo {maskEmail(correo)}</p>

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
                  <button className="btn btn-primary mt-3" type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Verify'}
                  </button>
                </form>
                {error && <p className="text-danger">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};