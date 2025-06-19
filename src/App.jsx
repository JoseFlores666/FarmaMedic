import { Footer } from "./components/Layout";
import Chatbot from "./components/Chatbot/Chatbot";
import { Menu } from "./components/Layout/Menu/Menu";
import { useAuth } from "./context/useAuth";
import Notificactions from "./components/Notifictions/Notifications";
import { useState, useEffect } from "react";

function App() {
  const { isAuthenticated } = useAuth();
  const [notificationCount, setNotificationCount] = useState(() => {
    const storedCount = localStorage.getItem("notificationCount");
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("notificationCount", notificationCount);
  }, [notificationCount]);

  return (
    <>
      <Menu
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
      <Footer />
      <Chatbot />
      {isAuthenticated && (
        <Notificactions setNotificationCount={setNotificationCount} />
      )}
    </>
  )
}
export default App;