import { FC, memo, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import Option from "@apptypes/app/option";
import { gql } from "graphql-request";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { CaseActivityCreateInput, CaseFileCreateInput } from "@/generated/graphql";
import { CompRadioGroup } from "@/app/components/common/comp-radiogroup";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { CaseListSearch } from "@/app/components/common/case-list-search";
import { Link } from "react-router-dom";

const createOrAddOptions: Option[] = [
  { label: "Create a new case", value: "create" },
  { label: "Add to an existing case", value: "add" },
];

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

  // Vars
  const { title, complaint_identifier } = modalData;

  // State
  const [selectedCase, setSelectedCase] = useState<Option | null>();
  const [createOrAddOption, setCreateOrAddOption] = useState<string>("create");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [caseDescription, setCaseDescription] = useState<string>("");
  const [name, setDisplayName] = useState<string>("");

  const createCaseMutation = useGraphQLMutation(CREATE_CASE_MUTATION, {
    invalidateQueries: ["searchCaseFiles"],
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
    invalidateQueries: ["caseFile", selectedCase?.value ?? ""],
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
    if (createOrAddOption === "create" && (caseDescription === "" || name === "")) {
      setErrorMessage("Required");
      return;
    }

    switch (createOrAddOption) {
      case "add": {
        if (selectedCase?.value) {
          const createCaseAcivityInput: CaseActivityCreateInput = {
            caseFileGuid: selectedCase?.value,
            activityType: "COMP",
            activityIdentifier: complaint_identifier,
          };
          addComplaintToCaseMutation.mutate({
            input: createCaseAcivityInput,
          });
        }
        break;
      }
      case "create":
      default: {
        if (errorMessage) return;
        const createInput: CaseFileCreateInput = {
          caseStatus: "OPEN",
          leadAgency: "COS",
          activityType: "COMP",
          activityIdentifier: complaint_identifier,
          description: caseDescription,
          name: name,
        };
        createCaseMutation.mutate({ input: createInput });
        break;
      }
    }
    submit();
    close();
  };

  const handleCaseDescriptionChange = (value: string) => {
    if (value === "" || name === "") {
      setErrorMessage("Required");
    } else {
      setErrorMessage("");
      setCaseDescription(value.trim());
    }
  };

  const handleDisplayNameChange = (value: string) => {
    if (value === "" || caseDescription === "") {
      setErrorMessage("Required");
    } else {
      setErrorMessage("");
      setDisplayName(value.trim());
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
            <>
              <div
                className="comp-details-form-row"
                id="create-case-display-name-div"
              >
                <label htmlFor="name">Name *</label>
                <div
                  className="comp-details-input full-width"
                  style={{ width: "100%" }}
                >
                  <input
                    type="text"
                    id="display-name"
                    className="form-control comp-details-input"
                    value={name}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    placeholder="Enter name..."
                    maxLength={100}
                  />
                  {errorMessage && name === "" && (
                    <div className="error-message" style={{ color: '#dc3545' }}>{errorMessage}</div>
                  )}
                </div>
              </div>
              <div
                className="comp-details-form-row"
                id="create-case-div"
              >
                <label htmlFor="createAddCase">Case description</label>
                <div
                  className="comp-details-input full-width"
                  style={{ width: "100%" }}
                >
                  <ValidationTextArea
                    id="case-description"
                    className="comp-form-control comp-details-input"
                    rows={2}
                    onChange={handleCaseDescriptionChange}
                    placeholderText="Enter case description..."
                    maxLength={4000}
                    errMsg={errorMessage}
                  />
                </div>
              </div>
            </>
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
                  errorMessage={errorMessage}
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
