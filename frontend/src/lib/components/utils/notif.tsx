import { useState, useEffect } from 'react';
import "../../styles/notif.css"

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
        setVisible(false);
        }, 2500); // Durée de la notification en millisecondes (3 secondes dans cet exemple)

        return () => clearTimeout(timer);
    }, []);

  return (
    <>
    {visible && (
        <div className={`notification ${type} progress-bar`}>
        {message}
        </div>
    )}
    </>
  );
};

export default Notification;