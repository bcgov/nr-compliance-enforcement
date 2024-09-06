import { FC, useState } from "react";
import { CompInput } from "../../../../../common/comp-input";
import { Button } from "react-bootstrap";

type props = {
  leadIdentifier: string;
  toggleEdit: Function;
  //--
  id?: string;
  type?: "authorized" | "unauthorized";
  site?: string;
};

export const AuthorizationForm: FC<props> = ({ id, type, site, leadIdentifier, toggleEdit }) => {
  const [authorized, setAuthroized] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  const [authorizedErrorMessage, setAuthroizedErrorMessage] = useState("");
  const [unauthorizedErrorMessage, setUnauthorizedErrorMessage] = useState("");

  const handleUpdateSiteChange = (type: "authorized" | "unauthorized", value: string) => {
    if (type === "authorized") {
      if (unauthorized) {
        setUnauthorized("");
      }
      setAuthroized(value);
    }

    if (type === "unauthorized") {
      if (authorized) {
        setAuthroized("");
      }
      setUnauthorized(value);
    }
  };

  return (
    <>
      <div className="comp-details-form">
        <div
          className="comp-details-form-row"
          id="authroization-authroized-site-id"
        >
          <label htmlFor="outcome-authroization-authroized-site">Authorized ID</label>
          <div className="comp-details-input full-width">
            <CompInput
              id="outcome-authroization-authroized-site"
              divid="outcome-authroization-authroized-site-value"
              type="input"
              inputClass="comp-form-control"
              value={authorized}
              error={authorizedErrorMessage}
              maxLength={5}
              onChange={(evt: any) => {
                const {
                  target: { value },
                } = evt;

                handleUpdateSiteChange("authorized", value);
              }}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="authroization-unauthroized-site-id"
        >
          <label htmlFor="outcome-authroization-unauthroized-site">Unuthorized site ID</label>
          <div className="comp-details-input full-width">
            <CompInput
              id="outcome-authroization-unauthroized-site"
              divid="outcome-authroization-unauthroized-site-value"
              type="input"
              inputClass="comp-form-control"
              value={unauthorized}
              error={unauthorizedErrorMessage}
              maxLength={5}
              onChange={(evt: any) => {
                const {
                  target: { value },
                } = evt;

                handleUpdateSiteChange("unauthorized", value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="comp-details-form-buttons">
        <Button
          variant="outline-primary"
          id="outcome-decision-cancel-button"
          title="Cancel Decision"
          // onClick={handleCancelButtonClick}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          id="outcome-decision-save-button"
          title="Save Decision"
          // onClick={() => handleSaveButtonClick()}
        >
          Save
        </Button>
      </div>
    </>
  );
};
