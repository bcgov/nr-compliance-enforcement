import { FC, useEffect, useState } from "react";
import { OutcomeSelect } from "../../../common/outcome-select";
import Option from "../../../../types/app/option";
import DatePicker from "react-datepicker";
import { Button } from "react-bootstrap";
import { Officer } from "../../../../types/person/person";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { getComplaintById, selectComplaint, selectComplaintCallerInformation, selectComplaintHeader } from "../../../../store/reducers/complaints";
import { selectActionRequiredCodeDropdown, selectJustificationCodeDropdown } from "../../../../store/reducers/code-table";
import { UUID } from "crypto";
import { Complaint as ComplaintDto } from "../../../../types/app/complaints/complaint";
import { from } from "linq-to-typescript";
import { useParams } from "react-router-dom";

export const HWCRComplaintAssessment: FC = () => {
    const dispatch = useAppDispatch();
    type ComplaintParams = {
        id: string;
        complaintType: string;
      };
    const [actionRequired, setActionRequired] = useState<string>();
    const complaintData = useAppSelector(selectComplaint);
    const { id = "", complaintType = "" } = useParams<ComplaintParams>();
    const {
        ownedByAgencyCode,
      } = useAppSelector(selectComplaintCallerInformation);
    const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency));
    const assignableOfficers: Option[] = officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
        : [];
    const handleDateChange = (date: Date) => {

          };
    const handleActionRequiredChange = (selected: Option | null) => {
        setActionRequired(selected?.value);
          };
    const actionRequiredList = useAppSelector(selectActionRequiredCodeDropdown);
    const justificationList = useAppSelector(selectJustificationCodeDropdown);
    const {
        personGuid,
      } = useAppSelector(selectComplaintHeader(complaintType));

  useEffect(() => {
    if (id && (!complaintData || complaintData.id !== id)) {
      dispatch(getComplaintById(id, complaintType));
    }
  }, [id, complaintType, complaintData, dispatch]);
      
    const getSelectedOfficer = (officers: Option[], personGuid: UUID | string, update: ComplaintDto | undefined): any => {
        if (update && personGuid) {
          const { delegates } = update;
    
          const assignees = delegates.filter((item) => item.type === "ASSIGNEE" && item.isActive);
          if (!from(assignees).any()) {
            return undefined;
          }
    
          const selected = officers.find(({ value }) => {
            const first = from(assignees).firstOrDefault();
            if (first) {
              const {
                person: { id },
              } = first;
              return value === id;
            }
    
            return false;
          });
    
          return selected;
        }
    
        return undefined;
      };
      const justificationLabelClass = actionRequired === "No" ? "comp-outcome-report-label-half-column" : "comp-outcome-report-label-half-column comp-outcome-hide";
      const justificationEditClass = actionRequired === "No" ? "comp-outcome-report-edit-column" : "comp-outcome-report-edit-column comp-outcome-hide";
      let selectedAssignedOfficer;
      if(complaintData)
      {
        selectedAssignedOfficer = getSelectedOfficer(assignableOfficers, personGuid, complaintData);
      }
    return (
        <div className="comp-outcome-report-block">
            <h6>Complaint assessment</h6>
            <div className="comp-outcome-report-complaint-assessment">
                <div className="comp-outcome-report-container">
                    <div className="comp-outcome-report-label-column">
                        Assessment
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <div className="form-check form-check-spacing">
                            <input className="form-check-input" id="assessed-risk" type="checkbox" />
                            <label className="form-check-label" htmlFor="assessed-risk">Assessed public safety risk</label>
                        </div>
                        <div className="form-check form-check-spacing">
                            <input className="form-check-input" id="assessed-health" type="checkbox" />
                            <label className="form-check-label" htmlFor="assessed-health">Assessed health as per animal welfare guidelines</label>
                        </div>
                        <div className="form-check form-check-spacing">
                            <input className="form-check-input" id="assessed-conflict" type="checkbox" />
                            <label className="form-check-label" htmlFor="assessed-conflict">Assessed known conflict history</label>
                        </div>
                        <div className="form-check form-check-spacing">
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
                        <OutcomeSelect id="action-required" options={actionRequiredList} enableValidation={false} placeholder="Select" onChange={(e) => handleActionRequiredChange(e)} />
                    </div>
                    <div className={justificationLabelClass}>
                            Justification
                        </div>
                        <div className={justificationEditClass}>
                            <OutcomeSelect id="justification" options={justificationList} enableValidation={false} placeholder="Select" onChange={(e) => (e)} />
                        </div>
                </div>
                <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
                    <div className="comp-outcome-report-label-half-column">
                        Officer
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <OutcomeSelect id="outcome-officer" options={assignableOfficers} enableValidation={false} placeholder="Select" value={selectedAssignedOfficer} onChange={(e) => (e)} />
                    </div>
                    <div className="comp-outcome-report-label-half-column">
                        Date
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <DatePicker
                            id="complaint-incident-time"
                            showIcon
                            onChange={handleDateChange}
                            selected={new Date()}
                            dateFormat="yyyy-MM-dd"
                            wrapperClassName="comp-details-edit-calendar-input"
                        />
                    </div>
                </div>
                <div className="comp-outcome-report-container">
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

