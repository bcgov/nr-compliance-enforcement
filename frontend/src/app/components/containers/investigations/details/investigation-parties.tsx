import PartiesList from "@/app/components/common/parties-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { REMOVE_PARTY } from "@/app/types/modal/modal-types";
import { InspectionParty, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CaseActivities } from "@/app/constants/case-activities";
import { useInvestigationReadOnly } from "../hooks/use-investigation-read-only";

interface InvestigationPartiesProps {
  investigationGuid: string;
  investigationData?: Investigation;
  // onDirtyChange is no longer used now that add/edit are full pages; kept for prop compatibility.
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
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const handleAddParty = () => {
    navigate(`/investigation/${investigationGuid}/party/add`);
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
    navigate(`/investigation/${investigationGuid}/party/${(party as InvestigationParty).partyIdentifier}/edit`);
  };

  const parties = (investigationData?.parties ?? []).filter(Boolean) as InvestigationParty[];

  return (
    <>
      <div className="row align-items-center mb-3">
        <div className="col">
          <h2 className="mb-0">Parties</h2>
        </div>
        <div className="col-auto">
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
      <div className="row">
        <div className="col-12">
          <PartiesList
            parties={parties}
            onRemoveParty={isReadOnly ? undefined : handleRemoveParty}
            onEditParty={isReadOnly ? undefined : handleEditParty}
            onViewParty={(partyIdentifier) => navigate(`/investigation/${investigationGuid}/party/${partyIdentifier}`)}
            activityType={CaseActivities.INVESTIGATION}
          />
        </div>
      </div>
    </>
  );
};

export default InvestigationParties;
