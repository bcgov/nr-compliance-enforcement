import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useAppDispatch } from '../../../hooks/hooks';
import { openModal } from '../../../store/reducers/app';
import { ChangeStatus } from '../../../types/modal/modal-types';
import { FC } from 'react';
import Option from "../../../types/app/option";

type Props= {
  complaint_identifier: string,
  complaint_type: number,
  sortColumn: string,
  sortOrder: string,
  natureOfComplaintFilter: Option | null,
  speciesCodeFilter: Option | null,
  startDateFilter: Date | undefined,
  endDateFilter: Date | undefined,
  complaintStatusFilter: Option | null,
  violationFilter: Option | null,
}

/**
 * Renders a popover that contains the following actions:
 * 1. Assign Complaint
 * 2. Update astatus
 */
export const ComplaintEllipsisPopover: FC<Props> = ({ complaint_identifier, complaint_type, sortColumn, sortOrder, natureOfComplaintFilter, speciesCodeFilter, startDateFilter, endDateFilter, complaintStatusFilter }) => {
  const dispatch = useAppDispatch();

  const renderPopover = () => ( 
  
    <Popover>
        <Popover.Body>
              <div id="assign_complaint_link" className="popover-text" onClick={openStatusChangeModal}>Reassign Complaint</div>
              <div id="update_status_link" className="popover-text" onClick={openStatusChangeModal}>Update Status</div>
        </Popover.Body>
    </Popover>
  );

  const openStatusChangeModal = () => {
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
        }
      })
    );
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      offset={[-70,-5]}
      rootClose
      overlay={renderPopover()}>
      <td className="comp-ellipsis-cell comp-cell">
              <i className="bi bi-three-dots-vertical"></i>
      </td>
    </OverlayTrigger>  );
};

export default ComplaintEllipsisPopover;
