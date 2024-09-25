import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { assignOfficerToOffice, selectOfficersDropdown } from "../../../store/reducers/officer";
import { CompSelect } from "../../common/comp-select";
import Option from "../../../types/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown } from "../../../store/reducers/office";
import { ToastContainer } from "react-toastify";
import { ToggleError, ToggleSuccess } from "../../../common/toast";
import { clearNotification, selectNotification } from "../../../store/reducers/app";
import { selectAgencyDropdown, selectTeamDropdown } from "../../../store/reducers/code-table";
import { CEEB_ROLE_OPTIONS } from "../../../constants/ceeb-roles";
import { generateApiParameters, get, patch } from "../../../common/api";
import config from "../../../../config";
import { Officer } from "../../../types/person/person";
import { UUID } from "crypto";
import Roles from "../../../types/app/roles";
import { ValidationMultiSelect } from "../../../common/validation-multiselect";

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
  const [selectedAgency, setSelectedAgency] = useState<Option | null>();
  const [selectedTeam, setSelectedTeam] = useState<Option>();
  const [selectedRoles, setSelectedRoles] = useState<Array<Option>>();
  const [userIdirs, setUserIdirs] = useState<any[]>([]);
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

  useEffect(() => {
    (async () => {
      if (officerGuid && selectedUserIdir && agency) {
        const current = await getUserCurrentSetting(selectedUserIdir, officerGuid);
        const currentUserAgency = mapAgencyDropDown(current.agency, agency);
        setSelectedAgency(currentUserAgency);
        if (current.agency === "EPO") setSelectedTeam(current.team);
        if (current.roles) {
          const currentUserRoles = mapRolesDropdown(current.roles);
          setSelectedRoles(currentUserRoles);
        }
      }
    })();
  }, [officerGuid, selectedUserIdir]);

  const mapRolesDropdown = (userRoles: any): Option[] => {
    let result: Option[] = [];
    CEEB_ROLE_OPTIONS.forEach((roleOption) => {
      const found = userRoles.some((role: any) => role.name === roleOption.value);
      if (found) result.push(roleOption);
    });
    return result;
  };

  const mapAgencyDropDown = (userAgency: any, agencyList: Option[]) => {
    const result = agencyList.find((agencyItem: Option) => agencyItem.value === userAgency);
    return result ?? null;
  };

  const getUserIdir = async (person_guid: string, lastName: string, firstName: string) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/officer/find-by-person-guid/${person_guid}`);
    const officerRes = await get<Officer>(dispatch, parameters);
    setOfficerGuid(officerRes.officer_guid);
    if (officerRes.auth_user_guid) {
      setSelectedUserIdir(`${officerRes.auth_user_guid.split("-").join("")}@idir`);
    } else {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/find-user`, { firstName, lastName });
      const response: any = await get(dispatch, parameters);
      if (response.length === 0) setOfficerError("Cannot find user idir.");
      else if (response.length === 1) {
        setSelectedUserIdir(response[0].username);
        await updateUserIdirByOfficerId(response[0].username.split("@")[0], officerRes.officer_guid);
      } else setUserIdirs(response);
    }
  };

  const getUserCurrentSetting = async (userIdir: any, officerGuid: any) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/current`, { userIdir, officerGuid });
    const response: any = await get(dispatch, parameters);
    return response;
  };

  const updateUserIdirByOfficerId = async (userIdir: string, officerGuid: string) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/officer/${officerGuid}`, {
      auth_user_guid: userIdir as UUID,
    });
    const response = await patch<Officer>(dispatch, parameters);
    if (!response.auth_user_guid) {
      setOfficerError("Error updating officer idir.");
    }
  };

  const updateTeamRole = async (
    userIdir: string,
    officerGuid: string,
    agencyCode: string | undefined,
    teamCode: string | undefined | null,
    roles: Array<{ name: string | undefined }> | undefined,
  ) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/update/${officerGuid}`, {
      userIdir,
      agencyCode,
      teamCode,
      roles,
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
    setSelectedRoles(input);
  };

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
    if (validateUserAssignment() && selectedAgency) {
      const mapRoles = selectedRoles?.map((role) => {
        return { name: role.value };
      });
      let res;
      switch (selectedAgency.value) {
        case "EPO": {
          if (selectedUserIdir && selectedTeam && selectedRoles) {
            res = await updateTeamRole(
              selectedUserIdir,
              officerGuid,
              selectedAgency?.value,
              selectedTeam?.value,
              mapRoles,
            );
          }
          break;
        }
        case "PARKS": {
          break;
        }
        case "COS":
        default: {
          const officerId = officer?.value ? officer.value : "";
          const officeId = office?.value ? office.value : "";
          dispatch(assignOfficerToOffice(officerId, officeId));
          const mapRoles = selectedRoles?.map((role) => {
            return { name: role.value };
          });
          res = await updateTeamRole(selectedUserIdir, officerGuid, selectedAgency?.value, null, mapRoles);
          break;
        }
      }
      if (res && res.team && res.roles) {
        ToggleSuccess("Success");
      } else {
        debugger;
        ToggleError("Unable to update");
      }
    }
  };

  const handleCancel = () => {
    resetValidationErrors();
  };

  const resetSelect = () => {
    setSelectedAgency({ value: "", label: "" });
    setSelectedTeam({ value: "", label: "" });
    setOfficeError("");
    setOfficerError("");
    setSelectedUserIdir("");
    setUserIdirs([]);
    setOfficerGuid("");
    setOffice({ value: "", label: "" });
    setSelectedRoles([]);
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
                  {userIdirs &&
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
                  id="team-select-id"
                  classNamePrefix="comp-select"
                  onChange={(e) => handleTeamChange(e)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={teams}
                  placeholder="Select"
                  enableValidation={true}
                  value={selectedTeam}
                  errorMessage={""}
                />
              </div>
              <br />
            </>
          )}
          {selectedAgency?.value === "COS" && (
            <>
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
              <br />
            </>
          )}
          <div>
            Select Role
            <ValidationMultiSelect
              className="comp-details-input"
              options={CEEB_ROLE_OPTIONS}
              placeholder="Select"
              id="roles-select-id"
              classNamePrefix="comp-select"
              onChange={handleRoleChange}
              errMsg={""}
              values={selectedRoles}
            />
          </div>
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
