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

  const contraventions = investigationData?.contraventions ?? [];

  const handleAddContravention = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
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
      <div className="d-flex align-items-center gap-4 mb-3">
        <h3 className="mb-0">Contraventions</h3>
        <Button
          variant="outline-primary"
          size="sm"
          id="details-screen-edit-button"
          onClick={() => handleAddContravention()}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Add Contravention</span>
        </Button>
      </div>
      <div className="contraventions-list">
        {contraventions.map((contravention, index) => (
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
    </div>
  );
};
