import React, { StrictMode, useEffect, useState } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
<<<<<<< HEAD
import { store } from './features/store.js';
import { GoogleOAuthProvider } from "@react-oauth/google"
import { SocketProvider } from './context/SocketContext.jsx';

const OnlineGoogleOAuthProvider = ({ children }) => {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!online) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OnlineGoogleOAuthProvider>
      <BrowserRouter>
        <Provider store={store}>
          <SocketProvider>
            <App />
          </SocketProvider>
=======
import { store, persistor } from './features/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1056644082255-ioae5gi4v99f6vj0b4jdampbntfrdvkj.apps.googleusercontent.com">
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
        </Provider>
      </BrowserRouter>
    </OnlineGoogleOAuthProvider>
  </React.StrictMode>
);