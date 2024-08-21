import { FC, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { assignOfficerToOffice, selectOfficersDropdown } from "../../../store/reducers/officer";
import { CompSelect } from "../../common/comp-select";
import Option from "../../../types/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown } from "../../../store/reducers/office";
import { ToastContainer } from "react-toastify";
import { ToggleSuccess } from "../../../common/toast";
import { clearNotification, selectNotification } from "../../../store/reducers/app";
import { selectAgencyDropdown, selectTeamDropdown } from "../../../store/reducers/code-table";
import { CEEB_ROLE_OPTIONS } from "../../../constants/roles";
import { generateApiParameters, get, patch } from "../../../common/api";
import config from "../../../../config";
import { Officer } from "../../../types/person/person";

export const UserManagement: FC = () => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficersDropdown(true));
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);
  const teams = useAppSelector(selectTeamDropdown);
  const agency = useAppSelector(selectAgencyDropdown);

  const [officer, setOfficer] = useState<Option>();
  const [officerError, setOfficerError] = useState<string>("");
  const [office, setOffice] = useState<Option>();
  const [officeError, setOfficeError] = useState<string>("");
  const [selectedAgency, setSelectedAgency] = useState<Option>();
  const [selectedTeam, setSelectedTeam] = useState<Option>();
  const [selectedRole, setSelectedRole] = useState<Option>();
  const [userIdirs, setUserIdirs] = useState([]);
  const [selectedUserIdir, setSelectedUserIdir] = useState<string>("");
  const [officerGuid, setOfficerGuid] = useState<string>("");

  useEffect(() => {
    if (officeAssignments) dispatch(fetchOfficeAssignments());
  }, [dispatch]);

  useEffect(() => {
    const { type } = notification;
    if (type !== "") {
      dispatch(clearNotification());
    }
  }, [dispatch, notification]);

  const getUserIdir = async (person_guid: string, lastName: string, firstName: string) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/officer/find-by-person-guid/${person_guid}`);
    const response = await get<Officer>(dispatch, parameters);
    if (response.auth_user_guid) {
      setSelectedUserIdir(`${response.auth_user_guid.split("-").join("")}@idir`);
      setOfficerGuid(response.officer_guid);
    } else {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/find-user`, { firstName, lastName });
      const response: any = await get(dispatch, parameters);
      if (response.length === 0) setOfficerError("Cannot find user idir.");
      else if (response.length === 1) setSelectedUserIdir(response[0].username);
      else setUserIdirs(response);
    }
  };

  const updateCEEBTeam = async (
    userIdir: string,
    officerGuid: string,
    agencyCode: string,
    teamCode: string,
    role: string,
  ) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/update/${officerGuid}`, {
      userIdir,
      agencyCode,
      teamCode,
      role,
    });
    const response: any = await patch(dispatch, parameters);
    return response;
  };

  const handleOfficerChange = async (input: any) => {
    resetSelect();
    if (input.value) {
      setOfficer(input);
      const lastName = input.label.split(",")[0];
      const firstName = input.label.split(",")[1].trim();
      await getUserIdir(input.value, lastName, firstName);
    }
  };

  const handleOfficeChange = (input: any) => {
    if (input.value) {
      setOffice(input);
    }
  };
  const handleAgencyChange = (input: any) => {
    if (input.value) {
      setSelectedAgency(input);
    }
  };
  const handleTeamChange = (input: any) => {
    if (input.value) {
      setSelectedTeam(input);
    }
  };
  const handleRoleChange = (input: any) => {
    if (input.value) {
      setSelectedRole(input);
    }
  };

  // console.log(selectedAgency);
  // console.log(selectedTeam);
  // console.log(officerGuid);
  // console.log(selectedRole);

  const resetValidationErrors = () => {
    setOfficeError("");
    setOfficerError("");
  };

  const validateUserAssignment = (): boolean => {
    resetValidationErrors();
    if (!officer) {
      setOfficerError("User is required");
    }
    if (selectedAgency?.value === "COS" && !office) {
      setOfficeError("Office is required");
    }
    return officeError === "" && officerError === "";
  };

  const handleSubmit = async () => {
    if (validateUserAssignment()) {
      if (selectedAgency) {
        switch (selectedAgency.value) {
          case "COS":
          default: {
            const officerId = officer?.value ? officer.value : "";
            const officeId = office?.value ? office.value : "";
            dispatch(assignOfficerToOffice(officerId, officeId));
            ToggleSuccess("success");
            break;
          }
          case "EPO": {
            if (selectedUserIdir && selectedTeam && selectedRole) {
              const res = await updateCEEBTeam(
                selectedUserIdir,
                officerGuid,
                selectedAgency?.value,
                // @ts-ignore
                selectedTeam?.value,
                selectedRole?.value,
              );
              console.log(res);
            }
            break;
          }
          case "PARKS": {
            break;
          }
        }
      }
    }
  };

  const handleCancel = () => {
    resetValidationErrors();
  };

  const resetSelect = () => {
    setSelectedAgency({ value: "", label: "" });
    setSelectedRole({ value: "", label: "" });
    setSelectedTeam({ value: "", label: "" });
    setOfficeError("");
    setOfficerError("");
    setSelectedUserIdir("");
    setUserIdirs([]);
    setOfficerGuid("");
  };

  return (
    <>
      <ToastContainer />
      <div className="comp-page-container comp-page-container--noscroll">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>User Administration</h1>
          </div>
          <p>Manage user agency / office location. Select a user and Agency + Location </p>
        </div>
        <div style={{ width: "500px" }}>
          <div>
            Select User
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
          </div>
          {userIdirs.length >= 2 && (
            <>
              <br />
              <form>
                <fieldset>
                  <p>{`Found ${userIdirs.length} users with same name. Please select the correct email: `}</p>
                  {userIdirs.map((item, index) => {
                    return (
                      <div>
                        <input
                          type="radio"
                          id={`userIdir-${index}`}
                          name="userIdirEmail"
                          /* @ts-ignore */
                          value={item.username}
                          /* @ts-ignore */
                          onChange={() => setSelectedUserIdir(item.username)}
                        />
                        <label
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                          htmlFor={`userIdir-${index}`}
                        >
                          {/* @ts-ignore */}
                          {item.email}
                        </label>
                      </div>
                    );
                  })}
                </fieldset>
              </form>
            </>
          )}
          <br />
          <div>
            Select Agency
            <CompSelect
              id="agency-select-id"
              classNamePrefix="comp-select"
              onChange={(evt) => handleAgencyChange(evt)}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={agency}
              placeholder="Select"
              enableValidation={true}
              value={selectedAgency}
            />
          </div>
          <br />
          {selectedAgency?.value === "EPO" && (
            <>
              <div>
                Select Team
                <CompSelect
                  id="agency-select-id"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleTeamChange(e)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={teams}
                  placeholder="Select"
                  enableValidation={true}
                  value={selectedTeam}
                  // errorMessage={officeError}
                />
              </div>
              <br />
              <div>
                Select Role
                <CompSelect
                  id="agency-select-id"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleRoleChange(e)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={CEEB_ROLE_OPTIONS}
                  placeholder="Select"
                  enableValidation={true}
                  value={selectedRole}
                  // errorMessage={officeError}
                />
              </div>
            </>
          )}
          {selectedAgency?.value === "COS" && (
            <div>
              Select Office
              <CompSelect
                id="species-select-id"
                classNamePrefix="comp-select"
                onChange={(evt) => handleOfficeChange(evt)}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={officeAssignments}
                placeholder="Select"
                enableValidation={true}
                value={office}
                errorMessage={officeError}
              />
            </div>
          )}
          <br />
          <div>
            <Button
              variant="outline-primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>{" "}
            &nbsp;
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
