import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { assignOfficerToOffice, selectOfficerByPersonGuid } from "@store/reducers/officer";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown, selectOffices } from "@store/reducers/office";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { clearNotification, selectNotification, userId } from "@store/reducers/app";
import { selectAgencyDropdown, selectTeamDropdown } from "@store/reducers/code-table";
import { CEEB_ROLE_OPTIONS, COS_ROLE_OPTIONS, ROLE_OPTIONS } from "@constants/ceeb-roles";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import "@assets/sass/user-management.scss";
import { AgencyType } from "@/app/types/app/agency-types";

interface EditUserProps {
  officer: Option;
  isInAddUserView: boolean;
  handleCancel: () => void;
  goToSearchView: () => void;
}

export const EditUser: FC<EditUserProps> = ({ officer, isInAddUserView, handleCancel, goToSearchView }) => {
  const dispatch = useAppDispatch();
  const officerData = useAppSelector(selectOfficerByPersonGuid(officer.value));
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);
  const teams = useAppSelector(selectTeamDropdown);
  const agency = useAppSelector(selectAgencyDropdown);
  const availableOffices = useAppSelector(selectOffices);
  const adminIdirUsername = useAppSelector(userId);

  const [officerError, setOfficerError] = useState<string>("");
  const [officeError, setOfficeError] = useState<string>("");

  const [selectedAgency, setSelectedAgency] = useState<Option | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Option | null>();
  const [selectedRoles, setSelectedRoles] = useState<Array<Option>>();
  const [selectedOffice, setSelectedOffice] = useState<Option | null>();
  const [currentAgency, setCurrentAgency] = useState<Option | null>();

  const [offices, setOffices] = useState<Array<Option>>([]);
  const [roleList, setRoleList] = useState<Array<Option>>([]);

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
      if (officerData?.user_roles && officerData.user_roles.length > 0 && selectedAgency === null) {
        //map current user's roles
        const currentRoles = mapRolesDropdown(officerData.user_roles);
        setSelectedRoles(currentRoles);

        //map current user's agency based on roles
        let currentAgency;
        const hasCEEBRole = officerData.user_roles.some((role: any) => role.includes("CEEB"));
        if (hasCEEBRole) {
          currentAgency = mapAgencyDropDown(AgencyType.CEEB, agency);
          const currentTeam = await getUserCurrentTeam(officerData.officer_guid);
          if (currentTeam && currentTeam.team_guid) {
            const currentTeamMapped = mapAgencyDropDown(currentTeam.team_guid.team_code.team_code, teams);
            setSelectedTeam(currentTeamMapped);
          }
        } else {
          currentAgency = mapAgencyDropDown(AgencyType.COS, agency);

          //map current user's office if agency is COS
          if (officerData.office_guid) {
            const currentOffice = mapAgencyDropDown(officerData.office_guid.office_guid, offices);
            setSelectedOffice(currentOffice);
          }
        }
        setCurrentAgency(currentAgency);
      }
    })();
  }, [officerData, offices, selectedAgency]);

  useEffect(() => {
    switch (currentAgency?.value ?? selectedAgency?.value) {
      case AgencyType.CEEB:
        setRoleList(CEEB_ROLE_OPTIONS);
        break;
      case AgencyType.COS:
      // case for PARKS will use COS_ROLE_OPTIONS for now
      case AgencyType.PARKS:
      default:
        setRoleList(COS_ROLE_OPTIONS);
        break;
    }
  }, [selectedAgency, currentAgency]);

  const mapRolesDropdown = (userRoles: any): Option[] => {
    let result: Option[] = [];
    ROLE_OPTIONS.forEach((roleOption) => {
      const found = userRoles.some((role: any) => role === roleOption.value);
      if (found) result.push(roleOption);
    });
    return result;
  };

  const mapAgencyDropDown = (userAgency: any, agencyList: Option[]) => {
    const result = agencyList.find((agencyItem: Option) => agencyItem.value === userAgency);
    return result ?? undefined;
  };

  const getUserCurrentTeam = async (officerGuid: string) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/current`, { officerGuid });
    const response: any = await get(dispatch, parameters);
    return response;
  };

  const updateTeamRole = async (
    userIdir: string | undefined,
    officerGuid: string | undefined,
    agencyCode: string | undefined,
    teamCode: string | undefined | null,
    roles: Array<{ name: string | undefined }> | undefined,
  ) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/update/${officerGuid}`, {
      userIdir,
      adminIdirUsername,
      agencyCode,
      teamCode,
      roles,
    });
    const response: any = await patch(dispatch, parameters);
    return response;
  };

  const handleOfficeChange = (input: any) => {
    if (input.value) {
      setSelectedOffice(input);
    }
  };

  const handleAgencyChange = (input: any) => {
    resetSelect();

    if (input.value) {
      //Update offices dropdown list based on selected agency (COS or PARKS)
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
    if (selectedAgency?.value === "COS" && !selectedOffice) {
      setOfficeError("Office is required");
    }
    return officeError === "" && officerError === "";
  };

  const handleSubmit = async () => {
    if (validateUserAssignment() && (selectedAgency || currentAgency)) {
      const mapRoles = selectedRoles?.map((role) => {
        return { name: role.value };
      });

      const selectedUserAgency = currentAgency ?? selectedAgency;
      const selectedUserIdir = `${officerData?.auth_user_guid.split("-").join("")}@idir`;

      switch (selectedUserAgency?.value) {
        case "EPO": {
          if (selectedTeam && selectedRoles) {
            let res = await updateTeamRole(
              selectedUserIdir,
              officerData?.officer_guid,
              selectedUserAgency.value,
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
          const officeId = selectedOffice?.value ? selectedOffice.value : "";
          dispatch(assignOfficerToOffice(officerId, officeId));
          const mapRoles = selectedRoles?.map((role) => {
            return { name: role.value };
          });
          let res = await updateTeamRole(
            selectedUserIdir,
            officerData?.officer_guid,
            selectedUserAgency?.value,
            null,
            mapRoles,
          );

          if (res?.roles) {
            ToggleSuccess("Officer updated successfully");
          } else {
            ToggleError("Unable to update");
          }
          break;
        }
      }

      goToSearchView();
    }
  };

  const toggleDeactivate = () => {};

  const resetSelect = () => {
    setCurrentAgency(null);
    setSelectedTeam(null);
    setSelectedOffice(null);
    setSelectedRoles([]);
    setOfficeError("");
    setOfficerError("");
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
              value={officerData?.person_guid.last_name}
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
              value={officerData?.person_guid.first_name}
              disabled
            />
          </div>
        </div>

        {/* Email address*/}
        {/* <div
          className="comp-details-form-row"
          id="email-id"
        >
          <label htmlFor="email-readonly-id">Email address</label>
          <div className="comp-details-edit-input">
            <input
              type="text"
              id="email-readonly-id"
              className="comp-form-control disable-field"
              value={"example@gov.bc.ca"}
              disabled
            />
          </div>
        </div> */}

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
              value={officerData?.user_id}
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
              value={currentAgency ?? selectedAgency}
            />
          </div>
        </div>

        {/* Team/ office */}
        <div className="comp-details-form-row">
          <label htmlFor="user-team-office-id">Team / office</label>
          <div className="comp-details-edit-input user-team-office-id">
            {currentAgency?.value === "EPO" || selectedAgency?.value === "EPO" ? (
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
                value={selectedOffice}
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
              options={roleList}
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
    </div>
  );
};
