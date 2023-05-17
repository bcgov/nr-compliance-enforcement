import reportWebVitals from "./reportWebVitals";
import App from "./app/App";
import { createRoot } from "react-dom/client";
import UserService from "./app/service/user-service";

const container = document.getElementById('root')!;
const root = createRoot(container);

const renderApp = () =>root.render(
        <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

UserService.initKeycloak(renderApp);