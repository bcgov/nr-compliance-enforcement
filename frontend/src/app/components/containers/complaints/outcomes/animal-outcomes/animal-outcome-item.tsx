import { FC } from "react";
import { Button } from "react-bootstrap";

export const AnimalOutcomeItem: FC = () => {
  return (
    <div className="comp-outcome-report-complaint-assessment">
      <div className="comp-outcome-report-container">
        <div className="comp-outcome-report-label-column">Prevention and education</div>
        <div className="comp-outcome-report-edit-column">

        </div>
      </div>
      <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
        <div className="comp-outcome-report-label-half-column">Officer</div>
        <div className="comp-outcome-report-edit-column">

        </div>
        <div className="comp-outcome-report-label-half-column">Date</div>
        <div className="comp-outcome-report-edit-column">

        </div>
      </div>
      <div className="comp-outcome-report-container">
        <div className="comp-outcome-report-actions">
          <Button
            id="outcome-cancel-button"
            title="Cancel Outcome"
            className="comp-outcome-cancel"

          >
            Cancel
          </Button>
          <Button id="outcome-save-button" title="Save Outcome" className="comp-outcome-save" onClick={(e) => e}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
