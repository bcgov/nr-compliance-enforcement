import { FC } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { isFeatureActive, openModal } from "@store/reducers/app";
import { ASSIGN_OFFICER, CHANGE_STATUS, QUICK_CLOSE, LINK_COMPLAINT } from "@apptypes/modal/modal-types";
import { Dropdown } from "react-bootstrap";
import { getAssessment, getCaseFile } from "@/app/store/reducers/complaint-outcome-thunks";
import { FEATURE_TYPES } from "@constants/feature-flag-types";
import { getComplaintById, getLinkedComplaints } from "@/app/store/reducers/complaints";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  zone: string;
  agency_code: string;
  complaint_status: string;
  park_area_guids: string[];
};

export const ComplaintActionItems: FC<Props> = ({
  complaint_identifier,
  complaint_type,
  zone,
  agency_code,
  complaint_status,
  park_area_guids,
}) => {
  const dispatch = useAppDispatch();
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

  const openAssignOfficerModal = () => {
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
          park_area_guids: park_area_guids,
        },
      }),
    );
  };

  const openStatusChangeModal = async () => {
    document.body.click();
    await dispatch(getAssessment(complaint_identifier));
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CHANGE_STATUS,
        data: {
          title: "Update status?",
          description: "Status",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          complaint_status: complaint_status,
        },
      }),
    );
  };

  const openQuickCloseModal = async () => {
    document.body.click();
    dispatch(getComplaintById(complaint_identifier, complaint_type));
    dispatch(getCaseFile(complaint_identifier));
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: QUICK_CLOSE,
        data: {
          title: `Quick close: Complaint #${complaint_identifier}`,
          description: "",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          complaint_status: complaint_status,
          refreshComplaintsOnClose: true,
        },
      }),
    );
  };

  const openLinkComplaintModal = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: LINK_COMPLAINT,
        data: {
          title: `Link complaint: #${complaint_identifier}`,
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
        },
        callback: () => {
          dispatch(getLinkedComplaints(complaint_identifier));
        },
      }),
    );
  };

  return (
    <Dropdown
      id="quick-action-button"
      key={`tt-${complaint_identifier}`}
      drop="start"
      className="comp-action-dropdown"
    >
      <Dropdown.Toggle
        id={`tt-${complaint_identifier}`}
        size="sm"
        variant="outline-primary"
        disabled={complaint_status === "Referred"}
      >
        Actions
      </Dropdown.Toggle>
      <Dropdown.Menu
        popperConfig={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 13],
                placement: "start",
              },
            },
          ],
        }}
      >
        <Dropdown.Item
          id="update-assignee-menu-item"
          onClick={openAssignOfficerModal}
          disabled={complaint_status === "CLOSED"}
        >
          <i
            className="bi bi-person-up"
            id="update-assignee-icon"
          />{" "}
          Assign complaint
        </Dropdown.Item>
        {complaint_type === "HWCR" && (
          <Dropdown.Item
            onClick={openQuickCloseModal}
            disabled={complaint_status === "CLOSED"}
          >
            <i
              className="bi bi-journal-x"
              id="link-conplaint-icon"
            />{" "}
            Quick close
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onClick={openLinkComplaintModal}
          disabled={complaint_status === "CLOSED"}
        >
          <i
            className="bi bi-link-45deg"
            id="link-complaint-icon"
          />{" "}
          Link complaint
        </Dropdown.Item>
        {showExperimentalFeature && (
          <>
            <Dropdown.Item onClick={openStatusChangeModal}>
              <i
                className="bi bi-arrow-repeat"
                id="update-status-icon"
              />{" "}
              Update Status
            </Dropdown.Item>
            <Dropdown.Item>
              <i
                className="bi bi-send"
                id="update-status-icon"
              />{" "}
              Refer
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
