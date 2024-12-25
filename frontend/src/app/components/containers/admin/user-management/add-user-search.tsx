import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { assignOfficerToOffice, selectOfficersDropdown } from "@store/reducers/officer";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown, selectOffices } from "@store/reducers/office";
import { ToastContainer } from "react-toastify";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { clearNotification, selectNotification } from "@store/reducers/app";
import { selectAgencyDropdown, selectTeamDropdown } from "@store/reducers/code-table";
import { CEEB_ROLE_OPTIONS } from "@constants/ceeb-roles";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";
import { Officer } from "@apptypes/person/person";
import { UUID } from "crypto";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import "@assets/sass/user-management.scss";

interface AddUserSearchProps {
  officers: any;
  officer: any;
  officerError: string;
  userIdirs: any;
  officerGuid: any;
  setOfficer: Dispatch<SetStateAction<Option | undefined>>;
  setOfficerError: Dispatch<SetStateAction<string>>;
  getUserIdir: (person_guid: string, lastName: string, firstName: string) => Promise<void>;
  setSelectedUserIdir: Dispatch<SetStateAction<string>>;
  updateUserIdirByOfficerId: (userIdir: string, officerGuid: string) => Promise<void>;
  handleAddNewUserDetails: () => void;
  handleCancel: () => void;
  handleAddNewUser: () => void;
}

export const AddUserSearch: FC<AddUserSearchProps> = ({
  setOfficer,
  setOfficerError,
  getUserIdir,
  handleAddNewUser,
  officers,
  officer,
  officerError,
  userIdirs,
  setSelectedUserIdir,
  updateUserIdirByOfficerId,
  officerGuid,
  handleAddNewUserDetails,
  handleCancel,
}) => {
  const handleOfficerChange = async (input: any) => {
    setOfficerError("");
    if (input.value) {
      setOfficer(input);
    }
  };

  return (
    <div className="comp-page-container user-management-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h3>Add new user</h3>
        </div>
      </div>
      <section className="comp-details-section">
        <div>
          <dl className="comp-call-details-group">
            <div>
              <dt>Select User</dt>
              <dd>
                <CompSelect
                  id="species-select-id"
                  classNamePrefix="comp-select"
                  onChange={(evt) => handleOfficerChange(evt)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={officers}
                  placeholder="Select"
                  enableValidation={true}
                  value={officer}
                  errorMessage={officerError}
                />
              </dd>
            </div>
          </dl>
          <div className="admin-button-groups">
            <Button
              variant="outline-primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>{" "}
            &nbsp;
            <Button
              variant="primary"
              onClick={handleAddNewUserDetails}
            >
              Add
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
