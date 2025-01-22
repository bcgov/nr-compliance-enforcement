import { OverlayTrigger, Popover } from "react-bootstrap";
import { useAppDispatch } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { ASSIGN_OFFICER, CHANGE_STATUS } from "@apptypes/modal/modal-types";
import { FC, useContext } from "react";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  complaint_zone: string;
  complaint_agency: string;
  sortColumn: string;
  sortOrder: string;
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
  complaint_zone,
  complaint_agency,
  assigned_ind,
  sortColumn,
  sortOrder,
}) => {
  /*
   */
  const dispatch = useAppDispatch();

  const { state: filters } = useContext(ComplaintFilterContext);
  const {
    species: speciesCodeFilter,
    natureOfComplaint: natureOfComplaintFilter,
    status: complaintStatusFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
  } = filters;

  const assignText = assigned_ind ? "Reassign complaint" : "Assign complaint";

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
          Update status
        </div>
      </Popover.Body>
    </Popover>
  );

  const openStatusChangeModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CHANGE_STATUS,
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
      }),
    );
  };

  const openAsignOfficerModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "md",
        modalType: ASSIGN_OFFICER,
        data: {
          title: "Assign complaint",
          description: "",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          zone: complaint_zone,
          complaint_agency: complaint_agency,
        },
      }),
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
