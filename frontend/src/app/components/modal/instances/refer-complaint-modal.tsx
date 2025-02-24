import { FC } from "react";
import { Modal, Row, Col, Button, Alert } from "react-bootstrap";
import { useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { CompSelect } from "@components/common/comp-select";
import DatePicker from "react-datepicker";
import { selectOfficerListByAgency } from "@store/reducers/officer";
import { ValidationTextArea } from "@/app/common/validation-textarea";
import { AgencyBanner } from "@components/containers/layout/agency-banner";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectCodeTable } from "@store/reducers/code-table";
import { selectComplaint } from "@store/reducers/complaints";
import { COMPLAINT_TYPE_AGENCY_MAPPING } from "@apptypes/app/complaint-types";

type ReferComplaintModalProps = {
  close: () => void;
  submit: () => void;
  id: string;
  complaint_type: string;
};

export const ReferComplaintModal: FC<ReferComplaintModalProps> = ({ close, submit, id, complaint_type }) => {
  const modalData = useAppSelector(selectModalData);
  const assignableOfficers = useAppSelector(selectOfficerListByAgency);
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const complaintTypes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.COMPLAINT_TYPE));
  const complaintData = useAppSelector(selectComplaint);

  const { title } = modalData;
  const currentDate = new Date();

  console.log(agencies);
  console.log(complaintTypes);

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
      value: agency.agency,
    }));

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h3">{`${title} #${id}`}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <Row>
          <Col>
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
          </Col>
        </Row>
        <Row>
          <Col className="comp-details-section--grey">
            <h6>Previous agency</h6>
            <AgencyBanner />
          </Col>
        </Row>
        <Row>
          <Col className="comp-details-section">
            <h6>New lead agency</h6>
            <AgencyBanner />
          </Col>
        </Row>

        <div className="comp-details-form">
          <div className="comp-details-form-row">
            <label htmlFor="refer-complaint-from">Previous agency</label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="refer-complaint-from"
                classNamePrefix="comp-select"
                className="comp-details-input"
                isDisabled={true}
                enableValidation={false}
                showInactive={true}
                value={{ label: complaintData?.ownedBy, value: complaintData?.ownedBy }}
              />
            </div>
          </div>
          <div className="comp-details-form-row">
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
                //errorMessage={officerErrorMessage}
                //value={selectedOfficer}
                placeholder="Select "
                //onChange={handleSelectedOfficerChange}
                //isDisabled={isReadOnly}
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
                //defaultValue={currentNote}
                rows={4}
                errMsg=""
                onChange={() => {}}
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
          Close
        </Button>
        <Button onClick={submit}>OK</Button>
      </Modal.Footer>
    </>
  );
};
