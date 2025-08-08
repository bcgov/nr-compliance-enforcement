import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { CaseEditHeader } from "./case-edit-header";
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
import { CaseFileCreateInput, CaseFileUpdateInput } from "@/generated/graphql";
import { getUserAgency } from "@/app/service/user-service";

const CREATE_CASE_MUTATION = gql`
  mutation CreateCaseFile($input: CaseFileCreateInput!) {
    createCaseFile(input: $input) {
      caseIdentifier
      caseOpenedTimestamp
      caseStatus {
        caseStatusCode
        shortDescription
        longDescription
      }
      leadAgency {
        agencyCode
        shortDescription
        longDescription
      }
    }
  }
`;

const UPDATE_CASE_MUTATION = gql`
  mutation UpdateCaseFile($caseIdentifier: String!, $input: CaseFileUpdateInput!) {
    updateCaseFile(caseIdentifier: $caseIdentifier, input: $input) {
      caseIdentifier
      caseOpenedTimestamp
      caseStatus {
        caseStatusCode
        shortDescription
        longDescription
      }
      leadAgency {
        agencyCode
        shortDescription
        longDescription
      }
    }
  }
`;

const GET_CASE_FILE = gql`
  query GetCaseFile($caseIdentifier: String!) {
    caseFile(caseIdentifier: $caseIdentifier) {
      __typename
      caseIdentifier
      caseOpenedTimestamp
      caseStatus {
        caseStatusCode
        shortDescription
        longDescription
      }
      leadAgency {
        agencyCode
        shortDescription
        longDescription
      }
      caseActivities {
        __typename
      }
    }
  }
`;

const CaseEdit: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const statusOptions = useAppSelector(selectComplaintStatusCodeDropdown);
  const agencyOptions = useAppSelector(selectAgencyDropdown);

  const { data: caseData, isLoading } = useGraphQLQuery(GET_CASE_FILE, {
    queryKey: ["caseFile", id],
    variables: { caseIdentifier: id },
    enabled: isEditMode,
  });

  const createCaseMutation = useGraphQLMutation(CREATE_CASE_MUTATION, {
    invalidateQueries: ["searchCaseFiles"],
    onSuccess: (data: any) => {
      ToggleSuccess("Case created successfully");
      navigate(`/case/${data.createCaseFile.caseIdentifier}`);
    },
    onError: (error: any) => {
      console.error("Error creating case:", error);
      ToggleError("Failed to create case");
    },
  });

  const updateCaseMutation = useGraphQLMutation(UPDATE_CASE_MUTATION, {
    invalidateQueries: [["caseFile", id], "searchCaseFiles"],
    onSuccess: (data: any) => {
      ToggleSuccess("Case updated successfully");
      navigate(`/case/${id}`);
    },
    onError: (error: any) => {
      console.error("Error updating case:", error);
      ToggleError("Failed to update case");
    },
  });

  const defaultValues = useMemo(() => {
    // If there is case data set the default state of the form to the case data
    if (isEditMode && caseData?.caseFile) {
      return {
        caseStatus: caseData.caseFile.caseStatus?.caseStatusCode || "",
        leadAgencyCode: caseData.caseFile.leadAgency?.agencyCode || "",
        description: caseData.caseFile.description || "",
      };
    }
    return {
      caseStatus: statusOptions.filter((opt) => opt.value === "OPEN")[0].value,
      leadAgencyCode: getUserAgency(),
      description: "",
    };
  }, [isEditMode, caseData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: CaseFileUpdateInput = {
          caseStatus: value.caseStatus,
          leadAgencyCode: value.leadAgencyCode,
        };

        updateCaseMutation.mutate({
          caseIdentifier: id,
          input: updateInput,
        });
      } else {
        const createInput: CaseFileCreateInput = {
          caseStatus: value.caseStatus,
          leadAgencyCode: value.leadAgencyCode,
        };

        createCaseMutation.mutate({ input: createInput });
      }
    },
  });

  const confirmCancelChanges = useCallback(() => {
    form.reset();

    if (isEditMode && id) {
      navigate(`/case/${id}`);
    } else {
      navigate("/cases");
    }
  }, [navigate, isEditMode, id, form]);

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

  const isSubmitting = createCaseMutation.isPending || updateCaseMutation.isPending;
  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="comp-complaint-details">
      <CaseEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        caseIdentifier={id}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Case Details</h2>
        </div>

        <form onSubmit={form.handleSubmit}>
          <fieldset disabled={isDisabled}>
            <FormField
              form={form}
              name="caseStatus"
              label="Case status"
              required
              validators={{ onChange: z.string().min(1, "Case status is required") }}
              render={(field) => (
                <CompSelect
                  id="case-status-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={statusOptions}
                  value={statusOptions.find((opt) => opt.value === field.state.value)}
                  onChange={(option) => field.handleChange(option?.value || "")}
                  placeholder="Select case status"
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
              name="leadAgencyCode"
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
              name="description"
              label="Case description"
              required
              validators={{ onChange: z.string().min(1, "Description is required") }}
              render={(field) => (
                <ValidationTextArea
                  id="case-description"
                  className="comp-form-control comp-details-input"
                  rows={4}
                  defaultValue={field.state.value}
                  onChange={(value: string) => field.handleChange(value)}
                  placeholderText="Enter case description..."
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

export default CaseEdit;
