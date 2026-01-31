import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken, isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    // connect only for students
    if (isAuthenticated && accessToken && user?.role === 'student') {
      const socket = connectSocket(accessToken);

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      return () => {
        disconnectSocket();
        setIsConnected(false);
      };
    } else {
      // disconnect if not authenticated
      disconnectSocket();
      setIsConnected(false);
    }
  }, [isAuthenticated, accessToken, user?.role]);

  return (
    <SocketContext.Provider value={{ socket: getSocket(), isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
