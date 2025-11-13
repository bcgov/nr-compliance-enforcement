import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch } from "@hooks/hooks";
import Option from "@apptypes/app/option";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";
import { CssUser, AppUser } from "@apptypes/app/app_user/app_user";
import { CompInput } from "@/app/components/common/comp-input";
import "@assets/sass/user-management.scss";

interface AddUserSearchProps {
  setOfficer: Dispatch<SetStateAction<Option | undefined>>;
  handleCancel: () => void;
  goToEditView: () => void;
  setIsInAddUserView: Dispatch<SetStateAction<boolean>>;
  setNewUser: Dispatch<SetStateAction<CssUser | null>>;
}

export const AddUserSearch: FC<AddUserSearchProps> = ({
  setOfficer,
  handleCancel,
  goToEditView,
  setIsInAddUserView,
  setNewUser,
}) => {
  const UserStatus = {
    notInKeyCloak: 0,
    inNatCom: 1,
  };

  const dispatch = useAppDispatch();
  const [emailInput, setEmailInput] = useState<string>("");
  const [userStatus, setUserStatus] = useState<number>();

  const getCssUserDetails = async (email: string): Promise<AppUser | CssUser | null> => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/app-user/find-by-email/${email}`);
    const response = await get<AppUser | CssUser | null>(dispatch, parameters);
    return response;
  };

  const handleEmailChange = (input: any) => {
    setEmailInput(input.trim());
  };

  const handleSearch = async () => {
    if (emailInput !== "") {
      const userDetails = await getCssUserDetails(emailInput);
      if (userDetails) {
        if ((userDetails as AppUser).app_user_guid) {
          setOfficer({ value: (userDetails as AppUser).app_user_guid, label: "" });
          setUserStatus(UserStatus.inNatCom);
        } else if ((userDetails as CssUser).username) {
          setNewUser(userDetails as CssUser);
          setOfficer({ value: undefined, label: "" });
          setIsInAddUserView(true);
          goToEditView();
        }
      } else {
        setUserStatus(UserStatus.notInKeyCloak);
      }
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
              <dt>Search user</dt>
              <dd>
                <CompInput
                  id="complaint-email-id"
                  divid="complaint-email-id-value"
                  type="input"
                  inputClass="comp-form-control"
                  error=""
                  maxLength={120}
                  placeholder="Search user's email"
                  onChange={(evt: any) => handleEmailChange(evt.target.value)}
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
              onClick={handleSearch}
            >
              Add
            </Button>
          </div>

          {userStatus === UserStatus.inNatCom && (
            <div style={{ marginTop: "30px" }}>
              <p>
                User already exists in NatCom.{" "}
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsInAddUserView(false);
                    goToEditView();
                  }}
                >
                  Go to Edit
                </a>
              </p>
            </div>
          )}

          {userStatus === UserStatus.notInKeyCloak && (
            <div style={{ marginTop: "30px" }}>
              <p>There are no results using your search criteria. The user might not exist in KeyCloak.</p>
              <p>
                Click this link to add the user in KeyCloak first:{" "}
                <a
                  href="https://bcgov.github.io/sso-requests"
                  target="_blank"
                >
                  Common Hosted Single Sign-on (CSS)
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
