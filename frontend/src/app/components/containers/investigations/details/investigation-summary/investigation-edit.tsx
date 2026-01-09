import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { InvestigationForm } from "@/app/components/containers/investigations/details/investigation-summary/investigation-form";
import { useGraphQLQuery } from "@/app/graphql/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import { getUserAgency } from "@/app/service/user-service";
import { openModal } from "@/app/store/reducers/app";
import { selectComplaintStatusCodeDropdown } from "@/app/store/reducers/code-table";
import { CANCEL_CONFIRM } from "@/app/types/modal/modal-types";
import { UpdateInvestigationInput } from "@/generated/graphql";
import { useForm } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useCallback, useMemo } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface InvestigationFormProps {
  caseIdentifier: string;
  id: string;
  onClose: () => void;
}

const UPDATE_INVESTIGATION_MUTATION = gql`
  mutation UpdateInvestigation($investigationGuid: String!, $input: UpdateInvestigationInput!) {
    updateInvestigation(investigationGuid: $investigationGuid, input: $input) {
      investigationGuid
      description
      name
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
      primaryInvestigatorGuid
      supervisorGuid
      fileCoordinatorGuid
      discoveryDate
    }
  }
`;

const GET_INVESTIGATION = gql`
  query GetInvestigation($investigationGuid: String!) {
    getInvestigation(investigationGuid: $investigationGuid) {
      __typename
      investigationGuid
      description
      name
      openedTimestamp
      investigationStatus {
        investigationStatusCode
        shortDescription
        longDescription
      }
      leadAgency
      locationAddress
      locationDescription
      locationGeometry
      primaryInvestigatorGuid
      supervisorGuid
      fileCoordinatorGuid
      discoveryDate
    }
    caseFilesByActivityIds(activityIdentifiers: [$investigationGuid]) {
      caseIdentifier
      name
    }
  }
`;

export const InvestigationEditForm = ({ caseIdentifier, id, onClose }: InvestigationFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);

  const updateInvestigationMutation = useGraphQLMutation(UPDATE_INVESTIGATION_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Investigation updated successfully");
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating investigation:", error);
      ToggleError("Failed to update investigation");
      onClose();
    },
  });

  const { data: investigationData, isLoading } = useGraphQLQuery(GET_INVESTIGATION, {
    queryKey: ["getInvestigation", id],
    variables: { investigationGuid: id },
  });

  const isSubmitting = updateInvestigationMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  const defaultValues = useMemo(() => {
    // If there is investigation data set the default state of the form to the investigation data
    if (investigationData?.getInvestigation) {
      return {
        investigationStatus: investigationData.getInvestigation.investigationStatus?.investigationStatusCode || "",
        leadAgency: investigationData.getInvestigation.leadAgency || "",
        description: investigationData.getInvestigation.description || "",
        locationAddress: investigationData.getInvestigation.locationAddress || "",
        locationDescription: investigationData.getInvestigation.locationDescription || "",
        locationGeometry: investigationData.getInvestigation.locationGeometry || null,
        name: investigationData.getInvestigation.name || "",
        supervisor: investigationData.getInvestigation.supervisorGuid || "",
        primaryInvestigator: investigationData.getInvestigation.primaryInvestigatorGuid || "",
        fileCoordinator: investigationData.getInvestigation.fileCoordinatorGuid || "",
        discoveryDate: investigationData.getInvestigation.discoveryDate || null,
      };
    }
    return {
      investigationStatus: statusOptions.find((opt) => opt.value === "OPEN")?.value,
      leadAgency: getUserAgency(),
      description: "",
      locationAddress: "",
      locationDescription: "",
      locationGeometry: null,
      name: "",
      supervisor: "",
      primaryInvestigator: "",
      fileCoordinator: "",
      discoveryDate: "",
    };
  }, [investigationData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const updateInput: UpdateInvestigationInput = {
        leadAgency: value.leadAgency,
        investigationStatus: value.investigationStatus,
        description: value.description,
        locationAddress: value.locationAddress,
        locationDescription: value.locationDescription,
        locationGeometry: value.locationGeometry,
        name: value.name,
        supervisorGuid: value.supervisor,
        primaryInvestigatorGuid: value.primaryInvestigator,
        fileCoordinatorGuid: value.fileCoordinator,
        discoveryDate: value.discoveryDate,
      };

      updateInvestigationMutation.mutate({
        investigationGuid: id,
        input: updateInput,
      });
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();
    onClose();
  }, [navigate, caseIdentifier, id, form]);

  const cancelButtonClick = useCallback(() => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: confirmCancelChanges,
        },
      }),
    );
  }, [dispatch, confirmCancelChanges]);

  const saveButtonClick = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  return (
    <div className="comp-investigation-edit-headerdetails">
      <Card
        className="mb-3"
        border="default"
      >
        <Card.Body>
          <InvestigationForm
            id={id}
            form={form}
            isDisabled={isDisabled}
            discoveryDate={investigationData?.getInvestigation?.discoveryDate}
          />
        </Card.Body>
      </Card>
      <div className="comp-details-form-buttons">
        <Button
          variant="outline-primary"
          id="investigation-cancel-button"
          title="Cancel"
          onClick={cancelButtonClick}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          id="investigation-save-button"
          title="Save Investigation"
          onClick={saveButtonClick}
        >
          <span>Save</span>
        </Button>
      </div>
    </div>
  );
};
