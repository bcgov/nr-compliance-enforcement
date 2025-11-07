import { FC, memo, useState, useMemo } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading, appUserGuid } from "@store/reducers/app";
import Option from "@apptypes/app/option";
import { gql } from "graphql-request";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useRequest as GraphQLRequest } from "@/app/graphql/client";
import { CaseActivityCreateInput, CaseFileCreateInput } from "@/generated/graphql";
import { CompRadioGroup } from "@/app/components/common/comp-radiogroup";
import { CompInput } from "@/app/components/common/comp-input";
import { FormField } from "@/app/components/common/form-field";
import { CaseListSearch } from "@/app/components/common/case-list-search";
import { Link } from "react-router-dom";

const createOrAddOptions: Option[] = [
  { label: "Create a new case", value: "create" },
  { label: "Add to an existing case", value: "add" },
];

const CHECK_CASE_NAME_EXISTS = gql`
  query CheckCaseNameExists($name: String!, $leadAgency: String!, $excludeCaseIdentifier: String) {
    checkCaseNameExists(name: $name, leadAgency: $leadAgency, excludeCaseIdentifier: $excludeCaseIdentifier)
  }
`;

const CREATE_CASE_MUTATION = gql`
  mutation CreateCaseFile($input: CaseFileCreateInput!) {
    createCaseFile(input: $input) {
      caseIdentifier
      openedTimestamp
      description
      name
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

const ADD_COMPLAINT_TO_CASE_MUTATION = gql`
  mutation CreateCaseActivity($input: CaseActivityCreateInput!) {
    createCaseActivity(input: $input) {
      caseActivityGuid
    }
  }
`;

const ModalLoading: FC = memo(() => (
  <div className="modal-loader">
    <div className="comp-overlay-content d-flex align-items-center justify-content-center">
      <Spinner
        animation="border"
        role="loading"
        id="modal-loader"
      />
    </div>
  </div>
));

type CreateAddCaseModalProps = {
  close: () => void;
  submit: () => void;
};
export const CreateAddCaseModal: FC<CreateAddCaseModalProps> = ({ close, submit }) => {
  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);
  const currentAppUserGuid = useAppSelector(appUserGuid);

  // Vars
  const { title, complaint_identifier, agency_code } = modalData;

  // State
  const [selectedCase, setSelectedCase] = useState<Option | null>();
  const [createOrAddOption, setCreateOrAddOption] = useState<string>("create");

  const defaultValues = useMemo(
    () => ({
      name: "",
      description: "",
    }),
    [],
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (createOrAddOption === "create") {
        const createInput: CaseFileCreateInput = {
          caseStatus: "OPEN",
          leadAgency: agency_code,
          activityType: "COMP",
          activityIdentifier: complaint_identifier,
          description: value.description,
          name: value.name,
          createdByAppUserGuid: currentAppUserGuid || "",
        };
        createCaseMutation.mutate({ input: createInput });
      }
      submit();
      close();
    },
  });

  const createCaseMutation = useGraphQLMutation(CREATE_CASE_MUTATION, {
    onSuccess: (data: any) => {
      ToggleSuccess(
        <div>
          Case{" "}
          <Link
            to={`/case/${data.createCaseFile.caseIdentifier}`}
            className="toast-link"
          >
            {data.createCaseFile.name}
          </Link>{" "}
          auto-created from complaint #{complaint_identifier}
        </div>,
        {
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
        },
      );
    },
    onError: (error: any) => {
      console.error("Error creating case:", error);
      ToggleError("Failed to create case");
    },
  });

  const addComplaintToCaseMutation = useGraphQLMutation(ADD_COMPLAINT_TO_CASE_MUTATION, {
    onSuccess: (data: any) => {
      console.log(data);
      ToggleSuccess(
        <div>
          Complaint #{complaint_identifier} added to case{" "}
          <Link
            to={`/case/${selectedCase?.value}`}
            className="toast-link"
          >
            {selectedCase?.label}
          </Link>
        </div>,
        {
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
        },
      );
    },
    onError: (error: any) => {
      console.error("Error adding case to complaint:", error);
      ToggleError("Failed to add case to complaint");
    },
  });

  const handleCreateAddCase = async () => {
    if (createOrAddOption === "add") {
      if (selectedCase?.value) {
        const createCaseAcivityInput: CaseActivityCreateInput = {
          caseFileGuid: selectedCase?.value,
          activityType: "COMP",
          activityIdentifier: complaint_identifier,
        };
        addComplaintToCaseMutation.mutate({
          input: createCaseAcivityInput,
        });
        submit();
        close();
      }
    } else {
      form.handleSubmit();
    }
  };

  const handleSearchCaseChange = (selected: Option | null) => {
    if (selected) {
      setSelectedCase(selected);
    } else {
      setSelectedCase(null);
    }
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body className="modal-create-add-case">
        {loading && <ModalLoading />}

        <div
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: "inherit",
          }}
        >
          <div
            className="comp-details-form-row"
            id="create-or-add-case-div"
          >
            <CompRadioGroup
              id="create-add-case-radiogroup"
              options={createOrAddOptions}
              enableValidation={true}
              itemClassName="comp-radio-btn"
              groupClassName="comp-equipment-form-radio-group"
              value={createOrAddOption}
              onChange={(option: any) => setCreateOrAddOption(option.target.value)}
              isDisabled={false}
              radioGroupName="create-add-case-radiogroup"
            />
          </div>

          {createOrAddOption === "create" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FormField
                form={form}
                name="name"
                label="Case ID *"
                validators={{
                  onChange: z.string().min(1, "Case ID is required").max(100, "Case ID must be 100 characters or less"),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }: { value: string }) => {
                    if (!value || value.length < 1) return "Case ID is required";
                    if (!agency_code) return undefined;
                    const result: { checkCaseNameExists: boolean } = await GraphQLRequest(CHECK_CASE_NAME_EXISTS, {
                      name: value,
                      leadAgency: agency_code,
                      excludeCaseIdentifier: undefined,
                    });
                    if (result.checkCaseNameExists) {
                      return "This Case ID is already in use for this agency. Please choose a different Case ID.";
                    }
                    return undefined;
                  },
                }}
                render={(field) => (
                  <div
                    className="comp-details-input"
                    style={{ width: "100%" }}
                  >
                    <CompInput
                      id="display-name"
                      divid="display-name-value"
                      type="input"
                      inputClass="comp-form-control"
                      error={field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                      maxLength={120}
                      onChange={(evt: any) => field.handleChange(evt.target.value)}
                      value={field.state.value}
                      placeholder="Enter Case ID"
                    />
                  </div>
                )}
              />
              <FormField
                form={form}
                name="description"
                label="Case description"
                validators={{
                  onChange: z.string().max(4000, "Description must be 4000 characters or less"),
                }}
                render={(field) => (
                  <div
                    className="comp-details-input"
                    style={{ width: "100%" }}
                  >
                    <textarea
                      id="case-description"
                      className="comp-form-control comp-details-input"
                      rows={2}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                      placeholder="Enter case description..."
                      maxLength={4000}
                      style={{ borderColor: field.state.meta.errors?.[0] ? "#dc3545" : "" }}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div
                        className="error-message"
                        style={{ color: "#dc3545" }}
                      >
                        {field.state.meta.errors.map((error: any) => error.message || error).join(", ")}
                      </div>
                    )}
                  </div>
                )}
              />
            </form>
          )}
          {createOrAddOption === "add" && (
            <div
              className="comp-details-form-row"
              id="add-case-div"
            >
              <label htmlFor="createAddCase">Search for an existing case</label>
              <div
                className="comp-details-input full-width"
                style={{ width: "100%" }}
              >
                <CaseListSearch
                  id="createAddCase"
                  onChange={(e: Option | null) => handleSearchCaseChange(e)}
                />
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="comp-details-form-buttons">
          <Button
            variant="outline-primary"
            id="outcome-cancel-button"
            title="Cancel Outcome"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            id="outcome-save-button"
            title="Save Outcome"
            onClick={handleCreateAddCase}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
