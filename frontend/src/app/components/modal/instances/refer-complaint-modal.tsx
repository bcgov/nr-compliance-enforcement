import { FC, useState, useEffect, useRef } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { CompSelect } from "@components/common/comp-select";
import { selectOfficerListByAgency, selectOfficers, selectCurrentOfficer } from "@store/reducers/officer";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { AgencyBanner } from "@components/containers/layout/agency-banner";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";
import { getRelatedData, selectComplaint } from "@store/reducers/complaints";
import { COMPLAINT_TYPE_AGENCY_MAPPING, COMPLAINT_TYPE_EXTERNAL_AGENCY_MAPPING } from "@apptypes/app/complaint-types";
import Option from "@apptypes/app/option";
import { getComplaintById, createComplaintReferral } from "@/app/store/reducers/complaints";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { FeatureFlag } from "@/app/components/common/feature-flag";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { isValidEmail } from "@/app/common/validate-email";
import { formatDate } from "@/app/common/methods";

type ReferComplaintModalProps = {
  close: () => void;
  submit: () => void;
  id: string;
  complaint_type: string;
};

export const ReferComplaintModal: FC<ReferComplaintModalProps> = ({ close, submit, id, complaint_type }) => {
  const dispatch = useAppDispatch();

  const modalData = useAppSelector(selectModalData);
  const officers = useAppSelector(selectOfficers);
  const assignableOfficers = useAppSelector(selectOfficerListByAgency);
  const currentOfficer = useAppSelector(selectCurrentOfficer);
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const complaintData = useAppSelector(selectComplaint);
  const emailReferenceList = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.EMAIL_REFERENCE));
  const complaintAgency = agencies.find((agency) => agency.agency === complaintData?.ownedBy);

  const { title } = modalData;
  const currentDate = new Date();

  const agencyOptions = agencies
    .filter(
      (agency) =>
        (agency.externalAgencyInd &&
          COMPLAINT_TYPE_EXTERNAL_AGENCY_MAPPING[
            complaint_type as keyof typeof COMPLAINT_TYPE_EXTERNAL_AGENCY_MAPPING
          ]) ||
        (agency.agency !== complaintData?.ownedBy &&
          // agency's agency_code is in mapping for the complaint type
          COMPLAINT_TYPE_AGENCY_MAPPING[complaint_type as keyof typeof COMPLAINT_TYPE_AGENCY_MAPPING].some(
            (agency_code) => agency_code === agency.agency,
          )),
    )
    .map((agency) => ({
      label: agency.longDescription,
      labelElement: <AgencyBanner agency={agency.agency} />,
      value: agency.agency,
    }));

  const [selectedAgency, setSelectedAgency] = useState<Option | null>();
  const [selectedAgencyError, setSelectedAgencyError] = useState<string>("");
  const [defaultAgencyEmail, setDefaultAgencyEmail] = useState<string>("");
  const handleSelectedAgencyChange = async (selectedOption: Option | null) => {
    setSelectedAgency(selectedOption);
    setSelectedAgencyError("");
    setDefaultAgencyEmail("");
    setDefaultRecipientEmailInputError("");
    setAdditionalEmailInputError("");
    setAdditionalEmails([]);
    setShowAdditionalEmailForm(false);
    setDefaultRecipientEmail("");
    setDefaultRecipientEmailInput("");
    setAdditionalEmailInput("");
    if (selectedOption?.value) {
      const defaultEmail = emailReferenceList.find((emailReference) => {
        if (selectedOption.value === "COS") {
          return (
            emailReference.agencyCode === selectedOption.value &&
            emailReference.geoOrgUnitTypeCode === complaintData?.organization.zone
          );
        }
        return emailReference.agencyCode === selectedOption.value;
      });
      if (defaultEmail) {
        setDefaultAgencyEmail(defaultEmail.emailAddress);
      } else {
        setTimeout(() => {
          inputRecipientEmailRef.current?.focus();
        }, 0);
      }
    }
  };
  const [selectedOfficer, setSelectedOfficer] = useState<Option | null>();
  const [selectedOfficerError, setSelectedOfficerError] = useState<string>("");
  const handleSelectedOfficerChange = (selectedOption: Option | null) => {
    setSelectedOfficer(selectedOption);
    setSelectedOfficerError("");
  };
  const [referralReason, setReferralReason] = useState<string>("");
  const [referralReasonError, setReferralReasonError] = useState<string>("");
  const handleReferralReasonChange = (reason: string) => {
    setReferralReason(reason);
    setReferralReasonError("");
  };

  const [isReferDisabled, setIsReferDisabled] = useState<boolean>(false);

  const inputAdditionalEmailRef = useRef<HTMLInputElement>(null);
  const inputRecipientEmailRef = useRef<HTMLInputElement>(null);
  const [showAdditionalEmailForm, setShowAdditionalEmailForm] = useState<boolean>(false);
  const [additionalEmailInput, setAdditionalEmailInput] = useState<string>("");
  const [additionalEmailInputError, setAdditionalEmailInputError] = useState<string>("");
  const [defaultRecipientEmailInput, setDefaultRecipientEmailInput] = useState<string>("");
  const [defaultRecipientEmail, setDefaultRecipientEmail] = useState<string>("");
  const [defaultRecipientEmailInputError, setDefaultRecipientEmailInputError] = useState<string>("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const showRecipientEmailForm = defaultAgencyEmail === "" && defaultRecipientEmail === "";

  const handleAdditionalEmailChange = (email: string) => {
    if (email === "") setAdditionalEmailInputError("");
    setAdditionalEmailInput(email);
  };
  const handleAddAdditionalEmail = () => {
    if (additionalEmailInput && !isValidEmail(additionalEmailInput)) {
      setAdditionalEmailInputError("Please enter a valid email address");
      return;
    }
    if (additionalEmails.includes(additionalEmailInput) || additionalEmailInput === defaultRecipientEmail) {
      setAdditionalEmailInputError("Email already exists");
      return;
    }
    setAdditionalEmails([...additionalEmails, additionalEmailInput]);
    setAdditionalEmailInput("");
    setAdditionalEmailInputError("");
    setShowAdditionalEmailForm(false);
  };
  const handleRemoveAdditionalEmail = (index: number) => {
    const updatedEmails = additionalEmails.filter((_, i) => i !== index);
    setAdditionalEmails(updatedEmails);
    if (updatedEmails.length === 0) {
      setShowAdditionalEmailForm(false);
    }
    setAdditionalEmailInputError("");
    setAdditionalEmailInput("");
  };

  const handleAddRecipientEmail = () => {
    if (defaultRecipientEmailInput && !isValidEmail(defaultRecipientEmailInput)) {
      setDefaultRecipientEmailInputError("Please enter a valid email address");
      return;
    }
    setDefaultRecipientEmail(defaultRecipientEmailInput);
  };

  const handleReferComplaint = async () => {
    setIsReferDisabled(false);
    let hasError = false;
    const officer = officers?.find((officer: AppUser) => officer.auth_user_guid === selectedOfficer?.value);
    const complaintUrl = window.location.href;
    if (!selectedAgency) {
      setSelectedAgencyError("Please select a new lead agency");
      hasError = true;
    } else {
      setSelectedAgencyError("");
    }
    if (!selectedOfficer) {
      setSelectedOfficerError("Please select a referring officer");
      hasError = true;
    } else if (!officer) {
      setSelectedOfficerError("Officer invalid");
      hasError = true;
    } else {
      setSelectedOfficerError("");
    }
    if (!referralReason) {
      setReferralReasonError("Please enter a reason for referral");
      hasError = true;
    } else {
      setReferralReasonError("");
    }
    if (showRecipientEmailForm) {
      setDefaultRecipientEmailInputError("Please add recipient's email address");
      hasError = true;
    }

    if (!hasError) {
      setIsReferDisabled(true);
      let emailList = [];
      if (defaultRecipientEmail) emailList.push(defaultRecipientEmail);
      if (additionalEmails.length > 0) {
        emailList = [...emailList, ...additionalEmails];
      }
      await dispatch(
        createComplaintReferral(
          id,
          currentDate,
          complaintData?.ownedBy ?? "",
          selectedAgency?.value ?? "",
          officer?.app_user_guid ?? "",
          referralReason,
          complaint_type,
          complaintData?.reportedOn as Date,
          complaintUrl,
          emailList,
        ),
      );
      await dispatch(getComplaintById(id, complaint_type));
      await dispatch(getRelatedData(id));
      submit();
    }
  };

  useEffect(() => {
    const assignableCurrentOfficer = assignableOfficers.find(
      (officer) => officer.value === currentOfficer?.app_user_guid,
    );
    if (assignableCurrentOfficer) {
      setSelectedOfficer(assignableCurrentOfficer);
    }
  }, [assignableOfficers, currentOfficer]);

  return (
    <div style={{ maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {title && (
        <Modal.Header
          style={{ paddingBottom: 0, marginBottom: 0 }}
          closeButton={true}
        >
          <Modal.Title as="h3">
            {`${title} #${id}`}
            <p className="text-muted refer-complaint-modal-subtitle">{`${complaintAgency?.shortDescription}\u2002•\u2002 ${complaint_type}\u2002•\u2002${formatDate(currentDate?.toString())}`}</p>
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
        <Alert
          variant="warning"
          className="comp-complaint-details-alert refer-complaint-modal-alert"
          id="comp-complaint-refer-alert"
        >
          <ul className="refer-complaint-modal-alert-list">
            <FeatureFlag feature={FEATURE_TYPES.REFERRAL_EMAILS}>
              <li className="refer-complaint-modal-alert-item">{`Clicking ‘Refer’ will send an email on your behalf to notify the recipient of this referral.`}</li>
            </FeatureFlag>
            <li className="refer-complaint-modal-alert-item">{`You will no longer have the ability to edit this complaint.`}</li>
          </ul>
        </Alert>
        <div className="comp-details-form">
          <div className="comp-details-form-row--refer refer-complaint-agency--new">
            <label htmlFor="refer-complaint-to">
              New lead agency<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="refer-complaint-to"
                showInactive={true}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={agencyOptions}
                enableValidation={true}
                placeholder="Select "
                errorMessage={selectedAgencyError}
                value={selectedAgency}
                onChange={handleSelectedAgencyChange}
                maxMenuHeight={170}
                menuPlacement="bottom"
              />
            </div>
          </div>
          {selectedAgency && defaultAgencyEmail && (
            <div className="comp-details-form-row--refer refer-complaint-agency--new">
              <label htmlFor="refer-complaint-to">New lead agency default email</label>
              <div className="comp-details-input full-width email">{defaultAgencyEmail}</div>
            </div>
          )}
          {selectedAgency && defaultRecipientEmail && (
            <div className="comp-details-form-row--refer refer-complaint-agency--new">
              <label htmlFor="refer-complaint-to">Recipient's email</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div className="email">{defaultRecipientEmail}</div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  id="details-screen-edit-button"
                  onClick={() => {
                    setDefaultRecipientEmail("");
                    setDefaultRecipientEmailInput("");
                    setDefaultRecipientEmailInputError("");
                  }}
                >
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          )}
          {selectedAgency && showRecipientEmailForm && (
            <div className="comp-details-form-row--refer refer-complaint-agency--new">
              <label htmlFor="refer-complaint-to">
                Add recipient’s email address<span className="required-ind">*</span>
              </label>
              <div style={{ marginBottom: "0px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="email"
                    id="additional-email-edit-id"
                    className={defaultRecipientEmailInputError ? "comp-form-control error-border" : "comp-form-control"}
                    placeholder="Type or paste here"
                    onChange={(e) => {
                      if (e.target.value === "") setDefaultRecipientEmailInputError("");
                      setDefaultRecipientEmailInput(e.target.value);
                    }}
                    maxLength={120}
                    ref={inputRecipientEmailRef}
                  />
                  <Button
                    variant="primary"
                    id="outcome-report-add-equipment"
                    title="Add email"
                    onClick={handleAddRecipientEmail}
                    disabled={defaultRecipientEmailInput === ""}
                  >
                    <span>Add</span>
                  </Button>
                </div>
                <div className="error-message">{defaultRecipientEmailInputError}</div>
              </div>
            </div>
          )}
          {(showAdditionalEmailForm || additionalEmails.length > 0) && (
            <div className="comp-details-form-row--refer">
              <label htmlFor="refer-complaint-to">Additional email address</label>
              {additionalEmails.length > 0 && (
                <div>
                  {additionalEmails.map((email, index) => (
                    <div
                      key={email}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="email">{email}</div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        id="details-screen-edit-button"
                        onClick={() => handleRemoveAdditionalEmail(index)}
                      >
                        <span>Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {showAdditionalEmailForm && (
                <div style={{ marginTop: additionalEmails.length === 0 ? "0px" : "16px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="email"
                      id="additional-email-edit-id"
                      className={additionalEmailInputError ? "comp-form-control error-border" : "comp-form-control"}
                      placeholder="Type or paste here"
                      onChange={(e) => handleAdditionalEmailChange(e.target.value)}
                      maxLength={120}
                      ref={inputAdditionalEmailRef}
                    />
                    <Button
                      variant="primary"
                      id="outcome-report-add-equipment"
                      title="Add email"
                      onClick={handleAddAdditionalEmail}
                      disabled={additionalEmailInput === ""}
                    >
                      <span>Add</span>
                    </Button>
                  </div>
                  <div className="error-message">{additionalEmailInputError}</div>
                </div>
              )}
            </div>
          )}
          {selectedAgency && (
            <div className="comp-details-form-row--refer">
              <div>
                <Button
                  variant="primary"
                  id="refer-add-additional-email-input"
                  title="Add additional email"
                  onClick={() => {
                    setShowAdditionalEmailForm(true);
                    setTimeout(() => {
                      inputAdditionalEmailRef.current?.focus();
                    }, 0);
                  }}
                  disabled={showAdditionalEmailForm || showRecipientEmailForm}
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Add additional email</span>
                </Button>
              </div>
            </div>
          )}
          <div className="comp-details-form-row--refer">
            <label htmlFor="refer-complaint-officer">
              Referring officer<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="refer-complaint-officer"
                showInactive={false}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={assignableOfficers}
                enableValidation={true}
                errorMessage={selectedOfficerError}
                value={selectedOfficer}
                placeholder="Select "
                onChange={handleSelectedOfficerChange}
                maxMenuHeight={120}
                menuPlacement="bottom"
              />
            </div>
          </div>
          <div className="comp-details-form-row--refer">
            <label htmlFor="refer-complaint-reason">
              Reason for referral<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <ValidationTextArea
                className="comp-form-control"
                id="refer-complaint-reason"
                rows={2}
                errMsg={referralReasonError}
                onChange={handleReferralReasonChange}
                maxLength={500}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          onClick={handleReferComplaint}
          disabled={isReferDisabled}
        >
          Refer
        </Button>
      </Modal.Footer>
    </div>
  );
};
