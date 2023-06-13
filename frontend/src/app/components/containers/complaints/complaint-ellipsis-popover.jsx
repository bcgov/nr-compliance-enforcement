import { OverlayTrigger, Popover } from 'react-bootstrap';

const ComplaintEllipsisPopover = ( {id, assigned_ind} ) => {

  const assignText = assigned_ind ? 'Reassign Complaint' : 'Assign Complaint';
  const renderPopover = () => ( 
  

    <Popover>
        <Popover.Body>
              <a className="popover-text" href={`https://example.com/link1?id=${id}`}>{assignText}</a>
              <a className="popover-text" href={`https://example.com/link2?id=${id}`}>Update Status</a>
        </Popover.Body>
    </Popover>
  );


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
