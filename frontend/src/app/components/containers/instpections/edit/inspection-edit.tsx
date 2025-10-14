import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { InspectionEditHeader } from "./inspection-edit-header";
import { CompSelect } from "@components/common/comp-select";
import { FormField } from "@components/common/form-field";
import { ValidationTextArea } from "@common/validation-textarea";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CreateInspectionInput, UpdateInspectionInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";

const CREATE_INSPECTION_MUTATION = gql`
  mutation CreateInspection($input: CreateInspectionInput!) {
    createInspection(input: $input) {
      inspectionGuid
      description
      name
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
  }
`;

const UPDATE_INspecTION_MUTATION = gql`
  mutation UpdateInspection($inspectionGuid: String!, $input: UpdateInspectionInput!) {
    updateInspection(inspectionGuid: $inspectionGuid, input: $input) {
      inspectionGuid
      description
      name
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
  }
`;

const GET_INspecTION = gql`
  query GetInspection($inspectionGuid: String!) {
    getInspection(inspectionGuid: $inspectionGuid) {
      __typename
      inspectionGuid
      description
      name
      openedTimestamp
      inspectionStatus {
        inspectionStatusCode
        shortDescription
        longDescription
      }
      leadAgency
    }
    caseFileByActivityId(activityIdentifier: $inspectionGuid) {
      caseIdentifier
    }
  }
`;

const InspectionEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { caseIdentifier, id } = useParams<{ caseIdentifier?: string; id?: string }>();

  const isEditMode = !!id;

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);

  const { data: inspectionData, isLoading } = useGraphQLQuery(GET_INspecTION, {
    queryKey: ["getInspection", id],
    variables: { inspectionGuid: id },
    enabled: isEditMode,
  });

  const createInspectionMutation = useGraphQLMutation(CREATE_INSPECTION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Inspection created successfully");
      navigate(`/inspection/${data.createInspection.inspectionGuid}`);
    },
    onError: (error: any) => {
      console.error("Error creating inspection:", error);
      ToggleError("Failed to create inspection");
    },
  });

  const updateInspectionMutation = useGraphQLMutation(UPDATE_INspecTION_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Inspection updated successfully");
      navigate(`/inspection/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating inspection:", error);
      ToggleError("Failed to update inspection");
    },
  });

  const defaultValues = useMemo(() => {
    // If there is inspection data set the default state of the form to the inspection data
    if (isEditMode && inspectionData?.getInspection) {
      return {
        inspectionStatus: inspectionData.getInspection.inspectionStatus?.inspectionStatusCode || "",
        leadAgency: inspectionData.getInspection.leadAgency || "",
        description: inspectionData.getInspection.description || "",
        name: inspectionData.getInspection.name || "",
      };
    }
    return {
      inspectionStatus: statusOptions.filter((opt) => opt.value === "OPEN")[0].value,
      leadAgency: getUserAgency(),
      description: "",
      name: "",
    };
  }, [isEditMode, inspectionData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: UpdateInspectionInput = {
          leadAgency: value.leadAgency,
          inspectionStatus: value.inspectionStatus,
          description: value.description,
          name: value.name,
        };

        updateInspectionMutation.mutate({
          inspectionGuid: id,
          input: updateInput,
        });
      } else {
        const createInput: CreateInspectionInput = {
          caseIdentifier: caseIdentifier as string,
          leadAgency: value.leadAgency,
          description: value.description,
          name: value.name,
          inspectionStatus: value.inspectionStatus,
        };

        createInspectionMutation.mutate({ input: createInput });
      }
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (isEditMode && id) {
      navigate(`/inspection/${id}`);
    } else {
      navigate(`/case/${caseIdentifier}`);
    }
  }, [navigate, isEditMode, caseIdentifier, id, form]);

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

  const isSubmitting = createInspectionMutation.isPending || updateInspectionMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="comp-complaintinspection-edit-headerdetails">
      <InspectionEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        caseIdentifier={caseIdentifier}
        inspectionGuid={id}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Inspection Details</h2>
        </div>

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="inspectionStatus"
              label="Inspection status"
              required
              validators={{ onChange: z.string().min(1, "Inspection status is required") }}
              render={(field) => (
                <CompSelect
                  id="inspection-status-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={statusOptions}
                  value={statusOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select inspection status"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={isDisabled}
                />
              )}
            />

            <FormField
              form={form}
              name="leadAgency"
              label="Lead agency"
              required
              validators={{ onChange: z.string().min(1, "Lead agency is required") }}
              render={(field) => (
                <CompSelect
                  id="lead-agency-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={agencyOptions}
                  value={agencyOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select lead agency"
                  isClearable={true}
                  showInactive={false}
                  enableValidation={true}
                  errorMessage={field.state.meta.errors?.[0]?.message || ""}
                  isDisabled={true}
                />
              )}
            />

            <FormField
              form={form}
              name="name"
              label="Name"
              required
              validators={{ onChange: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less") }}
              render={(field) => (
                <input
                  type="text"
                  id="display-name"
                  className="form-control comp-details-input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter name..."
                  maxLength={100}
                  disabled={isDisabled}
                  style={{ borderColor: field.state.meta.errors?.[0] ? '#dc3545' : '' }}
                />
              )}
            />

            <FormField
              form={form}
              name="description"
              label="Inspection description"
              required
              validators={{ onChange: z.string().min(1, "Description is required") }}
              render={(field) => (
                <ValidationTextArea
                  id="description"
                  className="comp-form-control comp-details-input"
                  rows={4}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter inspection description..."
                  maxLength={4000}
                  errMsg={field.state.meta.errors?.[0]?.message || ""}
                  disabled={isDisabled}
                />
              )}
            />
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default InspectionEdit;
