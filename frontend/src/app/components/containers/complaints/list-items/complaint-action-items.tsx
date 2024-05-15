import { FC } from "react";
import { BsPersonPlus, BsSend, BsArrowRepeat } from "react-icons/bs";
import { useAppDispatch } from "../../../../hooks/hooks";
import { openModal } from "../../../../store/reducers/app";
import { ASSIGN_OFFICER, CHANGE_STATUS } from "../../../../types/modal/modal-types";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import config from "../../../../../config";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  zone: string;
  agency_code: string;
};

export const ComplaintActionItems: FC<Props> = ({ complaint_identifier, complaint_type, zone, agency_code }) => {
  const dispatch = useAppDispatch();

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
          zone: zone,
          agency_code: agency_code,
        },
      }),
    );
  };

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
        },
      }),
    );
  };

  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 0 }}
        key={`tt-assign-${complaint_identifier}`}
        overlay={
          <Tooltip
            id={`tt-assign-${complaint_identifier}`}
            className="comp-tooltip"
          >
            Assign
          </Tooltip>
        }
      >
        <Button
          size="sm"
          variant="light"
          aria-label="Assign"
          className="icon-btn"
          onClick={openAsignOfficerModal}
        >
          <i className="bi bi-person-up"></i>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        delay={{ show: 500, hide: 0 }}
        placement="top"
        key={`tt-update-${complaint_identifier}`}
        overlay={
          <Tooltip
            id={`tt-update-${complaint_identifier}`}
            className="comp-tooltip"
          >
            Update Status
          </Tooltip>
        }
      >
        <Button
          size="sm"
          variant="light"
          className="icon-btn"
          aria-label="Update Status"
          onClick={openStatusChangeModal}
        >
          <i className="bi bi-arrow-repeat"></i>
        </Button>
      </OverlayTrigger>
      {config.SHOW_EXPERIMENTAL_FEATURES === "true" && (
        <OverlayTrigger
          placement="top"
          key={`tt-refer-${complaint_identifier}`}
          overlay={
            <Tooltip
              id="tt-refer"
              className="comp-tooltip"
            >
              Refer
            </Tooltip>
          }
        >
          <span>
            <BsSend className="comp-table-row-hover-icons comp-table-icon comp-table-icon-weighted" />
          </span>
        </OverlayTrigger>
      )}
    </>
  );
};
