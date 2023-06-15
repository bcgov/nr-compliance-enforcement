import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useAppDispatch } from '../../../hooks/hooks';
import { openModal } from '../../../store/reducers/app';
import { AssignOfficer, ChangeStatus } from '../../../types/modal/modal-types';
import { FC } from 'react';

type Props= {
  complaint_identifier: string;
}

export const ComplaintEllipsisPopover: FC<Props> = ({ complaint_identifier }) => {
  const dispatch = useAppDispatch();

  const renderPopover = () => ( 
  
    <Popover>
        <Popover.Body>
              <div className="popover-text" onClick={openStatusChangeModal}>Reassign Complaint</div>
              <div className="popover-text" onClick={openStatusChangeModal}>Update Status</div>
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
          
        },
        callback: () => { 
          console.log("derp callback")
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
