import { FC } from "react";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";
import { formatDate, applyStatusClass } from "@common/methods";
import { Investigation } from "@/generated/graphql";
import { SummaryPopupLayout } from "./summary-popup-layout";
import { useAppSelector } from "@hooks/hooks";

const GET_INVESTIGATION_POPUP = gql`
  query GetInvestigationForPopup($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      investigationGuid
      name
      openedTimestamp
      leadAgency
      locationAddress
      locationDescription
      investigationStatus {
        shortDescription
        investigationStatusCode
      }
    }
  }
`;

type Props = {
  investigationGuid: string;
};

export const InvestigationSummaryPopup: FC<Props> = ({ investigationGuid }) => {
  const { data, isLoading, error } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION_POPUP, {
    queryKey: ["getInvestigationPopup", investigationGuid],
    variables: { investigationGuid },
    enabled: Boolean(investigationGuid),
  });

  const agencyCodes = useAppSelector((state) => state.codeTables.agency);

  const investigation = data?.getInvestigation;
  const status = investigation?.investigationStatus?.shortDescription ?? "Unknown";
  const openedDate = investigation?.openedTimestamp ? formatDate(investigation.openedTimestamp, true) : "Unknown";
  const community = investigation?.locationAddress ?? "Unknown";
  const leadAgency = investigation?.leadAgency ?? "Unknown agency";
  const name = investigation?.name ?? investigationGuid;
  const officerAssigned = "Not Assigned";

  const agencyCode = agencyCodes?.find(({ agency }) => agency === leadAgency)?.shortDescription ?? leadAgency;
  const agencyName = agencyCodes?.find(({ agency }) => agency === leadAgency)?.longDescription;

  return (
    <SummaryPopupLayout
      title={name}
      identifier={investigationGuid}
      status={status}
      statusClassName={applyStatusClass(status)}
      loggedValue={openedDate}
      officerValue={officerAssigned}
      officerAgency={agencyCode}
      officerAgencyName={agencyName}
      officerUnassigned={officerAssigned === "Not Assigned"}
      locationValue={community}
      detailsPath={`/investigation/${investigationGuid}`}
      detailsLabel="View investigation details"
      loading={isLoading}
      loadingMessage="Loading investigation..."
      error={error}
      errorMessage="Unable to load investigation."
    />
  );
};

export default InvestigationSummaryPopup;
