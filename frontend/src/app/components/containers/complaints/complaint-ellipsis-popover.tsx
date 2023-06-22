import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useAppDispatch } from '../../../hooks/hooks';
import { openModal } from '../../../store/reducers/app';
import { AssignOfficer, ChangeStatus } from '../../../types/modal/modal-types';
import { FC } from 'react';

type Props= {
  complaint_identifier: string;
  complaint_type: number
  assigned_ind: boolean;
  complaint_guid: string;
  zone: string;
}

/**
 * Renders a popover that contains the following actions:
 * 1. Assign Complaint
 * 2. Update astatus
 */
export const ComplaintEllipsisPopover: FC<Props> = ({ complaint_identifier, complaint_type, assigned_ind, complaint_guid, zone }) => {
  const dispatch = useAppDispatch();
  const assignText = assigned_ind ? 'Reassign Complaint' : 'Assign Complaint';
  
  const renderPopover = () => ( 
    <Popover>
        <Popover.Body>
              <div id="assign_complaint_link" className="popover-text" onClick={openAsignOfficerModal}>{assignText}</div>
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
          complaint_guid: complaint_guid
        }
      })
    );
  };

  const openAsignOfficerModal = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: AssignOfficer,
        data: {
          title: "Assign Complaint",
          description: "",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          complaint_guid: complaint_guid,
          zone: zone
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
