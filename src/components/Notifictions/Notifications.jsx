import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../context/useAuth';
import { socket } from '../../context/socket';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = ({ setNotificationCount }) => {
  const { userId, role } = useAuth();

  useEffect(() => {
    if (role !== 1 || !userId) return;

    const handleNotificacion = (data) => {
      toast.info(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '16px' }}>{data.titulo}</strong>
          <span style={{ fontSize: '14px', marginTop: '4px' }}>{data.mensaje}</span>
        </div>

      );
      // Aumentar el contador y guardar en localStorage
      setNotificationCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem("notificationCount", newCount.toString());
        return newCount;  
      });
    };

    socket.on('notificacion:nueva', handleNotificacion);

    return () => {
      socket.off('notificacion:nueva', handleNotificacion);
    };
  }, [userId, role,setNotificationCount]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
};

export default Notifications;
