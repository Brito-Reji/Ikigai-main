import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { logoutStudent } from '@/store/slices/studentAuthSlice';
import { logoutInstructor } from '@/store/slices/instructorAuthSlice';
import Swal from 'sweetalert2';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
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

      socket.on('user:blocked', (data) => {
        Swal.fire({
          title: 'Account Blocked',
          text: data.message || 'Your account has been blocked by the administrator.',
          icon: 'error',
          confirmButtonColor: '#4f46e5',
          allowOutsideClick: false,
        }).then(() => {
          if (user?.role === 'instructor') {
            dispatch(logoutInstructor());
            navigate('/instructor/login');
          } else {
            dispatch(logoutStudent());
            navigate('/login');
          }
        });
      });

      return () => {
        socket.off('user:blocked');
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
