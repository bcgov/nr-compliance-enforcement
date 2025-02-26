import { FC, useState, useEffect } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { CompSelect } from "@components/common/comp-select";
import DatePicker from "react-datepicker";
import { selectOfficerListByAgency, selectOfficers, selectCurrentOfficer } from "@store/reducers/officer";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { AgencyBanner } from "@components/containers/layout/agency-banner";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";
import { selectComplaint } from "@store/reducers/complaints";
import { COMPLAINT_TYPE_AGENCY_MAPPING } from "@apptypes/app/complaint-types";
import Option from "@apptypes/app/option";
import { getComplaintById, createComplaintReferral } from "@/app/store/reducers/complaints";
import { Officer } from "@/app/types/person/person";

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

  const { title } = modalData;
  const currentDate = new Date();

  const agencyOptions = agencies
    .filter(
      (agency) =>
        agency.agency !== complaintData?.ownedBy &&
        // agency's agency_code is in mapping for the complaint type
        COMPLAINT_TYPE_AGENCY_MAPPING[complaint_type as keyof typeof COMPLAINT_TYPE_AGENCY_MAPPING].some(
          (agency_code) => agency_code === agency.agency,
        ),
    )
    .map((agency) => ({
      label: agency.longDescription,
      labelElement: <AgencyBanner agency={agency.agency} />,
      value: agency.agency,
    }));

  const [selectedAgency, setSelectedAgency] = useState<Option | null>();
  const [selectedAgencyError, setSelectedAgencyError] = useState<string>("");
  const handleSelectedAgencyChange = (selectedOption: Option | null) => {
    setSelectedAgency(selectedOption);
    setSelectedAgencyError("");
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

  const handleReferComplaint = async () => {
    let hasError = false;
    const officer = officers?.find((officer: Officer) => officer.auth_user_guid === selectedOfficer?.value);
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
    if (!hasError) {
      await dispatch(
        createComplaintReferral(
          id,
          currentDate,
          complaintData?.ownedBy ?? "",
          selectedAgency?.value ?? "",
          officer?.officer_guid ?? "",
          referralReason,
        ),
      );
      await dispatch(getComplaintById(id, complaint_type));
      submit();
    }
  };

  useEffect(() => {
    const assignableCurrentOfficer = assignableOfficers.find(
      (officer) => officer.value === currentOfficer?.authorizedUserId,
    );
    if (assignableCurrentOfficer) {
      setSelectedOfficer(assignableCurrentOfficer);
    }
  }, [assignableOfficers, currentOfficer]);

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{`${title} #${id}`}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <Alert
          variant="warning"
          className="comp-complaint-details-alert"
          id="comp-complaint-refer-alert"
        >
          <div>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{` Your organization will not have the ability to edit the complaint after it is referred.`}</span>
          </div>
        </Alert>

        <div className="comp-details-form">
          <div className="comp-details-form-row refer-complaint-agency">
            <label htmlFor="refer-complaint-from">Previous agency</label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="refer-complaint-from"
                classNamePrefix="comp-select"
                className="comp-details-input"
                isDisabled={true}
                enableValidation={false}
                showInactive={true}
                value={{
                  label: complaintData?.ownedBy,
                  labelElement: <AgencyBanner agency={complaintData?.ownedBy} />,
                  value: complaintData?.ownedBy,
                  isActive: true,
                }}
              />
            </div>
          </div>
          <div className="comp-details-form-row refer-complaint-agency--new">
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
              />
            </div>
          </div>
          <div className="comp-details-form-row">
            <label htmlFor="refer-complaint-type-select">Complaint type</label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="refer-complaint-type-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                isDisabled={true}
                enableValidation={false}
                showInactive={true}
                value={{ label: complaint_type, value: complaint_type }}
              />
            </div>
          </div>

          <div className="comp-details-form-row">
            <label htmlFor="refer-complaint-date-select">Date of referral</label>
            <div className="comp-details-input full-width">
              <DatePicker
                id="refer-complaint-date-select"
                onChange={() => {}}
                dateFormat="yyyy-MM-dd"
                wrapperClassName="comp-details-edit-calendar-input datepicker-disabled"
                readOnly
                showIcon
                selected={currentDate}
              />
            </div>
          </div>
          <div className="comp-details-form-row">
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
              />
            </div>
          </div>
          <div className="comp-details-form-row">
            <label htmlFor="refer-complaint-reason">
              Reason for referral<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <ValidationTextArea
                className="comp-form-control"
                id="refer-complaint-reason"
                rows={4}
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
        <Button onClick={handleReferComplaint}>Refer</Button>
      </Modal.Footer>
    </>
  );
};
