import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store/store";
import "urlpattern-polyfill";

import App from "./app/App";
import UserService from "./app/service/user-service";
import "./assets/sass/app.scss";

import reportWebVitals from "./reportWebVitals";
import { PersistGate } from "redux-persist/integration/react";
import { ErrorBoundaryContext } from "./app/hooks/error-boundary";
import "bootstrap-icons/font/bootstrap-icons.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

const onAuthenticatedCallback = () =>
  root.render(
    <StrictMode>
      <ErrorBoundaryContext>
        <Provider store={store}>
          <PersistGate
            loading={null}
            persistor={persistor}
          >
            <App />
          </PersistGate>
        </Provider>
      </ErrorBoundaryContext>
    </StrictMode>,
  );

UserService.initKeycloak(onAuthenticatedCallback);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// OR send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
