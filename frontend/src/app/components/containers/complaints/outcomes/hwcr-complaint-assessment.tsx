import { FC, useEffect, useState } from "react";
import Option from "../../../../types/app/option";
import DatePicker from "react-datepicker";
import { Button } from "react-bootstrap";
import { Officer } from "../../../../types/person/person";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { getComplaintById, selectComplaint, selectComplaintCallerInformation, selectComplaintHeader } from "../../../../store/reducers/complaints";
import { selectAssessmentTypeCodeDropdown, selectJustificationCodeDropdown, selectYesNoCodeDropdown } from "../../../../store/reducers/code-table";
import { useParams } from "react-router-dom";
import { getSelectedOfficer } from "../../../../common/methods";
import { CompSelect } from "../../../common/comp-select";

export const HWCRComplaintAssessment: FC = () => {
    const dispatch = useAppDispatch();
    type ComplaintParams = {
        id: string;
        complaintType: string;
      };
    const [actionRequired, setActionRequired] = useState<string>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedOfficer, setSelectedOfficer] = useState<Option>();

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
        setSelectedDate(date);
          };
    const handleActionRequiredChange = (selected: Option | null) => {
        setActionRequired(selected?.value);
          };
    const actionRequiredList = useAppSelector(selectYesNoCodeDropdown);
    const justificationList = useAppSelector(selectJustificationCodeDropdown);
    const assessmentTypeList = useAppSelector(selectAssessmentTypeCodeDropdown);
    const {
        personGuid,
      } = useAppSelector(selectComplaintHeader(complaintType));

  useEffect(() => {
    if (id && (!complaintData || complaintData.id !== id)) {
      dispatch(getComplaintById(id, complaintType));
    }
  }, [id, complaintType, complaintData, dispatch]);

  useEffect(() => {
    if(complaintData) {
      const officer = getSelectedOfficer(assignableOfficers, personGuid, complaintData);
      setSelectedOfficer(officer);
    }
  }, [complaintData]);
      
      const justificationLabelClass = actionRequired === "No" ? "comp-outcome-report-label-half-column" : "comp-outcome-report-label-half-column comp-outcome-hide";
      const justificationEditClass = actionRequired === "No" ? "comp-outcome-report-edit-column" : "comp-outcome-report-edit-column comp-outcome-hide";

    return (
        <div className="comp-outcome-report-block">
            <h6>Complaint assessment</h6>
            <div className="comp-outcome-report-complaint-assessment">
                <div className="comp-outcome-report-container">
                    <div className="comp-outcome-report-label-column">
                        Assessment
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        {assessmentTypeList.map(assessmentType => (
                            <div className="form-check form-check-spacing" key={assessmentType.label}>
                                <input className="form-check-input" id={assessmentType.value} type="checkbox" />
                                <label className="form-check-label" htmlFor={assessmentType.value}>{assessmentType.label}</label>
                            </div>
                            ))
                        }
                    </div>
                </div>
                <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
                    <div className="comp-outcome-report-label-half-column">
                        Action required?
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <CompSelect id="action-required" options={actionRequiredList} enableValidation={false} placeholder="Select" onChange={(e) => handleActionRequiredChange(e)} />
                    </div>
                    <div className={justificationLabelClass}>
                            Justification
                        </div>
                        <div className={justificationEditClass}>
                            <CompSelect id="justification" options={justificationList} enableValidation={false} placeholder="Select" onChange={(e) => (e)} />
                        </div>
                </div>
                <div className="comp-outcome-report-container comp-outcome-report-inner-spacing">
                    <div className="comp-outcome-report-label-half-column">
                        Officer
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <CompSelect 
                          id="outcome-officer"
                          options={assignableOfficers}
                          enableValidation={false}
                          placeholder="Select"
                          value={selectedOfficer}
                          onChange={(officer: any) => setSelectedOfficer(officer)}
                        />
                    </div>
                    <div className="comp-outcome-report-label-half-column">
                        Date
                    </div>
                    <div className="comp-outcome-report-edit-column">
                        <DatePicker
                            id="complaint-outcome-date"
                            showIcon
                            onChange={handleDateChange}
                            selected={selectedDate}
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

