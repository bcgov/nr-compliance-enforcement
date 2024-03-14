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
import TopLevelErrorBoundary from "./app/components/common/error-handlers/top-level";

const container = document.getElementById("root")!;
const root = createRoot(container);

function MyComponent() {
  // Simulate an error for demonstration purposes
  if (Math.random() > 0.5) {
    throw new Error('An error occurred in MyComponent');
  }

  // Component logic here
  return <div>This is MyComponent</div>;
}

const onAuthenticatedCallback = () =>
  root.render(
    <StrictMode>
      <TopLevelErrorBoundary>
        <Provider store={store}>
          <PersistGate
            loading={null}
            persistor={persistor}
          >
            <App />
          </PersistGate>
        </Provider>
        {/* <MyComponent /> */}
        {/* this component will throw an exception, and this exception will be caught by the boundary */}
      </TopLevelErrorBoundary>
    </StrictMode>,
  );

UserService.initKeycloak(onAuthenticatedCallback);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
