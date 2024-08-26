import { FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { Button, Card } from "react-bootstrap";

export const CeebDecision: FC = () => {
  const dispatch = useAppDispatch();

  //-- select data from redux
  const isInEdit = useAppSelector((state) => state.cases.isInEdit);
  const showSectionErrors = isInEdit.showSectionErrors;

  const [editable, setEditable] = useState<boolean>(true);

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
              // onClick={toggleEdit}
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
          <div className="comp-details-form">
            <div
              className="comp-details-form-row"
              id="decision-schedule-sector-type"
            >
              <label htmlFor="action-required">WDR schedule/IPM sector type</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-sector-category"
            >
              <label htmlFor="action-required">Sector/Category</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-discharge-type"
            >
              <label htmlFor="action-required">Discharge type</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <hr></hr>
            <div
              className="comp-details-form-row"
              id="decision-action-taken"
            >
              <label htmlFor="action-required">Action taken</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-non-compliance-decision-matrix"
            >
              <label htmlFor="action-required">Non-compliance decision matrix</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-rational"
            >
              <label htmlFor="action-required">Rational</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-assigned-to"
            >
              <label htmlFor="action-required">Assigned to</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
            <div
              className="comp-details-form-row"
              id="decision-date-action-taken"
            >
              <label htmlFor="action-required">Dateaction taken</label>
              <div className="comp-details-input full-width">input feild</div>
            </div>
          </div>
          <div className="comp-details-form-buttons">
            <Button
              variant="outline-primary"
              id="decision-cancel-button"
              title="Cancel Decision"
              // onClick={cancelButtonClick}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              id="decision-save-button"
              title="Save Decision"
              // onClick={saveButtonClick}
            >
              Save
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};
