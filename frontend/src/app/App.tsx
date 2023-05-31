import { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import Roles from "./constants/roles";
import RenderOnRole from "./components/routing/render-on-role";
import Layout from "./components/containers/layout";

const App: FC = () => {
  return (
    <BrowserRouter>
      <RenderOnRole roles={[Roles.COS_OFFICER]}>
        <Layout fixedSidebar>
          <Placeholder />
        </Layout>
      </RenderOnRole>
    </BrowserRouter>
  );
};

const Placeholder = () => {
  return <div>placeholder</div>;
};

export default App;
