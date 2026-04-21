import { Route } from "react-router-dom";
import CaseManagementPilotRestricted from "@components/containers/pages/case-management-pilot-restricted";
import { ReactElement } from "react";

const restricted = <CaseManagementPilotRestricted />;

export type PilotRestrictedRouteFlags = {
  casesFeatureWithoutCaseAccess: boolean;
  investigationsFeatureWithoutCaseAccess: boolean;
  inspectionsFeatureWithoutCaseAccess: boolean;
};

export const caseManagementPilotRestrictedRouteElements = ({
  casesFeatureWithoutCaseAccess: casesOnNoAccess,
  investigationsFeatureWithoutCaseAccess: investigationsOnNoAccess,
  inspectionsFeatureWithoutCaseAccess: inspectionsOnNoAccess,
}: PilotRestrictedRouteFlags): ReactElement[] => {
  const routes: ReactElement[] = [];

  if (investigationsOnNoAccess) {
    routes.push(
      <Route
        key="pilot-case-create-investigation"
        path="/case/:caseIdentifier/createInvestigation"
        element={restricted}
      />,
    );
  }

  if (inspectionsOnNoAccess) {
    routes.push(
      <Route
        key="pilot-case-create-inspection"
        path="/case/:caseIdentifier/createInspection"
        element={restricted}
      />,
    );
  }

  if (casesOnNoAccess) {
    routes.push(
      <Route
        key="pilot-cases-list"
        path="/cases"
        element={restricted}
      />,
      <Route
        key="pilot-case-create"
        path="/case/create"
        element={restricted}
      />,
      <Route
        key="pilot-case-edit"
        path="/case/:id/edit"
        element={restricted}
      />,
      <Route
        key="pilot-case-tab"
        path="/case/:id/:tabKey"
        element={restricted}
      />,
      <Route
        key="pilot-case-view"
        path="/case/:id"
        element={restricted}
      />,
      <Route
        key="pilot-parties-list"
        path="/parties"
        element={restricted}
      />,
      <Route
        key="pilot-party-create"
        path="/party/create"
        element={restricted}
      />,
      <Route
        key="pilot-party-edit"
        path="/party/:id/edit"
        element={restricted}
      />,
      <Route
        key="pilot-party-view"
        path="/party/:id"
        element={restricted}
      />,
    );
  }

  if (investigationsOnNoAccess) {
    routes.push(
      <Route
        key="pilot-investigations-list"
        path="/investigations"
        element={restricted}
      />,
      <Route
        key="pilot-investigation-task-create"
        path="/investigation/:investigationGuid/task/create"
        element={restricted}
      />,
      <Route
        key="pilot-investigation-task-edit"
        path="/investigation/:investigationGuid/task/:taskId/edit"
        element={restricted}
      />,
      <Route
        key="pilot-investigation-task-detail"
        path="/investigation/:investigationGuid/task/:taskId"
        element={restricted}
      />,
      <Route
        key="pilot-investigation-tab"
        path="/investigation/:investigationGuid/:tabKey"
        element={restricted}
      />,
      <Route
        key="pilot-investigation-detail"
        path="/investigation/:investigationGuid"
        element={restricted}
      />,
    );
  }

  if (inspectionsOnNoAccess) {
    routes.push(
      <Route
        key="pilot-inspections-list"
        path="/inspections"
        element={restricted}
      />,
      <Route
        key="pilot-inspection-edit"
        path="/inspection/:id/edit"
        element={restricted}
      />,
      <Route
        key="pilot-inspection-tab"
        path="/inspection/:inspectionGuid/:tabKey"
        element={restricted}
      />,
      <Route
        key="pilot-inspection-detail"
        path="/inspection/:inspectionGuid"
        element={restricted}
      />,
    );
  }

  return routes;
};
