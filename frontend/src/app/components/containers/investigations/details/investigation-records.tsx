import RecordsList from "@/app/components/common/records-list";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_PARTY } from "@/app/types/modal/modal-types";
import { Investigation, InvestigationParty } from "@/generated/graphql";
import { FC } from "react";
import { Button } from "react-bootstrap";

interface InvestigationRecordsProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

export const InvestigationSummary: FC<InvestigationRecordsProps> = ({ investigationGuid, investigationData }) => {
  const dispatch = useAppDispatch();

  const handleAddParty = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_PARTY,
        data: {
          title: "Add party to investigation",
          description: "",
          investigationGuid: investigationGuid,
        },
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
          <RecordsList
            companies={businessParties as InvestigationParty[]}
            people={peopleParties as InvestigationParty[]}
          />
        </div>
      </div>
    </>
  );
};

export default InvestigationSummary;
