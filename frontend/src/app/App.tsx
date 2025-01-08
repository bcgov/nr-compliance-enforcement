import { FC, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useParams } from "react-router-dom";

import ProtectedRoutes from "./components/routing";
import ScrollToTop from "./common/scroll-to-top";
import { NotAuthorized, NotFound } from "./components/containers/pages";
import { ComplaintDetailsEdit } from "./components/containers/complaints/details/complaint-details-edit";
import ColorReference, { MiscReference, SpaceReference } from "./components/reference";
import { ModalComponent as Modal } from "./components/modal/modal";
import { useAppDispatch } from "./hooks/hooks";
import { ZoneAtAGlance } from "./components/containers/zone-at-a-glance/zone-at-a-glance";
import { fetchAllCodeTables } from "./store/reducers/code-table";
import { getOfficers } from "./store/reducers/officer";
import { PageLoader } from "./components/common/page-loader";
import { ComplaintsWrapper } from "./components/containers/complaints/complaints";
import COMPLAINT_TYPES from "./types/app/complaint-types";
import { getCodeTableVersion, getConfigurations, getFeatureFlag, getOfficerDefaultZone } from "./store/reducers/app";
import { CreateComplaint } from "./components/containers/complaints/details/complaint-details-create";
import { UserManagement } from "@components/containers/admin/user-management";
import UserService from "./service/user-service";
import GenericErrorBoundary from "./components/error-handling/generic-error-boundary";
import { VerifyAccess } from "./components/containers/pages/verify-access";
import Roles from "./types/app/roles";
import { FeatureManagement } from "./components/containers/admin/feature-management";

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOfficerDefaultZone());
    dispatch(fetchAllCodeTables());
    dispatch(getOfficers());
    dispatch(getConfigurations());
    dispatch(getCodeTableVersion());
    dispatch(getFeatureFlag());
  }, [dispatch]);

  return (
    <GenericErrorBoundary>
      <Router>
        <ScrollToTop />
        <Modal />
        <PageLoader />
        <Routes>
          <Route element={<ProtectedRoutes roles={[Roles.COS_OFFICER, Roles.CEEB]} />}>
            <Route
              path="/"
              element={<ComplaintsRouteWrapper />}
            />
            <Route
              path="/complaints/:type?"
              element={<ComplaintsRouteWrapper />}
            />
            <Route
              path="/complaint/:complaintType/:id"
              element={<ComplaintDetailsEdit />}
            />
            <Route
              path="/zone/at-a-glance"
              element={<ZoneAtAGlance />}
            />
            <Route
              path="/complaint/createComplaint"
              element={<CreateComplaint />}
            />
          </Route>
          <Route element={<ProtectedRoutes roles={[Roles.TEMPORARY_TEST_ADMIN]} />}>
            <Route
              path="/admin/user"
              element={<UserManagement />}
            />
          </Route>
          <Route element={<ProtectedRoutes roles={[Roles.TEMPORARY_TEST_ADMIN]} />}>
            <Route
              path="/admin/feature"
              element={<FeatureManagement />}
            />
          </Route>
          <Route
            path="/verification"
            element={<VerifyAccess />}
          />
          <Route
            path="/not-authorized"
            element={<NotAuthorized />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
          <Route
            path="/reference"
            element={
              <>
                <ColorReference /> <MiscReference /> <SpaceReference />
              </>
            }
          />
        </Routes>
      </Router>
    </GenericErrorBoundary>
  );
};

const ComplaintsRouteWrapper = () => {
  const { type } = useParams();
  let userType = UserService.hasRole(Roles.CEEB) ? COMPLAINT_TYPES.ERS : COMPLAINT_TYPES.HWCR;
  const defaultType = !type ? userType : type;

  return <ComplaintsWrapper defaultComplaintType={defaultType} />;
};

export default App;
