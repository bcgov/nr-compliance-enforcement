import { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import Roles from "./constants/roles";
import RenderOnRole from "./components/routing/render-on-role";
import Layout from "./components/containers/layout";
import { ComplaintContainer } from "./components/containers/complaints/complaint-container";

const App: FC = () => {
  return (
    <BrowserRouter>
      <RenderOnRole roles={[Roles.COS_OFFICER]}>
        <Layout fixedSidebar>
          <ComplaintContainer />
        </Layout>
      </RenderOnRole>
    </BrowserRouter>
  );
};

const Placeholder = () => {
  return <div>placeholder</div>;
};

export default App;
