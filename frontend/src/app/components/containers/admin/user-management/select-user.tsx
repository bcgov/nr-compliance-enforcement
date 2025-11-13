import { Dispatch, FC, SetStateAction } from "react";
import { Button } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectOfficers } from "@store/reducers/officer";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { AppUser } from "@apptypes/app/app_user/app_user";
import "@assets/sass/user-management.scss";

interface SelectUserProps {
  officer: any;
  officerError: string;
  setOfficer: Dispatch<SetStateAction<Option | undefined>>;
  setOfficerError: Dispatch<SetStateAction<string>>;
  handleEdit: () => void;
  handleAddNewUser: () => void;
}

export const SelectUser: FC<SelectUserProps> = ({
  setOfficer,
  setOfficerError,
  handleAddNewUser,
  officer,
  officerError,
  handleEdit,
}) => {
  const officers = useAppSelector(selectOfficers);
  const officerList = officers?.map((officer: AppUser) => {
    const {
      app_user_guid: id, first_name, last_name,
      deactivate_ind,
    } = officer;
    return {
      value: id,
      label: `${last_name}, ${first_name} ${deactivate_ind ? "(deactivated user)" : ""}`,
    };
  });

  const handleOfficerChange = async (input: any) => {
    setOfficerError("");
    if (input.value) {
      setOfficer(input);
    }
  };

  const handleCancel = () => {
    setOfficer({ value: "", label: "" });
  };

  return (
    <div className="comp-page-container user-management-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h3>User administration</h3>
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
              <dt>Search User</dt>
              <dd>
                <CompSelect
                  id="species-select-id"
                  showInactive={false}
                  classNamePrefix="comp-select"
                  onChange={(evt) => handleOfficerChange(evt)}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={officerList}
                  placeholder="Search"
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
