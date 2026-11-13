import { FC } from "react";
import { Modal } from "react-bootstrap";
import { gql } from "graphql-request";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { appUserGuid as selectAppUserGuid, selectModalData } from "@store/reducers/app";
import { AgencyBanner } from "@components/containers/layout/agency-banner";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectAgenciesWithFeature, selectCodeTable } from "@store/reducers/code-table";
import { filterOfficerByAgency, selectOfficers } from "@store/reducers/officer";
import { generateApiParameters, post } from "@common/api";
import config from "@/config";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { Roles } from "@/app/types/app/roles";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { AgencyType } from "@/app/types/app/agency-types";
import { Investigation, AppUserActivityXref } from "@/generated/graphql";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { GET_INVESTIGATION } from "@/app/components/containers/investigations/details/investigation-details";
import { CollaboratorsForm } from "@/app/components/common/collaborators-form";

const ADD_COLLABORATOR_TO_INVESTIGATION = gql`
  mutation AddCollaboratorToInvestigation($investigationGuid: String!, $appUserGuid: String!) {
    addCollaboratorToInvestigation(investigationGuid: $investigationGuid, appUserGuid: $appUserGuid) {
      investigationGuid
    }
  }
`;

const REMOVE_COLLABORATOR_FROM_INVESTIGATION = gql`
  mutation RemoveCollaboratorFromInvestigation($investigationGuid: String!, $appUserActivityXrefGuid: String!) {
    removeCollaboratorFromInvestigation(
      investigationGuid: $investigationGuid
      appUserActivityXrefGuid: $appUserActivityXrefGuid
    ) {
      investigationGuid
    }
  }
`;

type ManageInvestigationCollaboratorsModalProps = {
  submit: () => void;
  investigationGuid: string;
};

export const ManageInvestigationCollaboratorsModal: FC<ManageInvestigationCollaboratorsModalProps> = ({
  submit,
  investigationGuid,
}) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const investigationAgencies = useAppSelector((state) =>
    selectAgenciesWithFeature(state, FEATURE_TYPES.INVESTIGATIONS),
  );
  const officers = useAppSelector(selectOfficers);
  const currentUserGuid = useAppSelector(selectAppUserGuid);

  const { title, onDirtyChange } = modalData;

  const { data } = useGraphQLQuery<{ getInvestigation: Investigation }>(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", investigationGuid],
    variables: { investigationGuid },
    enabled: !!investigationGuid,
  });
  const investigationCollaborators = (data?.getInvestigation?.collaborators as AppUserActivityXref[]) ?? [];
  const collaborators = investigationCollaborators.map((collaborator) => {
    const officer = officers?.find((o) => o.app_user_guid === collaborator.appUserGuid);
    return {
      appUserGuid: collaborator.appUserGuid,
      firstName: officer?.first_name,
      lastName: officer?.last_name,
      collaboratorAgency: officer?.agency_code_ref,
    };
  });

  const addCollaboratorMutation = useGraphQLMutation(ADD_COLLABORATOR_TO_INVESTIGATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: async (_, { appUserGuid }) => {
      ToggleSuccess("Collaborator added successfully");
      try {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/email/investigation-collaborator`, {
          investigationGuid,
          appUserGuid,
          investigationUrl: `${window.location.origin}/investigation/${investigationGuid}`,
        });
        await post(dispatch, parameters);
      } catch {
        ToggleError("Unable to send collaborator email");
      }
    },
    onError: () => {
      ToggleError("Failed to add collaborator");
    },
  });

  const removeCollaboratorMutation = useGraphQLMutation(REMOVE_COLLABORATOR_FROM_INVESTIGATION, {
    invalidateQueries: [["getInvestigation", investigationGuid]],
    onSuccess: () => {
      ToggleSuccess("Collaborator removed successfully");
    },
    onError: () => {
      ToggleError("Failed to remove collaborator");
    },
  });

  const getUserOptions = (agency: string) =>
    filterOfficerByAgency(agency, officers ?? [])
      .filter((officer: AppUser) => officer.user_roles.includes(Roles.CASE_ACCESS))
      .filter(
        (officer) =>
          officer.app_user_guid !== currentUserGuid &&
          !collaborators.some((c) => c.appUserGuid === officer.app_user_guid),
      )
      .map((officer: AppUser) => ({
        value: officer.app_user_guid,
        label: `${officer.last_name}, ${officer.first_name}`,
      }));

  const agencyOptions = agencies
    .filter((agency) => investigationAgencies.includes(agency.agency) && agency.agency !== AgencyType.SECTOR)
    .map((agency) => ({
      label: agency.longDescription,
      labelElement: <AgencyBanner agency={agency.agency} />,
      value: agency.agency,
    }));

  const handleAddCollaborator = (appUserGuid: string) => {
    addCollaboratorMutation.mutate({ investigationGuid, appUserGuid });
  };

  const handleRemoveCollaborator = (appUserGuid: string) => {
    const collaborator = investigationCollaborators.find((c) => c.appUserGuid === appUserGuid);
    if (collaborator) {
      removeCollaboratorMutation.mutate({
        investigationGuid,
        appUserActivityXrefGuid: collaborator.appUserActivityXrefGuid,
      });
    }
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h1">{`${title}`}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <CollaboratorsForm
          agencyOptions={agencyOptions}
          getUserOptions={getUserOptions}
          collaborators={collaborators}
          onAdd={handleAddCollaborator}
          onRemove={handleRemoveCollaborator}
          onDirtyChange={onDirtyChange}
          submit={submit}
        />
      </Modal.Body>
    </>
  );
};
