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
import { ROLE_OPTIONS } from "@constants/ceeb-roles";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";
import { Officer } from "@apptypes/person/person";
import { UUID } from "crypto";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import "@assets/sass/user-management.scss";

interface SelectUserProps {
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
  handleEdit: () => void;
  handleAddNewUser: () => void;
}

export const SelectUser: FC<SelectUserProps> = ({
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
  handleEdit,
}) => {
  const handleOfficerChange = async (input: any) => {
    setOfficerError("");
    if (input.value) {
      setOfficer(input);
      // const lastName = input.label.split(",")[0];
      // const firstName = input.label.split(",")[1].trim();
      // await getUserIdir(input.value, lastName, firstName);
    }
  };

  const handleCancel = () => {
    setOfficer({ value: "", label: "" });
  };

  return (
    <div className="comp-page-container user-management-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h3>User Administration</h3>
          <Button
            variant="primary"
            onClick={handleAddNewUser}
          >
            <i className="comp-sidenav-item-icon bi bi-plus-circle"></i>Add new user
          </Button>
        </div>

        <p className="admin-subtitle">
          After selecting a user, click <strong>Edit</strong> for more options, such as: choosing an agency,
          team/office, specifying roles, updating the last name and/or email address, temporarily disabling or deleting
          the user.
        </p>
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
          {userIdirs && userIdirs.length >= 2 && (
            <>
              <br />
              <form>
                <fieldset>
                  <p>{`Found ${userIdirs.length} users with same name. Please select the correct email: `}</p>
                  {userIdirs &&
                    //@ts-ignore
                    userIdirs.map((item, index) => {
                      return (
                        <div key={`userIdir-${item}`}>
                          <input
                            type="radio"
                            id={`userIdir-${index}`}
                            name="userIdirEmail"
                            value={item.username}
                            onChange={async () => {
                              setSelectedUserIdir(item.username);
                              await updateUserIdirByOfficerId(item.username.split("@")[0], officerGuid);
                            }}
                          />
                          <label
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                            htmlFor={`userIdir-${index}`}
                          >
                            {item.email}
                          </label>
                        </div>
                      );
                    })}
                </fieldset>
              </form>
            </>
          )}
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
              onClick={handleEdit}
              disabled={officer && officer.value === ""}
            >
              Edit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
