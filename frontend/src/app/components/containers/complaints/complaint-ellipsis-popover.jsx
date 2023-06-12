import { OverlayTrigger, Popover } from 'react-bootstrap';

const ComplaintEllipsisPopover = ( {id} ) => {

  const renderPopover = () => ( 
  
    <Popover>
        <Popover.Body>
              <a className="popover-text" href={`https://example.com/link1?id=${id}`}>Reassign Complaint</a>
              <a className="popover-text" href={`https://example.com/link2?id=${id}`}>Update Status</a>
        </Popover.Body>
    </Popover>
  );


  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      offset={[-70,0]}
      rootClose
      overlay={renderPopover()}>
      <td className="comp-ellipsis-cell comp-cell">
              <i className="bi bi-three-dots-vertical"></i>
      </td>
    </OverlayTrigger>  );
};

export default ComplaintEllipsisPopover;
