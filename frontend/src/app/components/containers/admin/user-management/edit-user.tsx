import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  assignOfficerToOffice,
  createOfficer,
  getOfficers,
  selectOfficerByAppUserGuid,
  updateOfficer as updateOfficerReducer,
} from "@store/reducers/officer";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown, selectOffices } from "@store/reducers/office";
import { ToggleError, ToggleSuccess } from "@common/toast";
import {
  clearNotification,
  getTokenProfile,
  openModal,
  appUserGuid,
  selectNotification,
  setActiveTab,
  userId,
} from "@store/reducers/app";
import { selectAgencySectorDropdown, selectTeamDropdown } from "@store/reducers/code-table";
import {
  CEEB_ROLE_OPTIONS,
  COS_ROLE_OPTIONS,
  PARKS_ROLE_OPTIONS,
  ROLE_OPTIONS,
  SECTOR_ROLE_OPTIONS,
} from "@constants/ceeb-roles";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import { AgencyType } from "@/app/types/app/agency-types";
import { CssUser } from "@/app/types/app/app_user/app_user";
import { NewAppUser } from "@apptypes/app/app_user/new-app-user";
import { TOGGLE_DEACTIVATE } from "@/app/types/modal/modal-types";
import "@assets/sass/user-management.scss";
import { selectParkAreasDropdown } from "@/app/store/reducers/code-table-selectors";

interface EditUserProps {
  officer: Option;
  isInAddUserView: boolean;
  newUser: CssUser | null;
  handleCancel: () => void;
  goToSearchView: () => void;
  setOfficer: Dispatch<SetStateAction<Option | undefined>>;
}

export const EditUser: FC<EditUserProps> = ({
  officer,
  isInAddUserView,
  newUser,
  handleCancel,
  goToSearchView,
  setOfficer,
}) => {
  const dispatch = useAppDispatch();
  const officerData = useAppSelector(selectOfficerByAppUserGuid(officer.value));
  const notification = useAppSelector(selectNotification);
  const teams = useAppSelector(selectTeamDropdown);
  const agency = useAppSelector(selectAgencySectorDropdown);
  const parkAreasList = useAppSelector(selectParkAreasDropdown);
  const availableOffices = useAppSelector(selectOffices);
  const adminIdirUsername = useAppSelector(userId);
  const userAppUserGuid = useAppSelector(appUserGuid);

  const [officerError, setOfficerError] = useState<string>("");
  const [officeError, setOfficeError] = useState<string>("");

  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [idir, setIdir] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedAgency, setSelectedAgency] = useState<Option | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Option | null>();
  const [selectedRoles, setSelectedRoles] = useState<Array<Option>>();
  const [selectedOffice, setSelectedOffice] = useState<Option | null>();
  const [selectedParkArea, setSelectedParkArea] = useState<Option | null>();
  const [currentAgency, setCurrentAgency] = useState<Option | null>();

  const [offices, setOffices] = useState<Array<Option>>([]);
  const [roleList, setRoleList] = useState<Array<Option>>([]);

  //Load offices on mount
  useEffect(() => {
    dispatch(fetchOfficeAssignments());
  }, [dispatch]);

  // Whenever availableOffices updates (after fetch), or agency changes, update the dropdown
  useEffect(() => {
    if (!availableOffices || availableOffices.length === 0) return;

    const activeAgency = selectedAgency ?? currentAgency;

    const filtered = activeAgency
      ? availableOffices.filter((item) => item.agency === activeAgency.value)
      : availableOffices;

    const options = filtered.map((item) => ({
      label: `${item.agency} - ${item.name}`,
      value: item.id,
    }));

    setOffices(options);
  }, [availableOffices, selectedAgency, currentAgency]);

  useEffect(() => {
    const { type } = notification;
    if (type !== "") {
      dispatch(clearNotification());
    }
  }, [dispatch, notification]);

  useEffect(() => {
    (async () => {
      const getUserCurrentTeam = async (appUserGuid: string) => {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/current`, { appUserGuid });
        const response: any = await get(dispatch, parameters);
        return response;
      };

      const userRoles = officerData?.user_roles;
      if (!userRoles || userRoles.length === 0 || selectedAgency !== null) return;

      const currentRoles = mapRolesDropdown(userRoles);
      setSelectedRoles(currentRoles);

      const hasCEEBRole = userRoles.some((role: any) => role.includes("CEEB"));
      const hasCOSRole = userRoles.some((role: any) => role.includes("COS"));
      const hasParksRole = userRoles.some((role: any) => role.includes("PARKS"));

      let currentAgency;

      if (hasCEEBRole) {
        currentAgency = mapValueToDropdownList(AgencyType.CEEB, agency);

        const currentTeam = await getUserCurrentTeam(officerData.app_user_guid);
        if (currentTeam?.team_guid) {
          const currentTeamMapped = mapValueToDropdownList(currentTeam.team_guid.team_code.team_code, teams);
          setSelectedTeam(currentTeamMapped);
        }

        setCurrentAgency(currentAgency);
        return;
      }

      if (hasCOSRole) {
        currentAgency = mapValueToDropdownList(AgencyType.COS, agency);

        if (officerData.office_guid) {
          const officeGuid =
            typeof officerData.office_guid === "string" ? officerData.office_guid : officerData.office_guid.office_guid;
          const currentOffice = mapValueToDropdownList(officeGuid, offices);
          setSelectedOffice(currentOffice);
        }

        setCurrentAgency(currentAgency);
        return;
      }

      if (hasParksRole) {
        if (officerData.park_area_guid) {
          const currentParkArea = mapValueToDropdownList(officerData.park_area_guid, parkAreasList);
          setSelectedParkArea(currentParkArea);
        }

        currentAgency = mapValueToDropdownList(AgencyType.PARKS, agency);
        setCurrentAgency(currentAgency);
        return;
      }

      // Fallback to NRS if no matching role
      currentAgency = mapValueToDropdownList(AgencyType.SECTOR, agency);
      setCurrentAgency(currentAgency);
    })();
  }, [officerData, offices, selectedAgency, agency, teams, dispatch, parkAreasList]);

  useEffect(() => {
    if (newUser && !officerData) {
      setLastName(newUser.lastName);
      setFirstName(newUser.firstName);
      setIdir(newUser.attributes.idir_username[0]);
      setEmail(newUser.email);
    } else if (officerData && !newUser) {
      setLastName(officerData.last_name);
      setFirstName(officerData.first_name);
      setIdir(officerData.user_id);
    }
  }, [newUser, officerData]);

  useEffect(() => {
    switch (currentAgency?.value ?? selectedAgency?.value) {
      case AgencyType.CEEB:
        setRoleList(CEEB_ROLE_OPTIONS);
        break;
      case AgencyType.COS:
        setRoleList(COS_ROLE_OPTIONS);
        break;
      case AgencyType.PARKS:
        setRoleList(PARKS_ROLE_OPTIONS);
        break;
      default:
        setRoleList(SECTOR_ROLE_OPTIONS);
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

  const mapValueToDropdownList = (value: any, list: Option[]) => {
    const result = list.find((item: Option) => item.value === value);
    return result ?? undefined;
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

  const handleAgencyChange = (input: Option | null) => {
    resetSelect();
    setSelectedAgency(input);
  };

  const handleOfficeChange = (input: any) => {
    setSelectedOffice(input);
  };
  const handleParkAreaChange = (input: any) => {
    setSelectedParkArea(input);
  };
  const handleTeamChange = (input: any) => {
    setSelectedTeam(input);
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
    return officeError === "" && officerError === "";
  };

  const handleSubmit = async () => {
    if (validateUserAssignment() && (selectedAgency || currentAgency) && selectedRoles) {
      const mapRoles = selectedRoles.map((role) => {
        return { name: role.value };
      });

      if (newUser) {
        //create new officer
        addNewOfficer(newUser, selectedAgency, mapRoles);
      } else {
        //update existing officer
        const selectedUserAgency = currentAgency ?? selectedAgency;
        const selectedUserIdir = `${officerData?.auth_user_guid.split("-").join("")}@idir`;
        const res = await updateOfficer(selectedUserAgency, selectedUserIdir, mapRoles);
        if (res?.roles) {
          dispatch(getOfficers()); //refresh the officer list to get the latest changes
          ToggleSuccess("Officer updated successfully");
          //If current user edit their own account, refresh current user profile
          if (officer.value === userAppUserGuid) {
            dispatch(getTokenProfile());
          }
        } else {
          ToggleError("Unable to update");
        }
      }
      resetSelect();
      goToSearchView();
      setOfficer({ value: "", label: "" }); //reset select from search view
    }
  };

  const addNewOfficer = (
    newUser: CssUser,
    selectedAgency: Option | null,
    mapRoles: Array<{ name: string | undefined }>,
  ) => {
    const newOfficerData: NewAppUser = {
      user_id: newUser.attributes.idir_username[0],
      create_user_id: adminIdirUsername,
      create_utc_timestamp: new Date(),
      update_user_id: adminIdirUsername,
      update_utc_timestamp: new Date(),
      auth_user_guid: newUser.username.slice(0, -5),
      office_guid: selectedOffice?.value ?? null,
      team_code: selectedTeam?.value ?? null,
      park_area_guid: selectedParkArea?.value ?? null,
      first_name: newUser.firstName,
      last_name: newUser.lastName,
      roles: {
        user_roles: mapRoles,
        user_idir: newUser.username,
      },
      coms_enrolled_ind: false,
      deactivate_ind: false,
      agency_code_ref: selectedAgency?.value,
    };
    dispatch(createOfficer(newOfficerData));
  };

  const updateOfficer = async (
    selectedUserAgency: Option | null,
    selectedUserIdir: string,
    mapRoles: Array<{ name: string | undefined }>,
  ) => {
    switch (selectedUserAgency?.value) {
      case AgencyType.CEEB: {
        if (selectedRoles) {
          let res = await updateTeamRole(
            selectedUserIdir,
            officerData?.app_user_guid,
            selectedUserAgency.value,
            selectedTeam?.value ?? null,
            mapRoles,
          );
          return res;
        }
        break;
      }
      case AgencyType.PARKS: {
        const app_user_guid = officerData?.app_user_guid;
        //Update park_area_guid
        if (app_user_guid) {
          await dispatch(updateOfficerReducer(app_user_guid, { park_area_guid: selectedParkArea?.value ?? null }));
        }
        //Update roles
        let res = await updateTeamRole(
          selectedUserIdir,
          officerData?.app_user_guid,
          selectedUserAgency?.value,
          null,
          mapRoles,
        );
        return res;
      }
      case AgencyType.COS:
      default: {
        const officerId = officer?.value ? officer.value : "";
        const officeId = selectedOffice?.value ? selectedOffice.value : "";
        await dispatch(assignOfficerToOffice(officerId, officeId));
        let res = await updateTeamRole(
          selectedUserIdir,
          officerData?.app_user_guid,
          selectedUserAgency?.value,
          null,
          mapRoles,
        );
        return res;
      }
    }
  };

  const toggleDeactivate = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: TOGGLE_DEACTIVATE,
        data: {
          title: officerData?.deactivate_ind ? "Activate user?" : "Deactivate user?",
          description: officerData?.deactivate_ind
            ? "This user will gain access to the application."
            : "This user will lose access to the application until reactivated.",
          ok: officerData?.deactivate_ind ? "Yes, activate user" : "Yes, deactivate user",
          cancel: "Cancel",
          app_user_guid: officerData?.app_user_guid,
          deactivate_ind: !officerData?.deactivate_ind,
          user_roles: officerData?.user_roles,
          auth_user_guid: officerData?.auth_user_guid,
        },
      }),
    );
  };

  const resetSelect = () => {
    setCurrentAgency(null);
    setSelectedTeam(null);
    setSelectedOffice(null);
    setSelectedRoles([]);
    setOfficeError("");
    setOfficerError("");
  };

  const labelOffice = () => {
    const agency = currentAgency ?? selectedAgency;
    if (agency?.value === AgencyType.CEEB) {
      return "Team";
    } else if (agency?.value === AgencyType.COS) {
      return "Office";
    } else if (agency?.value === AgencyType.PARKS) {
      return "Park area";
    }
  };

  return (
    <div className="comp-page-container user-management-container">
      <div className="comp-page-header">
        {officerData?.deactivate_ind && (
          <div className="comp-page-deactivate-banner">
            This user is currently deactivated. Click Activate user below to edit the details and grant them access.
          </div>
        )}
        <div className="comp-page-title-container">
          <h3>{isInAddUserView ? "Add new user" : "Edit user"}</h3>
          {!isInAddUserView && (
            <Button
              variant="primary"
              onClick={toggleDeactivate}
            >
              {officerData?.deactivate_ind ? (
                <span>
                  <i className="bi bi-person-bounding-box"></i>Activate user
                </span>
              ) : (
                <span>
                  <i className="comp-sidenav-item-icon bi bi-x-circle"></i>Deactivate user
                </span>
              )}
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
              value={lastName}
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
              value={firstName}
              disabled
            />
          </div>
        </div>

        {/* Email address*/}
        {isInAddUserView && (
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
                value={email}
                disabled
              />
            </div>
          </div>
        )}

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
              value={idir}
              disabled
            />
          </div>
        </div>

        {/* Agency */}
        <div className="comp-details-form-row">
          <label htmlFor="user-agency-id">
            Agency<span className="required-ind">*</span>
          </label>
          <div className="comp-details-edit-input">
            <CompSelect
              id="agency-select-id"
              showInactive={false}
              classNamePrefix="comp-select"
              onChange={(evt) => handleAgencyChange(evt)}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={agency}
              placeholder="Select"
              enableValidation={true}
              value={currentAgency ?? selectedAgency}
              isDisabled={officerData?.deactivate_ind}
            />
          </div>
        </div>

        {/* Office / Team / Park Area */}
        {(currentAgency || selectedAgency) && (
          <div className="comp-details-form-row">
            <label htmlFor="user-team-office-id">{labelOffice()}</label>
            <div className="comp-details-edit-input user-team-office-id">
              {(currentAgency?.value === AgencyType.CEEB || selectedAgency?.value === AgencyType.CEEB) && (
                <CompSelect
                  id="team-select-id"
                  showInactive={false}
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
                  isDisabled={officerData?.deactivate_ind}
                  isClearable={true}
                />
              )}
              {(currentAgency?.value === AgencyType.COS || selectedAgency?.value === AgencyType.COS) && (
                <CompSelect
                  id="species-select-id"
                  showInactive={false}
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
                  isDisabled={officerData?.deactivate_ind}
                  isClearable={true}
                />
              )}
              {(currentAgency?.value === AgencyType.PARKS || selectedAgency?.value === AgencyType.PARKS) && (
                <CompSelect
                  id="species-select-id"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  onChange={(evt) => handleParkAreaChange(evt)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={parkAreasList}
                  placeholder="Select"
                  enableValidation={true}
                  value={selectedParkArea}
                  isDisabled={officerData?.deactivate_ind}
                  isClearable={true}
                />
              )}
            </div>
          </div>
        )}

        {/* Role */}
        <div className="comp-details-form-row">
          <label htmlFor="user-role-id">
            Role<span className="required-ind">*</span>
          </label>
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
              isDisabled={officerData?.deactivate_ind}
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
            variant={officerData?.deactivate_ind ? "outline-primary" : "primary"}
            onClick={handleSubmit}
            disabled={officerData?.deactivate_ind}
          >
            {isInAddUserView ? "Save" : "Update"}
          </Button>
        </div>
      </section>
    </div>
  );
};
