import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { gql } from "graphql-request";
import { CaseEditHeader } from "./case-edit-header";
import { CompSelect } from "@components/common/comp-select";
import { ValidationTextArea } from "@common/validation-textarea";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectAgencyDropdown, selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";
import { useGraphQLQuery } from "@graphql/hooks/useGraphQLQuery";
import { useGraphQLMutation } from "@graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { CaseMomsSpaghettiFileCreateInput, CaseMomsSpaghettiFileUpdateInput } from "@/generated/graphql";

const CREATE_CASE_MUTATION = gql`
  mutation CreateCaseMomsSpaghettiFile($input: CaseMomsSpaghettiFileCreateInput!) {
    createCaseMomsSpaghettiFile(input: $input) {
      caseFileGuid
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
  mutation UpdateCaseMomsSpaghettiFile($caseFileGuid: String!, $input: CaseMomsSpaghettiFileUpdateInput!) {
    updateCaseMomsSpaghettiFile(caseFileGuid: $caseFileGuid, input: $input) {
      caseFileGuid
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
  query GetCaseMomsSpaghetttiFile($caseFileGuid: String!) {
    caseMomsSpaghettiFile(caseFileGuid: $caseFileGuid) {
      __typename
      caseFileGuid
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
  const agencyOptions = useAppSelector(selectAgencyDropdown).filter((option) => option.value !== "NRS");

  const { data: caseData, isLoading: isCaseLoading } = useGraphQLQuery(GET_CASE_FILE, {
    queryKey: ["caseMomsSpaghettiFile", id],
    variables: { caseFileGuid: id },
    enabled: isEditMode,
  });

  const createCaseMutation = useGraphQLMutation(CREATE_CASE_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess("Case created successfully");
      navigate(`/case/${data.createCaseMomsSpaghettiFile.caseFileGuid}`);
    },
    onError: (error: any) => {
      console.error("Error creating case:", error);
      ToggleError("Failed to create case");
    },
  });

  const updateCaseMutation = useGraphQLMutation(UPDATE_CASE_MUTATION, {
    invalidateQueries: [["caseMomsSpaghettiFile", id], ["searchCaseMomsSpaghettiFiles"]],
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
    if (isEditMode && caseData?.caseMomsSpaghettiFile) {
      return {
        caseStatus: caseData.caseMomsSpaghettiFile.caseStatus?.caseStatusCode || "",
        leadAgencyCode: caseData.caseMomsSpaghettiFile.leadAgency?.agencyCode || "",
        description: caseData.caseMomsSpaghettiFile.description || "",
      };
    }
    return {
      caseStatus: "",
      leadAgencyCode: "",
      description: "",
    };
  }, [isEditMode, caseData]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (isEditMode) {
        const updateInput: CaseMomsSpaghettiFileUpdateInput = {
          caseStatus: value.caseStatus,
          leadAgencyCode: value.leadAgencyCode,
        };

        updateCaseMutation.mutate({
          caseFileGuid: id,
          input: updateInput,
        });
      } else {
        const createInput: CaseMomsSpaghettiFileCreateInput = {
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

  return (
    <div className="comp-complaint-details">
      <CaseEditHeader
        cancelButtonClick={cancelButtonClick}
        saveButtonClick={saveButtonClick}
        isEditMode={isEditMode}
        caseFileGuid={id}
      />

      <section className="comp-details-body comp-details-form comp-container">
        <div className="comp-details-section-header">
          <h2>Case Details</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <fieldset disabled={isSubmitting || (isEditMode && isCaseLoading)}>
            <form.Field
              name="caseStatus"
              validators={{
                onChange: z.string().min(1, "Case status is required"),
              }}
              children={(field) => {
                const error = field.state.meta.errors?.[0]?.message || "";
                return (
                  <div className="comp-details-form-row">
                    <label htmlFor="case-status-select">
                      Case status<span className="required-ind">*</span>
                    </label>
                    <div className="comp-details-edit-input">
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
                        errorMessage={error}
                        isDisabled={isSubmitting || (isEditMode && isCaseLoading)}
                      />
                    </div>
                  </div>
                );
              }}
            />

            <form.Field
              name="leadAgencyCode"
              validators={{
                onChange: z.string().min(1, "Lead agency is required"),
              }}
              children={(field) => {
                const error = field.state.meta.errors?.[0]?.message || "";
                return (
                  <div className="comp-details-form-row">
                    <label htmlFor="lead-agency-select">
                      Lead agency<span className="required-ind">*</span>
                    </label>
                    <div className="comp-details-edit-input">
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
                        errorMessage={error}
                        isDisabled={isSubmitting || (isEditMode && isCaseLoading)}
                      />
                    </div>
                  </div>
                );
              }}
            />

            <form.Field
              name="description"
              children={(field) => (
                <div className="comp-details-form-row">
                  <label htmlFor="case-description">Case description</label>
                  <div className="comp-details-edit-input">
                    <ValidationTextArea
                      id="case-description"
                      className="comp-form-control comp-details-input"
                      rows={4}
                      defaultValue={field.state.value}
                      onChange={(value: string) => field.handleChange(value)}
                      placeholderText="Enter case description..."
                      maxLength={4000}
                      errMsg=""
                      disabled={isSubmitting || (isEditMode && isCaseLoading)}
                    />
                  </div>
                </div>
              )}
            />
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default CaseEdit;
