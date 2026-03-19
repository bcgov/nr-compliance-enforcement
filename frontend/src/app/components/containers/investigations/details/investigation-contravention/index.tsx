import { ContraventionItem } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-item";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { ADD_EDIT_CONTRAVENTION } from "@/app/types/modal/modal-types";
import { Contravention, Investigation } from "@/generated/graphql";
import { FC, useState } from "react";
import { Button } from "react-bootstrap";

interface InvestigationContraventionProps {
  investigationGuid: string;
  investigationData?: Investigation;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const InvestigationContraventions: FC<InvestigationContraventionProps> = ({
  investigationGuid,
  investigationData,
  onDirtyChange,
}) => {
  // State
  const [editingContraventionId, setEditingContraventionId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const contraventions = investigationData?.contraventions;

  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning(onDirtyChange);

  const handleAddContravention = () => {
    dispatch(
      openModal({
        modalSize: "xl",
        modalType: ADD_EDIT_CONTRAVENTION,
        data: {
          activityGuid: investigationGuid,
          parties: investigationData?.parties,
          onDirtyChange: handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const handleEditContravention = (contraventionId: string) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    dispatch(
      openModal({
        modalSize: "xl",
        modalType: ADD_EDIT_CONTRAVENTION,
        data: {
          activityGuid: investigationGuid,
          parties: investigationData?.parties,
          contravention,
          contraventionNumber: contravention?.contraventionIdentifier,
          handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  return (
    <div className="comp-details-view">
      <div className="row">
        <div className="col-12">
          <h3>Outcomes</h3>
        </div>
      </div>

      <div className="contraventions-list">
        {contraventions?.map((contravention, index) => (
          <div key={contravention?.contraventionIdentifier}>
            <ContraventionItem
              contravention={contravention as Contravention}
              investigationGuid={investigationGuid}
              index={index}
              canEdit={!editingContraventionId}
              onEdit={handleEditContravention}
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
            onClick={handleAddContravention}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add contravention</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
