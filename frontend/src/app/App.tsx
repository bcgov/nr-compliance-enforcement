import { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import Roles from "./constants/roles";
import RenderOnRole from "./components/routing/render-on-role";
import Layout from "./components/containers/layout";
import { ComplaintContainer } from "./components/containers/complaints/complaint-container";
import ComplaintType from "./constants/complaint-types";

const App: FC = () => {
  return (
    <BrowserRouter>
      <RenderOnRole roles={[Roles.COS_OFFICER]}>
        <Layout fixedHeader fixedSidebar>
          <ComplaintContainer initialState={ComplaintType.HWCR_COMPLAINT} />
        </Layout>
      </RenderOnRole>
    </BrowserRouter>
  );
};

export default App;
