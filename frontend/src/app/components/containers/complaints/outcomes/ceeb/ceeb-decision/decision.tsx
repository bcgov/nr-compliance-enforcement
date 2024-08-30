import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { Button, Card } from "react-bootstrap";
import { UUID } from "crypto";
import {
  selectCaseDecision,
  selectCaseId,
  selectHasOutcomeData,
} from "../../../../../../store/reducers/case-selectors";
import { useParams } from "react-router-dom";
import { ComplaintParams } from "../../../details/complaint-details-edit";
import { setIsInEdit } from "../../../../../../store/reducers/cases";
import { DecisionForm } from "./decision-form";
import { DecisionItem } from "./decision-item";

export const CeebDecision: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  //-- select data from redux
  const caseId = useAppSelector(selectCaseId) as UUID;

  //-- select the decision
  const data = useAppSelector(selectCaseDecision);
  const hasDecision = useAppSelector(selectHasOutcomeData("decision"));

  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const [editable, setEditable] = useState<boolean>(true);
  const showSectionErrors = isInEdit.showSectionErrors;

  useEffect(() => {
    if (!hasDecision && editable) {
      dispatch(setIsInEdit({ decision: false }));
    } else dispatch(setIsInEdit({ decison: editable }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, hasDecision]);

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
          {!data.id ? (
            <DecisionForm
              {...data}
              leadIdentifier={id}
            />
          ) : (
            <DecisionItem
              {...data}
              actionTakenDate={data.actionTakenDate === null ? new Date() : data.actionTakenDate}
            />
          )}
        </Card.Body>
      </Card>
    </section>
  );
};
