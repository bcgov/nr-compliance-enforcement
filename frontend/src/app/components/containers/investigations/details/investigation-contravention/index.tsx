import { ContraventionForm } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-form";
import { ContraventionItem } from "@/app/components/containers/investigations/details/investigation-contravention/contravention-item";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useModalDirtyWarning } from "@/app/hooks/use-unsaved-changes-warning";
import { openModal } from "@/app/store/reducers/app";
import { MULTI_STEP_MODAL } from "@/app/types/modal/modal-types";
import { Contravention, Investigation, InvestigationParty } from "@/generated/graphql";
import { FC } from "react";
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
  const dispatch = useAppDispatch();
  const contraventions = investigationData?.contraventions;

  const { handleChildDirtyChange, hideCallback } = useModalDirtyWarning(onDirtyChange);

  const handleAddContravention = () => {
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Add contravention", "Add party"],
          totalSteps: 2,
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onClose: () => void,
            // Note this is an intentional architectural decisions to allow for a reusable multi-step modal
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <ContraventionForm
              currentStep={currentStep}
              activityGuid={investigationGuid}
              contravention={undefined}
              parties={investigationData?.parties as InvestigationParty[]}
              onDirtyChange={handleChildDirtyChange}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onClose={onClose}
            />
          ),
          handleChildDirtyChange,
        },
        hideCallback,
      }),
    );
  };

  const handleEditContravention = (contraventionId: string) => {
    const contravention = contraventions?.find((c) => c?.contraventionIdentifier === contraventionId);
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: ["Edit contravention", "Edit party"],
          totalSteps: 2,
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onClose: () => void,
            // Note this is an intentional architectural decisions to allow for a reusable multi-step modal
            // eslint-disable-next-line react/no-unstable-nested-components
          ) => (
            <ContraventionForm
              currentStep={currentStep}
              activityGuid={investigationGuid}
              contravention={contravention ?? undefined}
              parties={investigationData?.parties as InvestigationParty[]}
              onDirtyChange={handleChildDirtyChange}
              onRequestValidate={onRequestValidate}
              onRequestSave={onRequestSave}
              onClose={onClose}
            />
          ),
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
