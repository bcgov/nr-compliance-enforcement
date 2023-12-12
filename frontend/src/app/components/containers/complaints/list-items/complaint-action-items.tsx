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
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  zone: string;
  agency_code: string;
};

export const ComplaintActionItems: FC<Props> = ({
  complaint_identifier,
  complaint_type,
  zone,
  agency_code,
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
          agency_code: agency_code,
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
        delay={{ show: 500, hide: 0 }}
        overlay={
            <Tooltip id={`tt-assign-${complaint_identifier}`} className="comp-tooltip">
              Assign
            </Tooltip>
        }
      >
        <span className="tt-assign-span"
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
        delay={{ show: 500, hide: 0 }}
        key={`tt-update-${complaint_identifier}`}
        overlay={
          
            <Tooltip id={`tt-update-${complaint_identifier}`} className="comp-tooltip">
              Update Status
            </Tooltip>
        }
      >
        <span>
          <BsArrowRepeat
            onClick={openStatusChangeModal}
            className="comp-table-row-hover-icons comp-table-icon comp-table-icon-weighted tt-status-icon"
          />
        </span>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        delay={{ show: 500, hide: 0 }}
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
