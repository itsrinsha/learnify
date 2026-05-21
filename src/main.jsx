import React, { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { store } from './features/store.js';
import {GoogleOAuthProvider} from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);