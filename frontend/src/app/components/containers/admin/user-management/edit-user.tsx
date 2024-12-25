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

interface EditUserProps {
  // officers: any;
  // officer: any;
  // officerError: string;
  // userIdirs: any;
  // officerGuid: any;
  // setOfficer: Dispatch<SetStateAction<Option | undefined>>;
  // setOfficerError: Dispatch<SetStateAction<string>>;
  // getUserIdir: (person_guid: string, lastName: string, firstName: string) => Promise<void>;
  // setSelectedUserIdir: Dispatch<SetStateAction<string>>;
  // updateUserIdirByOfficerId: (userIdir: string, officerGuid: string) => Promise<void>;
  // handleEdit: () => void;
  // handleAddNewUser: () => void;
  isInAddUserView: boolean;
  handleCancel: () => void;
}

export const EditUser: FC<EditUserProps> = ({ isInAddUserView, handleCancel }) => {
  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficersDropdown(true));
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);
  const teams = useAppSelector(selectTeamDropdown);
  const agency = useAppSelector(selectAgencyDropdown);

  const availableOffices = useAppSelector(selectOffices);

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
  const [offices, setOffices] = useState<Array<Option>>([]);

  useEffect(() => {
    if (officeAssignments) {
      dispatch(fetchOfficeAssignments());
      let options = availableOffices.map((item) => {
        const { id, name, agency } = item;
        const record: Option = {
          label: `${agency} - ${name}`,
          value: id,
        };

        return record;
      });
      setOffices(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        if (current.agency) {
          let filtered = availableOffices
            .filter((item) => item.code === current.agency)
            .map((item) => {
              const { id, name, agency } = item;
              const record: Option = {
                label: `${agency} - ${name}`,
                value: id,
              };

              return record;
            });

          setOffices(filtered);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      let filtered = availableOffices
        .filter((item) => item.code === input.value)
        .map((item) => {
          const { id, name, agency } = item;
          const record: Option = {
            label: `${agency} - ${name}`,
            value: id,
          };

          return record;
        });

      setOffices(filtered);

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

      switch (selectedAgency.value) {
        case "EPO": {
          if (selectedUserIdir && selectedTeam && selectedRoles) {
            let res = await updateTeamRole(
              selectedUserIdir,
              officerGuid,
              selectedAgency?.value,
              selectedTeam?.value,
              mapRoles,
            );

            if (res?.team && res?.roles) {
              ToggleSuccess("Officer updated successfully");
            } else {
              ToggleError("Unable to update");
            }
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
          let res = await updateTeamRole(selectedUserIdir, officerGuid, selectedAgency?.value, null, mapRoles);

          if (res?.roles) {
            ToggleSuccess("Officer updated successfully");
          } else {
            ToggleError("Unable to update");
          }
          break;
        }
      }
    }
  };

  const toggleDeactivate = () => {};

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
    <div className="comp-page-container user-management-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h3>{isInAddUserView ? "Add new user" : "Edit user"}</h3>
          {!isInAddUserView && (
            <Button
              variant="primary"
              onClick={toggleDeactivate}
            >
              <i className="comp-sidenav-item-icon bi bi-x-circle"></i>Deactivate user
            </Button>
          )}
        </div>
      </div>

      <section
        className="comp-details-section"
        style={{ marginTop: "20px" }}
      >
        {/* Last name */}
        <div
          className="comp-details-form-row"
          id="last-name-id"
        >
          <label htmlFor="last-name-readonly-id">Last name</label>
          <div className="comp-details-edit-input">
            <input
              type="text"
              id="last-name-readonly-id"
              className="comp-form-control disable-field"
              value={"Truong"}
              disabled
            />
          </div>
        </div>

        {/* First name */}
        <div
          className="comp-details-form-row"
          id="first-name-id"
        >
          <label htmlFor="first-name-readonly-id">First name</label>
          <div className="comp-details-edit-input">
            <input
              type="text"
              id="first-name-readonly-id"
              className="comp-form-control disable-field"
              value={"Scarlett"}
              disabled
            />
          </div>
        </div>

        {/* Email address*/}
        <div
          className="comp-details-form-row"
          id="email-id"
        >
          <label htmlFor="email-readonly-id">Email address</label>
          <div className="comp-details-edit-input">
            <input
              type="text"
              id="email-readonly-id"
              className="comp-form-control disable-field"
              value={"scarlett.truong@gov.bc.ca"}
              disabled
            />
          </div>
        </div>

        {/* IDIR*/}
        <div
          className="comp-details-form-row"
          id="idir-id"
        >
          <label htmlFor="idir-readonly-id">IDIR</label>
          <div className="comp-details-edit-input">
            <input
              type="text"
              id="idir-readonly-id"
              className="comp-form-control disable-field"
              value={"struong"}
              disabled
            />
          </div>
        </div>

        {/* Agency */}
        <div className="comp-details-form-row">
          <label htmlFor="user-agency-id">Agency</label>
          <div className="comp-details-edit-input">
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
        </div>

        {/* Team/ office */}
        <div className="comp-details-form-row">
          <label htmlFor="user-team-office-id">Team / office</label>
          <div className="comp-details-edit-input user-team-office-id">
            {selectedAgency?.value === "EPO" ? (
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
            ) : (
              <CompSelect
                id="species-select-id"
                classNamePrefix="comp-select"
                onChange={(evt) => handleOfficeChange(evt)}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={offices}
                placeholder="Select"
                enableValidation={true}
                value={office}
                errorMessage={officeError}
              />
            )}
          </div>
        </div>

        {/* Role */}
        <div className="comp-details-form-row">
          <label htmlFor="user-role-id">Role</label>
          <div className="comp-details-edit-input">
            <ValidationMultiSelect
              className="comp-details-input"
              options={CEEB_ROLE_OPTIONS}
              placeholder="Select"
              id="user-role-id"
              classNamePrefix="comp-select"
              onChange={handleRoleChange}
              errMsg={""}
              values={selectedRoles}
            />
          </div>
        </div>

        {/* Button groups */}
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
            onClick={handleSubmit}
          >
            {isInAddUserView ? "Save" : "Update"}
          </Button>
        </div>
      </section>

      {/* //////////////////////////////////////// */}
      {/* <div style={{ width: "500px" }}>
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
                options={offices}
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
      </div> */}
    </div>
  );
};
