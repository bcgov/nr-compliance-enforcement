import { FC, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoutes from "./components/routing";
import ScrollToTop from "./common/scroll-to-top";
import { NotAuthorized, NotFound } from "./components/containers/pages";
import { ComplaintDetailsEdit } from "./components/containers/complaints/details/complaint-details-edit";
import { CaseView } from "./components/containers/cases/view/case-view";
import ColorReference, { MiscReference, SpaceReference } from "./components/reference";
import { ModalComponent as Modal } from "./components/modal/modal";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { ZoneAtAGlance } from "./components/containers/zone-at-a-glance/zone-at-a-glance";
import { fetchAllCodeTables } from "./store/reducers/code-table";
import { getOfficers } from "./store/reducers/officer";
import { PageLoader } from "./components/common/page-loader";
import { ComplaintsWrapper } from "./components/containers/complaints/complaints";
import Cases from "./components/containers/cases/cases";
import CaseEdit from "./components/containers/cases/edit/case-edit";
import Compliments from "./components/containers/compliments/compliments";
import COMPLAINT_TYPES from "./types/app/complaint-types";
import {
  getCodeTableVersion,
  getConfigurations,
  getFeatureFlag,
  getOfficerDefaultZone,
  getTokenProfile,
} from "./store/reducers/app";
import { CreateComplaint } from "./components/containers/complaints/details/complaint-details-create";
import { UserManagement } from "@components/containers/admin/user-management";
import UserService from "./service/user-service";
import GenericErrorBoundary from "./components/error-handling/generic-error-boundary";
import { VerifyAccess } from "./components/containers/pages/verify-access";
import { Roles, coreRoles } from "./types/app/roles";
import { FeatureManagement } from "./components/containers/admin/feature-management";
import { LegislationSourceManagement } from "./components/containers/admin/legislation-source-management";
import { AppUpdate } from "./AppUpdate";
import Investigations from "@/app/components/containers/investigations/investigations";
import { InvestigationDetails } from "@/app/components/containers/investigations/details/investigation-details";
import { isFeatureActive } from "@store/reducers/app";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { PartyView } from "./components/containers/parties/view";
import Redirect from "./components/containers/pages/redirect";
import config from "@/config";
import { InspectionDetails } from "@/app/components/containers/inspections/details/inspection-details";
import Inspections from "@/app/components/containers/inspections/inspections";

import PartyEdit from "./components/containers/parties/edit/party-edit";
import InspectionEdit from "@/app/components/containers/inspections/edit/inspection-edit";
import Parties from "@/app/components/containers/parties/parties";
import InvestigationCreate from "@/app/components/containers/investigations/create/investigation-create";

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOfficerDefaultZone());
    dispatch(fetchAllCodeTables());
    dispatch(getOfficers());
    dispatch(getConfigurations());
    dispatch(getCodeTableVersion());
    dispatch(getFeatureFlag());
    dispatch(getTokenProfile());
  }, [dispatch]);

  const investigationsActive = useAppSelector(isFeatureActive(FEATURE_TYPES.INVESTIGATIONS));
  const inspectionsActive = useAppSelector(isFeatureActive(FEATURE_TYPES.INSPECTIONS));

  const { REDIRECT_MODE, REDIRECT_HOST_NAME } = config;
  const redirectMode = REDIRECT_MODE === "true";
  const redirectUrl = REDIRECT_HOST_NAME;

  return (
    <GenericErrorBoundary>
      <AppUpdate />
      <Router>
        <ScrollToTop />
        <Modal />
        <PageLoader />
        <ToastContainer //any options that might be overridden need to be given a default here
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <Routes>
          {redirectMode ? (
            <Route
              path="*"
              element={<Redirect url={redirectUrl} />}
            />
          ) : (
            <>
              <Route element={<ProtectedRoutes roles={coreRoles} />}>
                <Route
                  path="/"
                  element={<ComplaintsRouteWrapper />}
                />
                <Route
                  path="/complaints/:type?"
                  element={<ComplaintsRouteWrapper />}
                />
                <Route
                  path="/cases"
                  element={<Cases />}
                />
                <Route
                  path="/case/create"
                  element={<CaseEdit />}
                />
                <Route
                  path="/case/:id"
                  element={<CaseView />}
                />
                <Route
                  path="/case/:id/:tabKey"
                  element={<CaseView />}
                />
                <Route
                  path="/case/:id/edit"
                  element={<CaseEdit />}
                />
                <Route
                  path="/compliments"
                  element={<Compliments />}
                />
                <Route
                  path="/parties"
                  element={<Parties />}
                />
                <Route
                  path="/party/:id"
                  element={<PartyView />}
                />
                <Route
                  path="/party/create"
                  element={<PartyEdit />}
                />
                <Route
                  path="/party/:id/edit"
                  element={<PartyEdit />}
                />
                {investigationsActive && (
                  <Route
                    path="/investigations"
                    element={<Investigations />}
                  />
                )}
                {investigationsActive && (
                  <Route
                    path="/investigation/:investigationGuid"
                    element={<InvestigationDetails />}
                  />
                )}
                {investigationsActive && (
                  <Route
                    path="/case/:caseIdentifier/createInvestigation"
                    element={<InvestigationCreate />}
                  />
                )}
                {investigationsActive && (
                  <Route
                    path="/investigation/:investigationGuid/:tabKey"
                    element={<InvestigationDetails />}
                  />
                )}
                {inspectionsActive && (
                  <Route
                    path="/inspections"
                    element={<Inspections />}
                  />
                )}
                {inspectionsActive && (
                  <Route
                    path="/inspection/:inspectionGuid"
                    element={<InspectionDetails />}
                  />
                )}
                {inspectionsActive && (
                  <Route
                    path="/case/:caseIdentifier/createInspection"
                    element={<InspectionEdit />}
                  />
                )}
                {inspectionsActive && (
                  <Route
                    path="/inspection/:id/edit"
                    element={<InspectionEdit />}
                  />
                )}
                {inspectionsActive && (
                  <Route
                    path="/inspection/:inspectionGuid/:tabKey"
                    element={<InspectionDetails />}
                  />
                )}
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
              <Route element={<ProtectedRoutes roles={[Roles.TEMPORARY_TEST_ADMIN]} />}>
                <Route
                  path="/admin/laws"
                  element={<LegislationSourceManagement />}
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
            </>
          )}
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
