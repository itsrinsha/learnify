import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { setSocketInstance } from '../sockets/socket.js';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user._id) {
      const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const socketConn = io(socketUrl, {
        query: {
          userId: user._id,
        },
        transports: ["websocket", "polling"],
      });

      setSocket(socketConn);
      setSocketInstance(socketConn);

      socketConn.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socketConn.on('connect_error', (error) => {
        console.warn('Socket connect error:', error);
      });

      socketConn.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
      });

      return () => {
        try {
          socketConn.close();
        } catch (closeError) {
          console.warn('Error closing socket connection:', closeError);
        }
        setSocket(null);
        setSocketInstance(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setSocketInstance(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
