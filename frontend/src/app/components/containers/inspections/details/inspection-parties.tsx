import PartiesList from "@/app/components/common/parties-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_PARTY, REMOVE_PARTY } from "@/app/types/modal/modal-types";
import { Inspection, InspectionParty } from "@/generated/graphql";
import { FC, useCallback } from "react";
import { Button } from "react-bootstrap";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CaseActivities } from "@/app/constants/case-activities";

interface InspectionPartiesProps {
  inspectionGuid: string;
  inspectionData?: Inspection;
}

const REMOVE_PARTY_FROM_INSPECTION_MUTATION = gql`
  mutation RemovePartyFromInspection($inspectionGuid: String!, $partyIdentifier: String!) {
    removePartyFromInspection(inspectionGuid: $inspectionGuid, partyIdentifier: $partyIdentifier) {
      inspectionGuid
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

export const InspectionSummary: FC<InspectionPartiesProps> = ({ inspectionGuid, inspectionData }) => {
  const dispatch = useAppDispatch();

  const removePartyMutation = useGraphQLMutation(REMOVE_PARTY_FROM_INSPECTION_MUTATION, {
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
          title: "Add party to inspection",
          description: "",
          activityGuid: inspectionGuid,
          activityType: "inspection",
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
            description: `Are you sure you want to remove ${partyName} from this inspection? This action cannot be undone.`,
          },
          callback: () => {
            removePartyMutation.mutate({
              inspectionGuid: inspectionGuid,
              partyIdentifier: partyIdentifier,
            });
          },
        }),
      );
    },
    [dispatch, inspectionGuid, removePartyMutation],
  );

  const parties = inspectionData?.parties ?? [];

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
            companies={businessParties as InspectionParty[]}
            people={peopleParties as InspectionParty[]}
            onRemoveParty={handleRemoveParty}
            activityType={CaseActivities.INSPECTION}
          />
        </div>
      </div>
    </>
  );
};

export default InspectionSummary;
