import React from "react";
import { Provider } from "react-redux";

import reportWebVitals from "./reportWebVitals";
import App from "./app/App";
import { store } from "./app/store/store";
import {ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
import { createRoot } from "react-dom/client";

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <ReactKeycloakProvider authClient={keycloak}
  initOptions={{ onLoad: 'login-required',
                 'public-client': true,
                 pkceMethod: 'S256' }}>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
