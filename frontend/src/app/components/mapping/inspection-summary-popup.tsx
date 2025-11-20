import { FC } from "react";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { formatDate, applyStatusClass } from "@common/methods";
import { Inspection } from "@/generated/graphql";
import { SummaryPopupLayout } from "./summary-popup-layout";

const GET_INSPECTION_POPUP = gql`
  query GetInspectionForPopup($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
      inspectionGuid
      name
      openedTimestamp
      leadAgency
      locationAddress
      inspectionStatus {
        shortDescription
        inspectionStatusCode
      }
    }
  }
`;

type Props = {
  inspectionGuid: string;
};

export const InspectionSummaryPopup: FC<Props> = ({ inspectionGuid }) => {
  const { data, isLoading, error } = useGraphQLQuery<{ getInspection: Inspection }>(GET_INSPECTION_POPUP, {
    queryKey: ["getInspectionPopup", inspectionGuid],
    variables: { inspectionGuid },
    enabled: Boolean(inspectionGuid),
  });

  const inspection = data?.getInspection;
  const name = inspection?.name ?? "Inspection";
  const status = inspection?.inspectionStatus?.shortDescription ?? "Unknown";
  const openedDate = inspection?.openedTimestamp ? formatDate(inspection.openedTimestamp, true) : "Unknown";
  const location = inspection?.locationAddress ?? "Unknown";
  const leadAgency = inspection?.leadAgency ?? "Unknown agency";
  const officerAssigned = "Not Assigned";

  return (
    <SummaryPopupLayout
      title={name}
      identifier={inspectionGuid}
      status={status}
      statusClassName={applyStatusClass(status)}
      loggedValue={openedDate}
      officerValue={officerAssigned}
      officerAgency={leadAgency}
      officerUnassigned={officerAssigned === "Not Assigned"}
      locationValue={location}
      detailsPath={`/inspection/${inspectionGuid}`}
      detailsLabel="View inspection details"
      loading={isLoading}
      loadingMessage="Loading inspection..."
      error={error}
      errorMessage="Unable to load inspection."
    />
  );
};

export default InspectionSummaryPopup;
