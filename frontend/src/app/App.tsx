import { Counter } from './features/counter/Counter';
import './App.css';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import React from 'react';
import { Provider } from 'react-redux';
import keycloak from './keycloak';
import { store } from './store/store';
import PrivateRoute from './routes/PrivateRoute';
import Roles from './constants/roles';

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}
    initOptions={{ onLoad: 'login-required',
                   'public-client': true,
                   pkceMethod: 'S256' }}>
      <React.StrictMode>
        <Provider store={store}>
          <PrivateRoute role={Roles.COS_OFFICER}>
            <Counter/>
          </PrivateRoute>
        </Provider>
      </React.StrictMode>
    </ReactKeycloakProvider>
  
  );
}

export default App;
