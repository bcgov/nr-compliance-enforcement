import { ContraventionItem } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-item";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { ADD_CONTRAVENTION } from "@/app/types/modal/modal-types";
import { Contravention, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC } from "react";
import { Button } from "react-bootstrap";

interface InvestigationContraventionProps {
  investigationGuid: string;
  investigationData?: Investigation;
}

export const InvestigationContraventions: FC<InvestigationContraventionProps> = ({
  investigationGuid,
  investigationData,
}) => {
  const dispatch = useAppDispatch();

  const contraventions = investigationData?.contraventions;

  const handleAddContravention = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "xl",
        modalType: ADD_CONTRAVENTION,
        data: {
          title: "Add contravention to investigation",
          action: "Add",
          activityGuid: investigationGuid,
          parties: investigationData?.parties,
        },
      }),
    );
  };

  return (
    <div className="comp-details-view">
      <div className="row">
        <div className="col-12">
          <h3>Contraventions</h3>
        </div>
      </div>
      <div className="contraventions-list">
        {contraventions?.map((contravention, index) => (
          <div key={contravention?.contraventionIdentifier}>
            <ContraventionItem
              contravention={contravention as Contravention}
              investigationGuid={investigationGuid}
              index={index}
              parties={investigationData?.parties as InvestigationParty[]}
            />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-12">
          <Button
            variant="primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={() => handleAddContravention()}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add contravention</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
