import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../OTP/OTPInput.css';
import { useNavigate } from 'react-router-dom';

const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const buttonRef = React.createRef();
  const navigate = useNavigate();

  const location = useLocation();
  const { correo } = location.state || {};

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value.length === 1 && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = otp.join('');

    try {
      const response = await fetch('http://localhost:4000/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          token: token,
        }),
      });

      if (response.ok) {
        alert('Cuenta verificada con éxito!');
        navigate('/login', { replace: true, });
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

  useEffect(() => {
    const inputs = document.querySelectorAll('.otp-field > input');
    const button = buttonRef.current;

    window.addEventListener('load', () => inputs[0].focus());
    button.setAttribute('disabled', 'disabled');

    inputs.forEach((input, index1) => {
      input.addEventListener('keyup', (e) => {
        const currentInput = input;
        const nextInput = input.nextElementSibling;
        const prevInput = input.previousElementSibling;

        if (currentInput.value.length > 1) {
          currentInput.value = '';
          return;
        }

        if (nextInput && nextInput.hasAttribute('disabled') && currentInput.value !== '') {
          nextInput.removeAttribute('disabled');
          nextInput.focus();
        }

        if (e.key === 'Backspace') {
          inputs.forEach((input, index2) => {
            if (index1 <= index2 && prevInput) {
              input.setAttribute('disabled', true);
              input.value = '';
              prevInput.focus();
            }
          });
        }

        button.classList.remove('active');
        button.setAttribute('disabled', 'disabled');

        const inputsNo = inputs.length;
        if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== '') {
          button.classList.add('active');
          button.removeAttribute('disabled');
        }
      });
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('keyup', () => { });
      });
      button.removeEventListener('click', () => { });
    };
  },);

  return (
    <section className="container-fluid bg-body-tertiary d-block">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4" style={{ minWidth: '500px' }}>
          <div className="card bg-white mb-5 mt-5 border-0" style={{ boxShadow: '0 12px 15px rgba(0, 0, 0, 0.02)' }}>
            <div className="card-body p-5 text-center">
              <h4>Verify</h4>
              <p>Your verification code was sent to {correo}</p>

              <form onSubmit={handleSubmit} className="otp-field mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    maxLength="1"
                    style={{ width: '40px', margin: '0 5px' }}
                    disabled={index > 0 && otp[index - 1] === ''}
                  />
                ))}
                <button
                  className="btn btn-primary mb-3"
                  type="submit"
                  ref={buttonRef}
                >
                  Verify
                </button>
              </form>

              <p className="resend text-muted mb-0">
                Didnt receive the code? <a href="#" onClick={handleResend}>Request again</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPInput;
