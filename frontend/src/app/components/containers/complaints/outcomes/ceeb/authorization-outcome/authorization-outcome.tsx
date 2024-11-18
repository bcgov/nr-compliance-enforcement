import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { ComplaintParams } from "../../../details/complaint-details-edit";
import { setIsInEdit } from "../../../../../../store/reducers/cases";
import { selectCeebAuthorization } from "../../../../../../store/reducers/case-selectors";
import { Button, Card } from "react-bootstrap";
import { BsExclamationCircleFill } from "react-icons/bs";
import { AuthoizationOutcomeForm } from "./authorization-outcome-form";
import { AuthoizationOutcomeItem } from "./authorization-outcome-item";
import { openModal } from "../../../../../../store/reducers/app";
import { DELETE_CONFIRM } from "../../../../../../types/modal/modal-types";
import { deleteAuthorizationOutcome, getCaseFile } from "../../../../../../store/reducers/case-thunks";

export const AuthoizationOutcome: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  //-- select the authorization
  const data = useAppSelector(selectCeebAuthorization);

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const [editable, setEditable] = useState(true);
  const showSectionErrors = isInEdit.showSectionErrors;

  const cases = useAppSelector((state) => state.cases);
  const hasAuthorization = !cases.authorization;

  useEffect(() => {
    if (!hasAuthorization && editable) {
      dispatch(setIsInEdit({ site: false }));
    } else dispatch(setIsInEdit({ site: editable }));
    return () => {
      dispatch(setIsInEdit({ site: false }));
    };
  }, [dispatch, editable, hasAuthorization]);

  useEffect(() => {
    setEditable(!data.id);
  }, [data.id]);

  const toggleEdit = () => {
    setEditable(true);
  };

  const handleDeleteButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_CONFIRM,
        data: {
          title: "Delete authorization?",
          description: "Your changes will be lost.",
          confirmText: "delete authorization",
          deleteConfirmed: () => {
            dispatch(deleteAuthorizationOutcome()).then(async (response) => {
              if (response === "success") {
                dispatch(getCaseFile(id));
              }
            });
          },
        },
      }),
    );
  };

  return (
    <section
      className="comp-details-section"
      id="ceeb-authorization"
    >
      <div className="comp-details-section-header">
        <h3>
          Authorization<span className="required-ind">*</span>
        </h3>
        {!editable && (
          <div className="comp-details-section-header-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                toggleEdit();
              }}
            >
              <i className="bi bi-pencil"></i>
              <span>Edit</span>
            </Button>

            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleDeleteButtonClick}
            >
              <i className="bi bi-trash3"></i>
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>

      <Card
        id="ceeb-authorization"
        border={showSectionErrors ? "danger" : "default"}
      >
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              {hasAuthorization ? (
                <span>Save section before closing the complaint.</span>
              ) : (
                <span>Complete section before closing the complaint.</span>
              )}
            </div>
          )}

          {editable ? (
            <AuthoizationOutcomeForm
              {...data}
              leadIdentifier={id}
              toggleEdit={setEditable}
            />
          ) : (
            <AuthoizationOutcomeItem {...data} />
          )}
        </Card.Body>
      </Card>
    </section>
  );
};
