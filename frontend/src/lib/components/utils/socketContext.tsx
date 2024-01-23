import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null, isAuthenticated: boolean }>({
    socket: null,
    isAuthenticated: false
  });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyTokenAndConnectSocket = async () => {
          const response = await fetch('http://127.0.0.1:3001/users/check', {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json(); // Assuming this contains the user ID
            const userId = data.userId; // Extract the user ID from the response
            const responsetwo = await fetch('http://127.0.0.1:3001/users/check/socket', {
              method: 'GET',
              credentials: 'include',
            });
            if (responsetwo.ok) {
                const newSocket = io('http://127.0.0.1:3001', {
                withCredentials: true,
                query: { userId }, // Include the user ID in the query
              });
            setSocket(newSocket);
            setIsAuthenticated(true);
            }
          } else {
            setIsAuthenticated(false);
          }
        };
    
        verifyTokenAndConnectSocket();
    
        return () => {
          if (socket) {
            socket.disconnect();
          }
        };
      }, []);
    
      return (
        <SocketContext.Provider value={{ socket, isAuthenticated }}>
          {children}
        </SocketContext.Provider>
      );
    };
