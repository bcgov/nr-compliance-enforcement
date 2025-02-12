import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { assignOfficerToOffice, createOfficer, getOfficers, selectOfficerByPersonGuid } from "@store/reducers/officer";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { fetchOfficeAssignments, selectOfficesForAssignmentDropdown, selectOffices } from "@store/reducers/office";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { clearNotification, openModal, selectNotification, userId } from "@store/reducers/app";
import { selectAgencyDropdown, selectTeamDropdown } from "@store/reducers/code-table";
import { CEEB_ROLE_OPTIONS, COS_ROLE_OPTIONS, PARKS_ROLE_OPTIONS, ROLE_OPTIONS } from "@constants/ceeb-roles";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import { AgencyType } from "@/app/types/app/agency-types";
import { CssUser } from "@/app/types/person/person";
import { NewOfficer } from "@/app/types/person/new-officer";
import { TOGGLE_DEACTIVATE } from "@/app/types/modal/modal-types";
import "@assets/sass/user-management.scss";

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
  const officerData = useAppSelector(selectOfficerByPersonGuid(officer.value));
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);
  const teams = useAppSelector(selectTeamDropdown);
  const agency = useAppSelector(selectAgencyDropdown);
  const availableOffices = useAppSelector(selectOffices);
  const adminIdirUsername = useAppSelector(userId);

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
  const [currentAgency, setCurrentAgency] = useState<Option | null>();
  const [hideTeamOffice, setHideTeamOffice] = useState(false);

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
      const getUserCurrentTeam = async (officerGuid: string) => {
        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/team/current`, { officerGuid });
        const response: any = await get(dispatch, parameters);
        return response;
      };

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
          if (currentTeam?.team_guid) {
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
  }, [officerData, offices, selectedAgency, agency, teams, dispatch]);

  useEffect(() => {
    if (newUser && !officerData) {
      setLastName(newUser.lastName);
      setFirstName(newUser.firstName);
      setIdir(newUser.attributes.idir_username[0]);
      setEmail(newUser.email);
    } else if (officerData && !newUser) {
      setLastName(officerData.person_guid.last_name);
      setFirstName(officerData.person_guid.first_name);
      setIdir(officerData.user_id);
    }
  }, [newUser, officerData]);

  useEffect(() => {
    switch (currentAgency?.value ?? selectedAgency?.value) {
      case AgencyType.CEEB:
        setHideTeamOffice(false);
        setRoleList(CEEB_ROLE_OPTIONS);
        break;
      case AgencyType.COS:
        setHideTeamOffice(false);
        setRoleList(COS_ROLE_OPTIONS);
        break;
      case AgencyType.PARKS:
      default:
        setHideTeamOffice(true);
        setRoleList(PARKS_ROLE_OPTIONS);
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
    if (validateUserAssignment() && (selectedAgency || currentAgency) && selectedRoles) {
      const mapRoles = selectedRoles.map((role) => {
        return { name: role.value };
      });

      if (newUser) {
        //create new officer
        addNewOfficer(newUser, mapRoles);
      } else {
        //update existing officer
        const selectedUserAgency = currentAgency ?? selectedAgency;
        const selectedUserIdir = `${officerData?.auth_user_guid.split("-").join("")}@idir`;
        await updateOfficer(selectedUserAgency, selectedUserIdir, mapRoles);
      }
      resetSelect();
      goToSearchView();
      setOfficer({ value: "", label: "" }); //reset select from search view
    }
  };

  const addNewOfficer = (newUser: CssUser, mapRoles: Array<{ name: string | undefined }>) => {
    const newOfficerData: NewOfficer = {
      user_id: newUser.attributes.idir_username[0],
      create_user_id: adminIdirUsername,
      create_utc_timestamp: new Date(),
      update_user_id: adminIdirUsername,
      update_utc_timestamp: new Date(),
      auth_user_guid: newUser.username.slice(0, -5),
      office_guid: selectedOffice?.value ?? null,
      team_code: selectedTeam?.value ?? null,
      person_guid: {
        first_name: newUser.firstName,
        middle_name_1: null,
        middle_name_2: null,
        last_name: newUser.lastName,
        create_user_id: adminIdirUsername,
        create_utc_timestamp: new Date(),
        update_user_id: adminIdirUsername,
        updateTimestamp: new Date(),
      },
      roles: {
        user_roles: mapRoles,
        user_idir: newUser.username,
      },
      coms_enrolled_ind: false,
      deactivate_ind: false,
    };
    dispatch(createOfficer(newOfficerData));
  };

  const updateOfficer = async (
    selectedUserAgency: Option | null,
    selectedUserIdir: string,
    mapRoles: Array<{ name: string | undefined }>,
  ) => {
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
      case "COS":
      default: {
        const officerId = officer?.value ? officer.value : "";
        const officeId = selectedOffice?.value ? selectedOffice.value : "";
        dispatch(assignOfficerToOffice(officerId, officeId));
        let res = await updateTeamRole(
          selectedUserIdir,
          officerData?.officer_guid,
          selectedUserAgency?.value,
          null,
          mapRoles,
        );

        if (res?.roles) {
          dispatch(getOfficers());
          ToggleSuccess("Officer updated successfully");
        } else {
          ToggleError("Unable to update");
        }
        break;
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
          officer_guid: officerData?.officer_guid,
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
              isDisabled={officerData?.deactivate_ind}
            />
          </div>
        </div>

        {/* Team/ office */}
        {!hideTeamOffice && (
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
                  isDisabled={officerData?.deactivate_ind}
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
                  isDisabled={officerData?.deactivate_ind}
                />
              )}
            </div>
          </div>
        )}

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
