import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { CompSelect } from "../../../common/comp-select";
import DatePicker from "react-datepicker";
import { getSelectedOfficer } from "../../../../common/methods";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../store/reducers/officer";
import { getComplaintById, selectComplaint, selectComplaintCallerInformation, selectComplaintHeader } from "../../../../store/reducers/complaints";

import Option from "../../../../types/app/option";
import { Officer } from "../../../../types/person/person";
import { selectPreventEducationDropdown } from "../../../../store/reducers/code-table";

export const HWCRPreventionEducation: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedOfficer, setSelectedOfficer] = useState<Option>();
  const [showContent, setShowContent] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { id = "", complaintType = "" } = useParams<{id: string, complaintType: string}>();
  const complaintData = useAppSelector(selectComplaint);
  const {
    ownedByAgencyCode,
  } = useAppSelector(selectComplaintCallerInformation);
  const {
    personGuid,
  } = useAppSelector(selectComplaintHeader(complaintType));
  const officersInAgencyList = useAppSelector(selectOfficersByAgency(ownedByAgencyCode?.agency));
  const actionList = useAppSelector(selectPreventEducationDropdown);

  const assignableOfficers: Option[] = officersInAgencyList !== null
      ? officersInAgencyList.map((officer: Officer) => ({
          value: officer.person_guid.person_guid,
          label: `${officer.person_guid.first_name} ${officer.person_guid.last_name}`,
        }))
        : [];
  
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
  
  return (
        <div className="comp-outcome-report-block">
            <h6>Prevention and education</h6>
            <div className="comp-outcome-report-button">
              {!showContent? 
                <Button
                  id="outcome-report-add-actions"
                  title="Add actions"
                  variant="primary"
                  onClick={() => setShowContent(true)}
                >
                  <span>Add actions</span>
                  <BsPlusCircle />
                </Button> 
                :
                <div className="comp-outcome-report-complaint-assessment">
                  <div className="comp-outcome-report-container">
                      <div className="comp-outcome-report-label-column">
                          Prevention and education
                      </div>
                      <div className="comp-outcome-report-edit-column">
                          {actionList.map(action => (
                              <div className="form-check form-check-spacing" key={action.label}>
                                  <input className="form-check-input" id={action.value} type="checkbox" />
                                  <label className="form-check-label" htmlFor={action.value}>{action.label}</label>
                              </div>
                              ))
                          }
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
                          onChange={(date: Date) => setSelectedDate(date)}
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
                        onClick={() => (setShowContent(false))}
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
              }
        </div>
        </div>
    );
};
  