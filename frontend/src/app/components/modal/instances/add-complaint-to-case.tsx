import { FC, memo, useEffect, useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "@hooks/hooks";
import { selectModalData, isLoading } from "@store/reducers/app";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import Option from "@apptypes/app/option";
import { HWCRAssessmentLinkComplaintSearch } from "@/app/components/containers/complaints/outcomes/hwcr-assessment/hwcr-assessment-link-complaint-search";
import { gql } from "graphql-request";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useQueryClient } from "@tanstack/react-query";
import { CaseActivityCreateInput } from "@/generated/graphql";

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

type AddComplaintToCaseModalProps = {
  close: () => void;
  submit: () => void;
};
export const AddComplaintToCaseModal: FC<AddComplaintToCaseModalProps> = ({ close, submit }) => {
  const queryClient = useQueryClient();
  // Hooks
  const dispatch = useAppDispatch();

  // Selectors
  const loading = useAppSelector(isLoading);
  const modalData = useAppSelector(selectModalData);

  // Vars
  const { title, caseId } = modalData;

  // State
  const [selectedComplaint, setSelectedComplaint] = useState<Option | null>();
  const [addComplaintErrorMessage, setAddComplaintErrorMessage] = useState<string>("");

  // Effects
  useEffect(() => {
    dispatch(setIsInEdit({ showSectionErrors: false }));
  }, [dispatch]);

  const handleAddComplaintChange = (selected: Option | null, status: string | null) => {
    if (selected) {
      setSelectedComplaint(selected);
    } else {
      setSelectedComplaint(null);
    }
  };

  const addComplaintToCaseMutation = useGraphQLMutation(ADD_COMPLAINT_TO_CASE_MUTATION, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["caseFile", caseId] });
      ToggleSuccess("Complaint successfully added");
    },
    onError: (error: any) => {
      console.error("Error adding complaint to case:", error);
      ToggleError("Failed to add complaint to case");
    },
  });

  const handleAddComplaint = async () => {
    if (!selectedComplaint) {
      ToggleError("Please select a complaint to link");
      return;
    }

    const createInput: CaseActivityCreateInput = {
      caseFileGuid: caseId,
      activityType: "COMP",
      activityIdentifier: selectedComplaint.value,
    };
    addComplaintToCaseMutation.mutate({
      input: createInput,
    });

    submit();
    close();
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {loading && <ModalLoading />}
        <div
          style={{
            visibility: loading ? "hidden" : "inherit",
            display: "inherit",
          }}
        >
          <div
            className="comp-details-form-row"
            id="add-complaint-div"
          >
            <label htmlFor="addComplaintToCase">
              Search for complaint:<span className="required-ind">*</span>
            </label>
            <div
              className="comp-details-input full-width"
              style={{ width: "100%" }}
            >
              <HWCRAssessmentLinkComplaintSearch
                id="addComplaintToCase"
                onChange={(e: Option | null, s: string | null) => handleAddComplaintChange(e, s)}
                errorMessage={addComplaintErrorMessage}
                value={selectedComplaint}
              />
            </div>
          </div>
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
            onClick={handleAddComplaint}
          >
            <span>Save and Close</span>
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
};
