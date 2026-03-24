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

  const openContraventionModal = (contraventionId?: string) => {
    const contravention = contraventionId
      ? contraventions?.find((c) => c?.contraventionIdentifier === contraventionId)
      : undefined;

    const isEdit = !!contravention;

    dispatch(
      openModal({
        modalSize: "lg",
        modalType: MULTI_STEP_MODAL,
        data: {
          titles: isEdit ? ["Edit contravention", "Edit party"] : ["Add contravention", "Add party"],
          totalSteps: 2,
          content: (
            currentStep: number,
            onRequestValidate: (fn: (step: number) => Promise<boolean>) => void,
            onRequestSave: (fn: () => Promise<void>) => void,
            onClose: () => void,
            // Note: this is an intentional architectural decision to allow for a reusable multi-step modal
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
              onEdit={() => openContraventionModal(contravention?.contraventionIdentifier)}
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
            onClick={() => openContraventionModal()}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add contravention</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
