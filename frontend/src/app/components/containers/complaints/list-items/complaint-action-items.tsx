import { FC } from "react";
import { BsSend } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { isFeatureActive, openModal } from "../../../../store/reducers/app";
import { ASSIGN_OFFICER, CHANGE_STATUS, LINK_COMPLAINT } from "../../../../types/modal/modal-types";
import { Dropdown } from "react-bootstrap";
import { getAssessment } from "../../../../store/reducers/case-thunks";
import { FEATURE_TYPES } from "../../../../constants/feature-flag-types";

type Props = {
  complaint_identifier: string;
  complaint_type: string;
  zone: string;
  agency_code: string;
  complaint_status: string;
};

export const ComplaintActionItems: FC<Props> = ({
  complaint_identifier,
  complaint_type,
  zone,
  agency_code,
  complaint_status,
}) => {
  const dispatch = useAppDispatch();
  const showExperimentalFeature = useAppSelector(isFeatureActive(FEATURE_TYPES.EXPERIMENTAL_FEATURE));

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

  const openLinkComplaintModal = async () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: LINK_COMPLAINT,
        data: {
          title: `Link Complaint ${complaint_identifier}`,
          description: "",
          complaint_identifier: complaint_identifier,
          complaint_type: complaint_type,
          complaint_status: complaint_status,
        },
      }),
    );
  };

  return (
    <Dropdown
      key={`tt-${complaint_identifier}`}
      drop="start"
    >
      <Dropdown.Toggle
        id={`tt-${complaint_identifier}`}
        size="sm"
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
        <Dropdown.Item onClick={openAsignOfficerModal}>
          <i
            className="bi bi-person-up"
            id="update-assignee-icon"
          />{" "}
          Assign complaint
        </Dropdown.Item>
        <Dropdown.Item onClick={openLinkComplaintModal}>
          <i
            className="bi bi-link-45deg"
            id="link-conplaint-icon"
          />{" "}
          Link Complaint
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
              <BsSend className="comp-table-row-hover-icons comp-table-icon comp-table-icon-weighted" />
              Refer
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
