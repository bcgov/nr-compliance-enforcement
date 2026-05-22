import PartiesList from "@/app/components/common/parties-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_PARTY, REMOVE_PARTY } from "@/app/types/modal/modal-types";
import { InspectionParty, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useCallback } from "react";
import { Button } from "react-bootstrap";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CaseActivities } from "@/app/constants/case-activities";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { useInvestigationReadOnly } from "../hooks/use-investigation-read-only";

interface InvestigationPartiesProps {
  investigationGuid: string;
  investigationData?: Investigation;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

const REMOVE_PARTY_FROM_INVESTIGATION_MUTATION = gql`
  mutation RemovePartyFromInvestigation($investigationGuid: String!, $partyIdentifier: String!) {
    removePartyFromInvestigation(investigationGuid: $investigationGuid, partyIdentifier: $partyIdentifier) {
      investigationGuid
      parties {
        partyIdentifier
        person {
          firstName
          lastName
          personGuid
        }
        business {
          name
          businessGuid
        }
      }
    }
  }
`;

export const InvestigationParties: FC<InvestigationPartiesProps> = ({
  investigationGuid,
  investigationData,
  onDirtyChange,
}) => {
  const dispatch = useAppDispatch();
  const isReadOnly = useInvestigationReadOnly(investigationGuid);

  const removePartyMutation = useGraphQLMutation(REMOVE_PARTY_FROM_INVESTIGATION_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Party removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing party:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove party");
    },
  });

  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning(onDirtyChange);

  const handleAddParty = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_PARTY,
        data: {
          title: "Add party to investigation",
          modalMode: "add",
          description: "",
          activityGuid: investigationGuid,
          activityType: "investigation",
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const handleRemoveParty = useCallback(
    (partyIdentifier: string, partyName: string) => {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: REMOVE_PARTY,
          data: {
            title: "Remove Party",
            description: `Are you sure you want to remove ${partyName} from this investigation? This action cannot be undone.`,
          },
          callback: () => {
            removePartyMutation.mutate({
              investigationGuid: investigationGuid,
              partyIdentifier: partyIdentifier,
            });
          },
        }),
      );
    },
    [dispatch, investigationGuid, removePartyMutation],
  );

  const handleEditParty = (party: InvestigationParty | InspectionParty) => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_PARTY,
        data: {
          title: "Edit party in investigation",
          modalMode: "edit",
          description: "",
          activityGuid: investigationGuid,
          activityType: "investigation",
          party: party,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const parties = investigationData?.parties ?? [];

  const { peopleParties, businessParties } = parties.reduce(
    (acc, party) => {
      if (party?.person) acc.peopleParties.push(party);
      if (party?.business) acc.businessParties.push(party);
      return acc;
    },
    { peopleParties: [] as typeof parties, businessParties: [] as typeof parties },
  );

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h2>Parties</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <PartiesList
            companies={businessParties as InvestigationParty[]}
            people={peopleParties as InvestigationParty[]}
            onRemoveParty={isReadOnly ? undefined : handleRemoveParty}
            onEditParty={isReadOnly ? undefined : handleEditParty}
            activityType={CaseActivities.INVESTIGATION}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Button
            id="add-party-button"
            variant="primary"
            size="sm"
            onClick={handleAddParty}
            disabled={isReadOnly}
          >
            <i className="bi bi-plus-circle me-1" /> {/**/}
            Add party
          </Button>
        </div>
      </div>
    </>
  );
};

export default InvestigationParties;
