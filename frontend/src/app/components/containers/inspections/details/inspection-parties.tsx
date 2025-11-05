import PartiesList from "@/app/components/common/parties-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_PARTY } from "@/app/types/modal/modal-types";
import { Inspection, InspectionParty } from "@/generated/graphql";
import { FC } from "react";
import { Button } from "react-bootstrap";

interface InspectionPartiesProps {
  inspectionGuid: string;
  inspectionData?: Inspection;
}

export const InspectionSummary: FC<InspectionPartiesProps> = ({ inspectionGuid, inspectionData }) => {
  const dispatch = useAppDispatch();

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
          />
        </div>
      </div>
    </>
  );
};

export default InspectionSummary;
