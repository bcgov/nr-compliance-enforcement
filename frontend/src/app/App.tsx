import { FC } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Roles from "./constants/roles";
import { ComplaintContainer } from "./components/containers/complaints/complaint-container";
import ProtectedRoutes from "./components/routing";
import NotAuthorized, { NotFound } from "./components/containers/pages";

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
        {/* <Route
          path="/complaint/:complaintType/:id"
          element={<ComplaintDetails />}
        /> */}
      </Route>
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
  );
};

export default App;
