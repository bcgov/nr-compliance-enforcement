import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { Button, Card } from "react-bootstrap";
import { selectCaseDecision } from "@/app/store/reducers/complaint-outcome-selectors";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "@components/containers/complaints/details/complaint-details-edit";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { DecisionForm } from "./decision-form";
import { DecisionItem } from "./decision-item";
import { BsExclamationCircleFill } from "react-icons/bs";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";

export const CeebDecision: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  //-- select the decision
  const data = useAppSelector(selectCaseDecision);

  const isInEdit = useAppSelector((state) => state.complaintOutcomes.isInEdit);
  const [editable, setEditable] = useState(true);
  const showSectionErrors = isInEdit.showSectionErrors;

  const complaintOutcomes = useAppSelector((state) => state.complaintOutcomes);
  const hasDecision = !complaintOutcomes.decision;

  const isReadOnly = useAppSelector(selectComplaintViewMode);

  useEffect(() => {
    if (!hasDecision && editable) {
      dispatch(setIsInEdit({ decision: false }));
    } else dispatch(setIsInEdit({ decision: editable }));
    return () => {
      dispatch(setIsInEdit({ decision: false }));
    };
  }, [dispatch, editable, hasDecision]);

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
              id="decision-edit-button"
              variant="outline-primary"
              size="sm"
              onClick={() => {
                toggleEdit();
              }}
              disabled={isReadOnly}
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
