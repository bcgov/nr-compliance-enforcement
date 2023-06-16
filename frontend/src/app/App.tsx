import { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Roles from "./constants/roles";
import { ComplaintContainer } from "./components/containers/complaints/complaint-container";
import ProtectedRoutes from "./components/routing";
import NotAuthorized, { NotFound } from "./components/containers/pages";
import { ComplaintDetails } from "./components/containers/complaints/complaint-details";
import ColorReference from "./components/reference";

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes roles={[Roles.COS_ADMINISTRATOR]} />}>
          {/* <!-- temporary route --> */}
          <Route path="/" element={<ComplaintContainer initialState={0} />} />
          <Route
            path="/complaints/:type?"
            element={<ComplaintContainer initialState={0} />}
          />
          <Route
            path="/complaint/:complaintType/:id"
            element={<ComplaintDetails />}
          />
        </Route>
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/reference" element={<ColorReference />} />
      </Routes>
    </Router>
  );
};

export default App;
