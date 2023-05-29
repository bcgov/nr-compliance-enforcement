import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Roles from "./constants/roles";
import RenderOnRole from "./components/routing/render-on-role";

function App() {
  return (
    <BrowserRouter>
      <RenderOnRole roles={[Roles.COS_OFFICER]}>

      </RenderOnRole>
    </BrowserRouter>
  );
}

export default App;
