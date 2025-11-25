import PartiesList from "@/app/components/common/parties-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_PARTY, REMOVE_PARTY } from "@/app/types/modal/modal-types";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import { FC, useCallback } from "react";
import { Button } from "react-bootstrap";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CaseActivities } from "@/app/constants/case-activities";

interface InvestigationPartiesProps {
  investigationGuid: string;
  investigationData?: Investigation;
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

export const InvestigationSummary: FC<InvestigationPartiesProps> = ({ investigationGuid, investigationData }) => {
  const dispatch = useAppDispatch();

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
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_PARTY,
        data: {
          title: "Add party to investigation",
          description: "",
          activityGuid: investigationGuid,
          activityType: "investigation",
        },
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
          <Button
            variant="warning"
            size="sm"
            onClick={handleAddParty}
          >
            <i className="bi bi-plus-circle me-1" /> {/**/}
            Add Party
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-4">
          <PartiesList
            companies={businessParties as InvestigationParty[]}
            people={peopleParties as InvestigationParty[]}
            onRemoveParty={handleRemoveParty}
            activityType={CaseActivities.INVESTIGATION}
          />
        </div>
      </div>
    </>
  );
};

export default InvestigationSummary;
