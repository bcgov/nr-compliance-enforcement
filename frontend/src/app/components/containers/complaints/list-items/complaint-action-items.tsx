import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane, faUser } from "@fortawesome/free-regular-svg-icons";

import { useAppDispatch } from "../../../../hooks/hooks";
import { openModal } from "../../../../store/reducers/app";
import {
  AssignOfficer,
  ChangeStatus,
} from "../../../../types/modal/modal-types";

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
      <FontAwesomeIcon
        icon={faPaperPlane}
        className="comp-table-row-hover-icons comp-table-icon"
      />
      <FontAwesomeIcon
        title="Assign Officer"
        onClick={openAsignOfficerModal}
        icon={faUser}
        className="comp-table-row-hover-icons comp-table-icon"
      />
      <FontAwesomeIcon
        title="Change Status"
        onClick={openStatusChangeModal}
        icon={faSync}
        className="comp-table-row-hover-icons comp-table-icon"
      />
    </>
  );
};
