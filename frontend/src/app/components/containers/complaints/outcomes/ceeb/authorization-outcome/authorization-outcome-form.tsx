import { FC, useEffect, useState } from "react";
import { CompInput } from "../../../../../common/comp-input";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/hooks";
import { getCaseFile, upsertAuthorizationOutcome } from "../../../../../../store/reducers/case-thunks";
import { selectCaseId } from "../../../../../../store/reducers/case-selectors";
import { PermitSite } from "../../../../../../types/app/case-files/ceeb/authorization-outcome/permit-site";
import { openModal } from "../../../../../../store/reducers/app";
import { CANCEL_CONFIRM } from "../../../../../../types/modal/modal-types";

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

  const [authorized, setAuthroized] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  const [authorizedErrorMessage, setAuthorizedErrorMessage] = useState("");
  const [unauthorizedErrorMessage, setUnauthorizedErrorMessage] = useState("");

  useEffect(() => {
    if (type === "permit" && value) {
      setAuthroized(value);
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
      setAuthroized(value);
    }

    if (type === "site") {
      if (authorized) {
        setAuthroized("");
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
          title: "Cancel Changes?",
          description: "Your changes will be lost.",
          cancelConfirmed: () => {
            //-- reset the form to its original state
            if (!type) {
              setAuthroized("");
              setUnauthorized("");
            } else if (type === "permit" && value) {
              setAuthroized(value);
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

                handleUpdateSiteChange("permit", value);
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
