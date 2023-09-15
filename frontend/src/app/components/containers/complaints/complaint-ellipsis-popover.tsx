import { OverlayTrigger, Popover } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks/hooks";
import { openModal } from "../../../store/reducers/app";
import { AssignOfficer, ChangeStatus } from "../../../types/modal/modal-types";
import { FC, useContext } from "react";
import Option from "../../../types/app/option";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  sortColumn: string,
  sortOrder: string,
  assigned_ind: boolean;
};

/**
 * Renders a popover that contains the following actions:
 * 1. Assign Complaint
 * 2. Update astatus
 */
export const ComplaintEllipsisPopover: FC<Props> = ({
  complaint_identifier,
  complaint_type,
  assigned_ind,
  sortColumn,
  sortOrder
}) => {
  /*
   */
  const dispatch = useAppDispatch();

  const { state: filters } = useContext(ComplaintFilterContext);
  const {
    region,
    zone,
    community,
    officer,
    species: speciesCodeFilter,
    natureOfComplaint: natureOfComplaintFilter,
    violationType: violationFilter,
    status: complaintStatusFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
  } = filters;

  const assignText = assigned_ind ? "Reassign Complaint" : "Assign Complaint";

  const renderPopover = () => (
    <Popover>
      <Popover.Body>
        <div
          id="assign_complaint_link"
          className="popover-text"
          onClick={openAsignOfficerModal}
        >
          {assignText}
        </div>
        <div
          id="update_status_link"
          className="popover-text"
          onClick={openStatusChangeModal}
        >
          Update Status
        </div>
      </Popover.Body>
    </Popover>
  );

  const openStatusChangeModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ChangeStatus,
        data: {
          title: "Update status?",
          description: "Status",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          natureOfComplaintFilter: natureOfComplaintFilter,
          speciesCodeFilter: speciesCodeFilter,
          startDateFilter: startDateFilter,
          endDateFilter: endDateFilter,
          complaintStatusFilter: complaintStatusFilter,
        },
      })
    );
  };

  const openAsignOfficerModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: AssignOfficer,
        data: {
          title: "Assign Complaint",
          description: "",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          zone: zone,
        },
      })
    );
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      offset={[-70, -5]}
      rootClose={true}
      overlay={renderPopover()}
    >
      <td className="comp-ellipsis-cell comp-cell">
        <i className="bi bi-three-dots-vertical"></i>
      </td>
    </OverlayTrigger>
  );
};

export default ComplaintEllipsisPopover;
