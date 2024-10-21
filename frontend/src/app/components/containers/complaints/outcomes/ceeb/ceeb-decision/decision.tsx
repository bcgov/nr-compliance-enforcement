import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { Button, Card } from "react-bootstrap";
import { selectCaseDecision } from "../../../../../../store/reducers/case-selectors";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "../../../details/complaint-details-edit";
import { setIsInEdit } from "../../../../../../store/reducers/cases";
import { DecisionForm } from "./decision-form";
import { DecisionItem } from "./decision-item";
import { BsExclamationCircleFill } from "react-icons/bs";
import { assignedOfficerAuthId } from "../../../../../../store/reducers/complaints";

export const CeebDecision: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  //-- select the decision
  const data = useAppSelector(selectCaseDecision);

  //-- get the officer assigned to the complaint
  const officerAssigned = useAppSelector(assignedOfficerAuthId);

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const [editable, setEditable] = useState(true);
  const showSectionErrors = isInEdit.showSectionErrors;

  const cases = useAppSelector((state) => state.cases);
  const hasDecision = !cases.decision;

  useEffect(() => {
    if (!hasDecision && editable) {
      dispatch(setIsInEdit({ decision: false }));
    } else dispatch(setIsInEdit({ decision: editable }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, hasDecision]);

  useEffect(() => {
    setEditable(!data.id);
  }, [data.id]);

  const toggleEdit = () => {
    setEditable(true);
  };

  return (
    <section
      className="comp-details-section"
      id="ceeb-decision"
    >
      <div className="comp-details-section-header">
        <h3>Decision</h3>
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
          </div>
        )}
      </div>

      <Card
        id="ceeb-decision"
        border={showSectionErrors ? "danger" : "default"}
      >
        <Card.Body>
          {showSectionErrors && (
            <div className="section-error-message">
              <BsExclamationCircleFill />
              {hasDecision ? (
                <span>Save section before closing the complaint.</span>
              ) : (
                <span>Complete section before closing the complaint.</span>
              )}
            </div>
          )}

          {editable ? (
            <DecisionForm
              {...data}
              officerAssigned={officerAssigned}
              leadIdentifier={id}
              toggleEdit={setEditable}
            />
          ) : (
            <DecisionItem
              {...data}
              actionTakenDate={data.actionTakenDate}
            />
          )}
        </Card.Body>
      </Card>
    </section>
  );
};
