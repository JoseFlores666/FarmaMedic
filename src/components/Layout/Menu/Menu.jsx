import { useAuth } from '../../../context/useAuth';
import { Navigate } from 'react-router-dom';
import { Dashboard, Navbar2 } from '../../Layout';
import { useEffect, useState } from 'react';
import { socket } from '../../../context/socket';

export const Menu = ({ notificationCount, setNotificationCount }) => {
  const { isAuthenticated, role, userId } = useAuth();
  const [consNoti, setConsNoti] = useState([]);

 useEffect(() => {
  const fetchNotificaciones = async () => {
    try {
      const response = await fetch(`https://back-farmam.onrender.com/api/getNotiById/${userId}`);
      if (!response.ok) throw new Error("Error al obtener notificaciones");
      const data = await response.json();
      setNotificationCount(data.length);
      setConsNoti(data);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    }
  };

  if (userId) {
    fetchNotificaciones();

    // Unirse a la sala del usuario
    socket.emit("joinRoom", `paciente_${userId}`);

    // Escuchar notificaciones nuevas
    socket.on("notificacion:nueva", () => {
      fetchNotificaciones();
    });

    // Cleanup
    return () => {
      socket.off("notificacion:nueva");
    };
  }
}, [userId, setNotificationCount]);

  
  const props = {
    notificationCount,
    setNotificationCount,
    consNoti
  };

  if (!isAuthenticated) {
    return <Navbar2 {...props} />;
  }

  switch (role) {
    case 1:
    case 3:
      return <Dashboard {...props} />;
    case 2:
      return <Navbar2 {...props} />;
    default:
      return <Navigate to="/Inicio" replace />;

  }
};
