import { FC } from "react";

export const SuspectDetails: FC = () => {
  return (
    <div
      className="comp-complaint-details-block"
      style={{ marginRight: "2px" }}
    >
      <h6>Suspect Details</h6>
      <div className="comp-complaint-call-information">
        <div className="comp-complaint-section">
          <span className="comp-details-content-label ">Vehicle</span>
          <span className="comp-details-content">region</span>
        </div>

        <div className="comp-complaint-section">
          <span className="comp-details-content-label ">License Plate</span>
          <span className="comp-details-content">region</span>
        </div>

        <div className="comp-complaint-section">
          <span className="comp-details-content-label ">Features</span>
          <span className="comp-details-content">region</span>
        </div>

        <div className="comp-complaint-section">
          <span className="comp-details-content-label ">Clothing</span>
          <span className="comp-details-content">region</span>
        </div>

        <div className="comp-complaint-section">
          <span className="comp-details-content-label ">Weapons</span>
          <span className="comp-details-content">region</span>
        </div>

        <div className="comp-complaint-section">
          <span className="comp-details-content-label ">Referred by / Complaint Agency</span>
          <span className="comp-details-content">region</span>
        </div>
      </div>
    </div>
  );
};
