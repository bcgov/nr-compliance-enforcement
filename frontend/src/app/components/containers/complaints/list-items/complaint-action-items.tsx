import { FC, useState } from "react";
import {
  BsPersonPlus,
  BsSend,
  BsSendFill,
  BsArrowRepeat,
  BsFillPersonPlusFill,
} from "react-icons/bs";
import { useAppDispatch } from "../../../../hooks/hooks";
import { openModal } from "../../../../store/reducers/app";
import {
  AssignOfficer,
  ChangeStatus,
} from "../../../../types/modal/modal-types";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  zone: string;
};

export const ComplaintActionItems: FC<Props> = ({
  complaint_identifier,
  complaint_type,
  zone,
}) => {
  const [isReferHovered, setIsReferHovered] = useState(false);
  const [isAssignHovered, setIsAssignHovered] = useState(false);

  const dispatch = useAppDispatch();

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
        },
      })
    );
  };

  return (
    <>
      <OverlayTrigger
        placement="top"
        key={`tt-assign-${complaint_identifier}`}
        overlay={
          isAssignHovered ? (
            <Tooltip id={`tt-assign-${complaint_identifier}`} className="comp-tooltip">
              Assign
            </Tooltip>
          ) : (
            <span></span>
          )
        }
      >
        <span
          onMouseEnter={() => setIsAssignHovered(true)}
          onMouseLeave={() => setIsAssignHovered(false)}
          onClick={openAsignOfficerModal}
          onKeyUp={openAsignOfficerModal}
        >
          {isAssignHovered ? (
            <BsFillPersonPlusFill className="comp-table-row-hover-icons comp-table-icon" />
          ) : (
            <BsPersonPlus className="comp-table-row-hover-icons comp-table-icon" />
          )}
        </span>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        key={`tt-update-${complaint_identifier}`}
        overlay={
          
            <Tooltip id={`tt-update-${complaint_identifier}`} className="comp-tooltip">
              Update
            </Tooltip>
        }
      >
        <span>
          <BsArrowRepeat
            onClick={openStatusChangeModal}
            className="comp-table-row-hover-icons comp-table-icon comp-table-icon-weighted"
          />
        </span>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        key={`tt-refer-${complaint_identifier}`}
        overlay={
          isReferHovered ? (
            <Tooltip id="tt-refer" className="comp-tooltip">
              Refer
            </Tooltip>
          ) : (
            <span></span>
          )
        }
      >
        <span
          onMouseEnter={() => setIsReferHovered(true)}
          onMouseLeave={() => setIsReferHovered(false)}
        >
          {isReferHovered ? (
            <BsSendFill className="comp-table-row-hover-icons comp-table-icon" />
          ) : (
            <BsSend className="comp-table-row-hover-icons comp-table-icon" />
          )}
        </span>
      </OverlayTrigger>
    </>
  );
};
