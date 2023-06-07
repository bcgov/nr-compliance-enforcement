import { FC } from "react";
import { ComplaintDetailsBreadcrumb } from "./breadcrumb";
import { complaintTypeToName } from "../../../../types/app/complaint-types";
import { Col, Row } from "react-bootstrap";

export const ComplaintDetailsHeader: FC<{
  id: string | undefined;
  complaintType: string | undefined;
}> = ({ id, complaintType }) => {
  return (
    <>
      <ComplaintDetailsBreadcrumb id={id} complaintType={complaintType} />
      <div className="comp-details-header">
        <div className="comp-complaint-info">
          <div className="comp-box-complaint-id">Complaint #{id}</div>
          <div className="comp-box-conflict-type">
            {complaintTypeToName(complaintType)}
          </div>
          <div className="comp-box-species-type">Cougar</div>
        </div>
        <div className="comp-nature-of-complaint">Nature of Complaint</div>
      </div>
      <div className="comp-complaint-status">
        <div className="comp-complaint-status-column">
          <div>
            <div>Status</div>
            <div>Open</div>
          </div>
        </div>
        <div
          className="comp-complaint-status-column"
          style={{ width: "250px" }}
        >
          <div>
            <div>Date / Time Logged</div>
            <div>
              <i className="bi bi-calendar"></i>08/04/2023{" "}
              <i className="bi bi-clock"></i> 12:01:01
            </div>
          </div>
        </div>
        <div
          className="comp-complaint-status-column"
          style={{ width: "250px" }}
        >
          <div>
            <div>Last Updated</div>
            <div>
              <i className="bi bi-calendar"></i>08/04/2023{" "}
              <i className="bi bi-clock"></i> 12:01:01
            </div>
          </div>
        </div>
        <div
          className="comp-complaint-status-column"
          style={{ width: "250px" }}
        >
          <div>
            <div>Officer Assigned</div>
            <div>
              <i className="bi bi-calendar"></i>08/04/2023{" "}
              <i className="bi bi-clock"></i> 12:01:01
            </div>
          </div>
        </div>
        <div
          className="comp-complaint-status-column"
          style={{ width: "250px" }}
        >
          <div>
            <div>Created By</div>
            <div>
              <i className="bi bi-calendar"></i>08/04/2023{" "}
              <i className="bi bi-clock"></i> 12:01:01
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
