import { FC, useEffect, useState } from "react";
import { CompInput } from "@components/common/comp-input";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { getCaseFile, upsertAuthorizationOutcome } from "@store/reducers/case-thunks";
import { selectCaseId } from "@store/reducers/case-selectors";
import { PermitSite } from "@apptypes/app/case-files/ceeb/authorization-outcome/permit-site";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";

type props = {
  leadIdentifier: string;
  toggleEdit: Function;
  //--
  id?: string;
  type?: "permit" | "site";
  value?: string;
};

export const AuthoizationOutcomeForm: FC<props> = ({ id, type, value, leadIdentifier, toggleEdit }) => {
  const dispatch = useAppDispatch();

  const caseId = useAppSelector(selectCaseId);

  const [authorized, setAuthorized] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  const [authorizedErrorMessage, setAuthorizedErrorMessage] = useState("");
  const [unauthorizedErrorMessage, setUnauthorizedErrorMessage] = useState("");

  useEffect(() => {
    if (type === "permit" && value) {
      setAuthorized(value);
    }

    if (type === "site" && value) {
      setUnauthorized(value);
    }
  }, [type, value]);

  const handleUpdateSiteChange = (type: "permit" | "site", value: string) => {
    if (type === "permit") {
      if (unauthorized) {
        setUnauthorized("");
      }
      setAuthorized(value);
    }

    if (type === "site") {
      if (authorized) {
        setAuthorized("");
      }
      setUnauthorized(value);
    }
  };

  const isValid = (): boolean => {
    if (!authorized && !unauthorized) {
      setAuthorizedErrorMessage("Required");
      setUnauthorizedErrorMessage("Required");
      return false;
    }

    if (!authorized.match(/^[\d-/]{1,20}$/) && !unauthorized) {
      setAuthorizedErrorMessage("Invalid format. Please only include numbers and ‘-' and '/’ characters.");
      return false;
    }

    if (!unauthorized.match(/^[\d-/]{1,20}$/) && !authorized) {
      setUnauthorizedErrorMessage("Invalid format. Please only include numbers and ‘-' and '/’ characters.");
      return false;
    }

    return true;
  };

  const handleSaveButtonClick = () => {
    setAuthorizedErrorMessage("");
    setUnauthorizedErrorMessage("");

    const identifier = id !== undefined ? caseId : leadIdentifier;

    if (isValid()) {
      const data: PermitSite = {
        id,
        type: !unauthorized ? "permit" : "site",
        value: !unauthorized ? authorized : unauthorized,
      };

      dispatch(upsertAuthorizationOutcome(identifier, data)).then(async (response) => {
        if (response === "success") {
          dispatch(getCaseFile(leadIdentifier));

          if (id !== undefined) {
            toggleEdit(false);
          }
        }
      });
    }
  };

  const handleCancelButtonClick = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: CANCEL_CONFIRM,
        data: {
          title: "Cancel changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            //-- reset the form to its original state
            if (!type) {
              setAuthorized("");
              setUnauthorized("");
            } else if (type === "permit" && value) {
              setAuthorized(value);
            } else if (type === "site" && value) {
              setUnauthorized(value);
            }

            if (id !== undefined) {
              toggleEdit(false);
            }
          },
        },
      }),
    );
  };

  return (
    <>
      <div className="comp-details-form">
        <div className="section-legend">
          <span className="required-ind">*</span> at least one of these fields is required
        </div>
        <div
          className="comp-details-form-row"
          id="authroization-authroized-site-id"
        >
          <label htmlFor="outcome-authroization-authroized-site">Authorization ID</label>
          <div className="comp-details-input full-width">
            <CompInput
              id="outcome-authroization-authroized-site"
              divid="outcome-authroization-authroized-site-value"
              type="input"
              inputClass="comp-form-control"
              value={authorized}
              error={authorizedErrorMessage}
              maxLength={20}
              onChange={(evt: any) => {
                const {
                  target: { value },
                } = evt;

                handleUpdateSiteChange("permit", value);
              }}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="authroization-unauthroized-site-id"
        >
          <label htmlFor="outcome-authroization-unauthroized-site">Unauthorized site ID</label>
          <div className="comp-details-input full-width">
            <CompInput
              id="outcome-authroization-unauthroized-site"
              divid="outcome-authroization-unauthroized-site-value"
              type="input"
              inputClass="comp-form-control form-control outcome-authroization-unauthroized-site-input"
              value={unauthorized}
              error={unauthorizedErrorMessage}
              maxLength={20}
              prefix={{
                value: "UA",
                prefixClassName: "outcome-authroization-unauthroized-site-prefix",
                inputClassName: "outcome-authroization-unauthroized-site-input",
              }}
              onChange={(evt: any) => {
                const {
                  target: { value },
                } = evt;

                handleUpdateSiteChange("site", value);
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
          onClick={handleCancelButtonClick}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          id="outcome-decision-save-button"
          title="Save Decision"
          onClick={() => handleSaveButtonClick()}
        >
          Save
        </Button>
      </div>
    </>
  );
};
