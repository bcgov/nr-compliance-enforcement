import { FC, useEffect, useState } from "react";
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
import { SelectUser } from "@/app/components/containers/admin/user-management/select-user";
import { EditUser } from "@/app/components/containers/admin/user-management/edit-user";
import { AddUserSearch } from "@/app/components/containers/admin/user-management/add-user-search";

export const UserManagement: FC = () => {
  const SEARCH_VIEW = 0;
  const EDIT_VIEW = 1;
  const ADD_USER_SEARCH_VIEW = 2;
  const ADD_VIEW = 3;

  const dispatch = useAppDispatch();
  const officers = useAppSelector(selectOfficersDropdown(true));
  const officeAssignments = useAppSelector(selectOfficesForAssignmentDropdown);
  const notification = useAppSelector(selectNotification);
  const teams = useAppSelector(selectTeamDropdown);
  const agency = useAppSelector(selectAgencyDropdown);

  const availableOffices = useAppSelector(selectOffices);

  const [viewState, setViewState] = useState<number>(SEARCH_VIEW);
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
  const [isInAddUserView, setIsInAddUserView] = useState<boolean>(false);

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
    ROLE_OPTIONS.forEach((roleOption) => {
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
    console.log(officerRes);
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

  const handleEdit = () => {
    setViewState(EDIT_VIEW);
    setIsInAddUserView(false);
  };

  const handleCancel = () => {
    //return to search view
    if (viewState !== SEARCH_VIEW) {
      setViewState(SEARCH_VIEW);
    }
    resetValidationErrors();
  };

  const handleAddNewUser = () => {
    setViewState(ADD_USER_SEARCH_VIEW);
  };

  const handleAddNewUserDetails = () => {
    setViewState(EDIT_VIEW);
    setIsInAddUserView(true);
  };

  const goToSearchView = () => {
    setViewState(SEARCH_VIEW);
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
      {viewState === SEARCH_VIEW && (
        <SelectUser
          setOfficer={setOfficer}
          setOfficerError={setOfficeError}
          getUserIdir={getUserIdir}
          handleAddNewUser={handleAddNewUser}
          officers={officers}
          officer={officer}
          officerError={officerError}
          userIdirs={userIdirs}
          setSelectedUserIdir={setSelectedUserIdir}
          updateUserIdirByOfficerId={updateUserIdirByOfficerId}
          officerGuid={officerGuid}
          handleEdit={handleEdit}
        />
      )}
      {viewState === EDIT_VIEW && officer && (
        <EditUser
          officer={officer}
          isInAddUserView={isInAddUserView}
          handleCancel={handleCancel}
          goToSearchView={goToSearchView}
        />
      )}
      {viewState === ADD_USER_SEARCH_VIEW && (
        <AddUserSearch
          setOfficer={setOfficer}
          setOfficerError={setOfficeError}
          getUserIdir={getUserIdir}
          handleAddNewUser={handleAddNewUser}
          officers={officers}
          officer={officer}
          officerError={officerError}
          userIdirs={userIdirs}
          setSelectedUserIdir={setSelectedUserIdir}
          updateUserIdirByOfficerId={updateUserIdirByOfficerId}
          officerGuid={officerGuid}
          handleAddNewUserDetails={handleAddNewUserDetails}
          handleCancel={handleCancel}
        />
      )}

      {/* <div className="comp-page-container user-management-container">
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
            team/office, specifying roles, updating the last name and/or email address, temporarily disabling or
            deleting the user.
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
              >
                Edit
              </Button>
            </div>
          </div>
        </section>
      </div> */}
    </>
  );
};
