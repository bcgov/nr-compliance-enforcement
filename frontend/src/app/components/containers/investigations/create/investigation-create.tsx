import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { gql } from "graphql-request";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal, appUserGuid } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CreateInvestigationInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";
import { InvestigationCreateHeader } from "@/app/components/containers/investigations/create/investigation-create-header";
import { InvestigationForm } from "@/app/components/containers/investigations/details/investigation-summary/investigation-form";

const CREATE_INVESTIGATION_MUTATION = gql`
  mutation CreateInvestigation($input: CreateInvestigationInput!) {
    createInvestigation(input: $input) {
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

const InvestigationCreate: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier } = useParams<{ caseIdentifier?: string }>();

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const currentAppUserGuid = useAppSelector(appUserGuid);

  const createInvestigationMutation = useGraphQLMutation(CREATE_INVESTIGATION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Investigation created successfully");
      navigate(`/investigation/${data.createInvestigation.investigationGuid}`);
    },
    onError: (error: any) => {
      console.error("Error creating investigation:", error);
      ToggleError("Failed to create investigation");
    },
  });

  const form = useForm({
    defaultValues: {
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
    },
    onSubmit: async ({ value }) => {
      const createInput: CreateInvestigationInput = {
        caseIdentifier: caseIdentifier as string,
        leadAgency: value.leadAgency,
        description: value.description,
        name: value.name,
        investigationStatus: value.investigationStatus,
        locationAddress: value.locationAddress,
        locationDescription: value.locationDescription,
        locationGeometry: value.locationGeometry,
        createdByAppUserGuid: currentAppUserGuid || "",
        supervisorGuid: value.supervisor ?? undefined,
        primaryInvestigatorGuid: value.primaryInvestigator ?? "",
        fileCoordinatorGuid: value.fileCoordinator ?? "",
        discoveryDate: value.discoveryDate,
      };

      createInvestigationMutation.mutate({ input: createInput });
    },
    onSubmitInvalid: () => {
      ToggleError("Errors in form");
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (caseIdentifier) {
      navigate(`/case/${caseIdentifier}`);
    } else {
      navigate(`/investigations`);
    }
  }, [navigate, caseIdentifier, form]);

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

  const isSubmitting = createInvestigationMutation.isPending;
  const isDisabled = isSubmitting;

  return (
    <div className="comp-investigation-edit-headerdetails">
      <InvestigationCreateHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        caseIdentifier={caseIdentifier}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Investigation details</h2>
        </div>
        <InvestigationForm
          form={form}
          isDisabled={isDisabled}
        />
      </section>
    </div>
  );
};

export default InvestigationCreate;
