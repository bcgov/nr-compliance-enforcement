import { FC, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from "react-router-dom";

import Roles from "./constants/roles";
import ProtectedRoutes from "./components/routing";
import ScrollToTop from "./common/scroll-to-top";
import NotAuthorized, { NotFound } from "./components/containers/pages";
import { ComplaintDetailsEdit } from "./components/containers/complaints/details/complaint-details-edit";
import ColorReference, { MiscReference, SpaceReference } from "./components/reference";
import { ModalComponent as Modal } from "./components/modal/modal";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { ZoneAtAGlance } from "./components/containers/zone-at-a-glance/zone-at-a-glance";
import { fetchAllCodeTables, fetchCaseCodeTables, fetchComplaintCodeTables } from "./store/reducers/code-table";
import { getOfficers } from "./store/reducers/officer";
import { PageLoader } from "./components/common/page-loader";
import { ComplaintsWrapper } from "./components/containers/complaints/complaints";
import COMPLAINT_TYPES from "./types/app/complaint-types";
import { getCodeTableVersion, getConfigurations, getOfficerDefaultZone } from "./store/reducers/app";
import { CreateComplaint } from "./components/containers/complaints/details/complaint-details-create";
import { UserManagement } from "./components/containers/admin/user-management";

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOfficerDefaultZone());
    dispatch(fetchAllCodeTables());
    dispatch(getOfficers());
    dispatch(getConfigurations());
    dispatch(getCodeTableVersion());
  }, [dispatch]);

  const codeTableVersion = useAppSelector(state => state.app.codeTableVersion)
  useEffect(() => {
    const prevVersion = localStorage.getItem("codeTableVersion");

    //Compare previous version with new version
    if(prevVersion !== null) {
      const { complaintManagement: prevComplaint, caseManagement: prevCase } = JSON.parse(prevVersion);
      const { complaintManagement: newComplaint, caseManagement: newCase } = codeTableVersion;
      if (Number(newComplaint.configurationValue) > Number(prevComplaint.configurationValue)) {
        dispatch(fetchComplaintCodeTables());
      }
      if (Number(newCase.configurationValue) > Number(prevCase.configurationValue)) {
        dispatch(fetchCaseCodeTables());
      }
    }
    
    //set localStorage with new version
    localStorage.setItem("codeTableVersion", JSON.stringify(codeTableVersion));

  }, [codeTableVersion, dispatch])

  return (
    <Router>
      <ScrollToTop />
      <Modal />
      <PageLoader />
      <Routes>
        <Route element={<ProtectedRoutes roles={[Roles.COS_ADMINISTRATOR]} />}>
          <Route path="/" element={<ComplaintsRouteWrapper />} />
          <Route
            path="/complaints/:type?"
            element={<ComplaintsRouteWrapper />}
          />
          <Route
            path="/complaint/:complaintType/:id"
            element={<ComplaintDetailsEdit />}
          />
          <Route path="/zone/at-a-glance" element={<ZoneAtAGlance />} />
          <Route
            path="/complaint/createComplaint"
            element={<CreateComplaint />}
          />
        </Route>
        <Route
          element={<ProtectedRoutes roles={[Roles.TEMPORARY_TEST_ADMIN]} />}
        >
          <Route path="/admin/user" element={<UserManagement />} />
        </Route>
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/reference" element={<><ColorReference/> <MiscReference/> <SpaceReference /></>} />
      </Routes>
    </Router>
  );
};

const ComplaintsRouteWrapper = () => {
  const { type } = useParams();
  const defaultType = !type ? COMPLAINT_TYPES.HWCR : type;

  return <ComplaintsWrapper defaultComplaintType={defaultType} />;
};

export default App;
