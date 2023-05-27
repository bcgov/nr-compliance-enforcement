import { BrowserRouter } from "react-router-dom";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import Roles from "./constants/roles";
import RenderOnRole from "./components/routing/render-on-role";
import { HwcrComplaintContainer } from "./components/complaints/hwcr/hwcr-complaint-container";

function App() {
  return (
    <BrowserRouter>
      <RenderOnRole roles={[Roles.COS_OFFICER]}>
        { /*<Counter /> */}
        <HwcrComplaintContainer />
      </RenderOnRole>
    </BrowserRouter>
  );
}

export default App;
