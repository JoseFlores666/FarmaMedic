import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/verify?token=${token}`, {
          method: 'GET'
        });

        if (response.ok) {
          alert('Cuenta verificada con éxito. Ahora puedes iniciar sesión.');
          history.push('/login');
        } else {
          alert('Verificación fallida. El token es inválido o ha expirado.');
        }
      } catch (error) {
        console.error('Error al verificar el correo:', error);
        alert('Error al verificar el correo.');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, history]);

  return (
    <div>
      <h2>Verificando tu correo...</h2>
    </div>
  );
};

export default VerifyEmail;