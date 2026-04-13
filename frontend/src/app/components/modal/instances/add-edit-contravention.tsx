import { FC, useState } from "react";
import { Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { openModal, selectModalData } from "@store/reducers/app";
import { Contravention, CreateUpdateContraventionInput, InvestigationParty } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { StepModalFooter } from "@/app/components/modal/step-modal-footer";
import {
  ContraventionPartyForm,
  ContraventionPartyFormValues,
} from "@/app/components/containers/investigations/details/investigation-contravention/contravention-party-form";
import {
  ContraventionDetailsForm,
  ContraventionDetailsFormValues,
} from "@/app/components/containers/investigations/details/investigation-contravention/contravention-details-form";

const ADD_CONTRAVENTION = gql`
  mutation CreateContravention($input: CreateUpdateContraventionInput!) {
    createContravention(input: $input) {
      investigationGuid
    }
  }
`;

const UPDATE_CONTRAVENTION = gql`
  mutation UpdateContravention($contraventionGuid: String!, $input: CreateUpdateContraventionInput!) {
    updateContravention(contraventionGuid: $contraventionGuid, input: $input) {
      investigationGuid
    }
  }
`;

type AddEditContraventionModalProps = {
  close: () => void;
  submit: () => void;
};

export const AddEditContraventionModal: FC<AddEditContraventionModalProps> = ({ close, submit }) => {
  const modalData = useAppSelector(selectModalData);
  const { activityGuid, parties, contravention, contraventionNumber, onDirtyChange } = modalData;
  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 2;

  // Callbacks from child forms
  const [validateStep1Fn, setValidateStep1Fn] = useState<(() => Promise<boolean>) | null>(null);
  const [validateStep2Fn, setValidateStep2Fn] = useState<(() => Promise<boolean>) | null>(null);
  const [getStep1Values, setGetStep1Values] = useState<(() => ContraventionDetailsFormValues) | null>(null);
  const [getStep2Values, setGetStep2Values] = useState<(() => ContraventionPartyFormValues) | null>(null);

  const isEditMode = !!contravention;
  const title = isEditMode ? `Edit contravention ${contraventionNumber}` : "Add contravention";

  const addContraventionMutation = useGraphQLMutation(ADD_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention added successfully");
      submit();
    },
    onError: (error: any) => {
      console.error("Error adding contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to add contravention");
    },
  });

  const editContraventionMutation = useGraphQLMutation(UPDATE_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention updated successfully");
      submit();
    },
    onError: (error: any) => {
      console.error("Error updating contravention:", error);
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to update contravention");
    },
  });

  const handleNext = async () => {
    const isValid = await validateStep1Fn?.();
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    const isValid = await validateStep2Fn?.();
    if (!isValid) return;

    const step1Values = getStep1Values?.();
    const step2Values = getStep2Values?.();

    if (!step1Values || !step2Values) return;

    const input: CreateUpdateContraventionInput = {
      investigationGuid: activityGuid,
      legislationReference: step1Values.selectedSection,
      investigationPartyGuids: step2Values.selectedParties,
    };

    if (isEditMode) {
      editContraventionMutation.mutate({
        contraventionGuid: contravention?.contraventionIdentifier,
        input,
      });
    } else {
      addContraventionMutation.mutate({ input });
    }
  };

  const handleCancel = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => close(),
        },
      }),
    );
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as="h3">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentStep === 0 && (
          <ContraventionDetailsForm
            contravention={contravention as Contravention}
            onDirtyChange={onDirtyChange}
            onRequestValidate={(fn) => setValidateStep1Fn(() => fn)}
            onRequestValues={(fn) => setGetStep1Values(() => fn)}
          />
        )}
        {currentStep === 1 && (
          <ContraventionPartyForm
            contravention={contravention as Contravention}
            parties={parties as InvestigationParty[]}
            onDirtyChange={onDirtyChange}
            onRequestValidate={(fn) => setValidateStep2Fn(() => fn)}
            onRequestValues={(fn) => setGetStep2Values(() => fn)}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <StepModalFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          onCancel={handleCancel}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
          isEdit={false}
          showDeleteConfirm={false}
          onDelete={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Modal.Footer>
    </>
  );
};
