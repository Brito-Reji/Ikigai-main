import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  
  const studentAuth = useSelector(state => state.studentAuth);
  const instructorAuth = useSelector(state => state.instructorAuth);
  
  const isInstructorRoute = location.pathname.startsWith('/instructor');
  const activeAuth = isInstructorRoute ? instructorAuth : studentAuth;
  const { accessToken, isAuthenticated, user } = activeAuth || {};

  useEffect(() => {
    // connect for students and instructors
    const allowedRoles = ['student', 'instructor'];
    if (isAuthenticated && accessToken && allowedRoles.includes(user?.role)) {
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
