import { FC } from "react";
import { OutcomeSelect } from "../../../common/outcome-select";
import Option from "../../../../types/app/option";
import DatePicker from "react-datepicker";
import { Button } from "react-bootstrap";
import { Officer } from "../../../../types/person/person";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { selectComplaintCallerInformation } from "../../../../store/reducers/complaints";


export const HWCRComplaintAssessment: FC = () => {
    const actionItems: Option[] = [
        { value: "", label: "None"},
        { value: "test1", label: "Test Action 1" },
        { value: "test2", label: "Test Action 2" },
    ];
    const {
        ownedByAgencyCode,
      } = useAppSelector(selectComplaintCallerInformation);
    const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency_code??));
    const assignableOfficers: Option[] = officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
        : [];
    return (
        <div className="comp-outcome-report-block">
            <h6>Complaint assessment</h6>
            <div className="comp-outcome-report-complaint-assessment">
                <div className="comp-outcome-report-container comp-outcome-report-top-spacing">
                    <div className="comp-outcome-report-label-column">
                        Assessment
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <div className="form-check">
                            <input className="form-check-input" id="assessed-risk" type="checkbox" />
                            <label className="form-check-label" htmlFor="assessed-risk">Assessed public safety risk</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" id="assessed-health" type="checkbox" />
                            <label className="form-check-label" htmlFor="assessed-health">Assessed health as per animal welfare guidelines</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" id="assessed-conflict" type="checkbox" />
                            <label className="form-check-label" htmlFor="assessed-conflict">Assessed known conflict history</label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" id="identification" type="checkbox" />
                            <label className="form-check-label" htmlFor="identification">Confirmed idenfication of offending animals</label>
                        </div>
                    </div>
                </div>
                <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
                    <div className="comp-outcome-report-label-half-column">
                        Action required?
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <OutcomeSelect id="action-required" options={actionItems} enableValidation={false} placeholder="Select" onChange={(e) => (e)} />
                    </div>
                    <div className="comp-outcome-report-label-half-column">
                        Justification
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <OutcomeSelect id="justification" options={actionItems} enableValidation={false} placeholder="Select" onChange={(e) => (e)} />
                    </div>
                </div>
                <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
                    <div className="comp-outcome-report-label-half-column">
                        Officer
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <OutcomeSelect id="outcome-officer" options={assignableOfficers} enableValidation={false} placeholder="Select" onChange={(e) => (e)} />
                    </div>
                    <div className="comp-outcome-report-label-half-column">
                        Date
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <DatePicker
                            id="complaint-incident-time"
                            showIcon
                            onChange={(e) => (e)}
                            dateFormat="yyyy-MM-dd"
                            wrapperClassName="comp-details-edit-calendar-input"
                        />
                    </div>
                </div>
                <div className="comp-outcome-report-container comp-outcome-report-bottom-spacing">
                        <div className="comp-outcome-report-actions">
                <Button
                  id="outcome-cancel-button"
                  title="Cancel Outcome"
                  className="comp-outcome-cancel"
                  onClick={(e) => (e)}
                >
                  Cancel
                </Button>
                <Button
                  id="outcome-save-button"
                  title="Save Outcome"
                  className="comp-outcome-save"
                  onClick={(e) => (e)}
                >
                  Save
                </Button>
                        </div>
                    </div>
            </div>
        </div>
    );
};
