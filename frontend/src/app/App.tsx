import { BrowserRouter } from "react-router-dom";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import Roles from "./constants/roles";
import RenderOnRole from "./components/routing/render-on-role";

function App() {
  return (
    <BrowserRouter>
      <RenderOnRole roles={[Roles.COS_OFFICER]}>
        <Counter />
      </RenderOnRole>
    </BrowserRouter>
  );
}

export default App;
