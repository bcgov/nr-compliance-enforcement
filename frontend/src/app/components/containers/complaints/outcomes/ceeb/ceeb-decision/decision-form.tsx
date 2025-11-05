import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import {
  selectDischargeDropdown,
  selectNonComplianceDropdown,
  selectSectorDropdown,
  selectScheduleDropdown,
  selectDecisionTypeDropdown,
  selectScheduleSectorXref,
  selectIPMAuthCategoryDropdown,
} from "@store/reducers/code-table-selectors";
import { selectLeadAgencyDropdown } from "@store/reducers/code-table";
import { Decision } from "@/app/types/app/complaint-outcomes/ceeb/decision/decision";
import { Button } from "react-bootstrap";
import { ValidationDatePicker } from "@common/validation-date-picker";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { CompInput } from "@components/common/comp-input";
import { openModal } from "@store/reducers/app";
import { CANCEL_CONFIRM } from "@apptypes/modal/modal-types";
import { getCaseFile, upsertDecisionOutcome } from "@/app/store/reducers/complaint-outcome-thunks";
import { selectCaseId } from "@/app/store/reducers/complaint-outcome-selectors";
import { UUID } from "node:crypto";
import { ValidationTextArea } from "@common/validation-textarea";
import { getDropdownOption } from "@/app/common/methods";
import { selectComplaintViewMode } from "@/app/store/reducers/complaints";

type props = {
  leadIdentifier: string;
  toggleEdit: Function;
  //-- properties
  id?: string;
  schedule?: string;
  ipmAuthCategory?: string;
  sector?: string;
  discharge: string;
  nonCompliance?: string;
  rationale: string;
  inspectionNumber?: string;
  leadAgency?: string;
  assignedTo: string;
  actionTaken: string;
  actionTakenDate: Date | null;
};

export const DecisionForm: FC<props> = ({
  leadIdentifier,
  toggleEdit,
  //--
  id,
  schedule,
  ipmAuthCategory,
  sector,
  discharge,
  nonCompliance,
  rationale,
  inspectionNumber,
  leadAgency,
  assignedTo,
  actionTaken,
  actionTakenDate,
}) => {
  const dispatch = useAppDispatch();

  //-- select data from redux
  const caseId = useAppSelector(selectCaseId) as UUID;
  const current_user = useAppSelector((state) => state.app.profile.idir);

  //-- drop-downs
  const dischargesOptions = useAppSelector(selectDischargeDropdown);
  const nonComplianceOptions = useAppSelector(selectNonComplianceDropdown);
  const sectorsOptions = useAppSelector(selectSectorDropdown);
  const schedulesOptions = useAppSelector(selectScheduleDropdown);
  const ipmAuthCategoryOptions = useAppSelector(selectIPMAuthCategoryDropdown);
  const decisionTypeOptions = useAppSelector(selectDecisionTypeDropdown);
  const leadAgencyOptions = useAppSelector(selectLeadAgencyDropdown);
  const scheduleSectorType = useAppSelector(selectScheduleSectorXref);
  const isReadOnly = useAppSelector(selectComplaintViewMode);

  //-- error messgaes
  const [scheduleErrorMessage, setScheduleErrorMessage] = useState("");
  const [sectorErrorMessage, setSectorErrorMessage] = useState("");
  const [dischargeErrorMessage, setDischargeErrorMessage] = useState("");
  const [nonComplianceErrorMessage] = useState("");
  const [dateActionTakenErrorMessage, setDateActionTakenErrorMessage] = useState("");
  const [leadAgencyErrorMessage, setLeadAgencyErrorMessage] = useState("");
  const [inspectionNumberErrorMessage, setInspectionNumberErrorMessage] = useState("");
  const [actionTakenErrorMessage, setActionTakenErrorMessage] = useState("");
  const [ipmAuthCategoryErrorMessage, setIpmAuthCategoryErrorMessage] = useState("");

  //-- component data

  // eslint-disable-line no-console, max-len
  const [data, setData] = useState<Decision>({
    schedule,
    ipmAuthCategory,
    sector,
    discharge,
    nonCompliance,
    rationale,
    inspectionNumber,
    leadAgency,
    assignedTo,
    actionTaken,
    actionTakenDate,
  });

  const [sectorList, setSectorList] = useState<Array<Option>>();
  const [isIPMSector, setIsIPMSector] = useState<boolean>(false);

  useEffect(() => {
    setIsIPMSector(schedule === "IPM");
    if (sector && schedule) {
      let options = scheduleSectorType
        .filter((item) => item.schedule === schedule)
        .map((item) => {
          const record: Option = { label: item.longDescription, value: item.sector };
          return record;
        });
      setSectorList(options);
    }
  }, [sector, schedule, scheduleSectorType]);

  //-- update the decision state by property
  const updateModel = (property: string, value: string | Date | undefined | null) => {
    const model = { ...data, [property]: value };

    setData(model);
  };

  const handleRationaleChange = (value: string) => {
    updateModel("rationale", value.trim());
  };

  const handleIPMAuthCategoryChange = (value: string | null) => {
    updateModel("ipmAuthCategory", value);
  };

  const handleDateChange = (date?: Date) => {
    updateModel("actionTakenDate", date);
  };

  const handleScheduleChange = (schedule: string | undefined) => {
    if (schedule) {
      const options = scheduleSectorType
        .filter((item) => item.schedule === schedule)
        .map((item) => {
          const record: Option = { label: item.longDescription, value: item.sector };
          return record;
        });
      setIsIPMSector(schedule === "IPM");
      const model = {
        ...data,
        sector: "",
        ipmAuthCategory: "",
        schedule,
        discharge: schedule === "IPM" ? "PSTCD" : data.discharge,
      };
      setData(model);
      setSectorList(options);
    } else {
      const model = { ...data, schedule: "" };
      setData(model);
    }
  };

  const handleActionTakenChange = (value: string) => {
    //-- if the action taken changes make sure to clear the
    //-- lead agency and inspection number
    const update = {
      ...data,
      actionTaken: value,
      assignedTo: current_user,
      leadAgency: undefined,
      inspectionNumber: undefined,
    };
    setData(update);
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
            setData({
              schedule,
              ipmAuthCategory,
              sector,
              discharge,
              nonCompliance,
              rationale,
              inspectionNumber,
              leadAgency,
              assignedTo,
              actionTaken,
              actionTakenDate,
            });

            resetErrorMessages();

            if (id !== undefined) {
              toggleEdit(false);
            }
          },
        },
      }),
    );
  };

  const resetErrorMessages = () => {
    setScheduleErrorMessage("");
    setSectorErrorMessage("");
    setDischargeErrorMessage("");
    setActionTakenErrorMessage("");
    setDateActionTakenErrorMessage("");
    setLeadAgencyErrorMessage("");
    setInspectionNumberErrorMessage("");
    setIpmAuthCategoryErrorMessage("");
  };

  const handleSaveButtonClick = () => {
    const identifier = id !== undefined ? caseId : leadIdentifier;
    resetErrorMessages();

    if (isValid()) {
      dispatch(upsertDecisionOutcome(identifier, leadIdentifier, data)).then(async (response) => {
        if (response === "success") {
          dispatch(getCaseFile(leadIdentifier));

          if (id !== undefined) {
            toggleEdit(false);
          }
        }
      });
    }
  };

  const isValid = (): boolean => {
    let _isValid = true;

    const _isDecisionValid = (data: Decision, _isValid: boolean): boolean => {
      if (!data.schedule) {
        setScheduleErrorMessage("Required");
        _isValid = false;
      }

      if (isIPMSector && !data.ipmAuthCategory) {
        setIpmAuthCategoryErrorMessage("Required");
        _isValid = false;
      }

      if (!data.sector) {
        setSectorErrorMessage("Required");
        _isValid = false;
      }

      if (!data.discharge) {
        setDischargeErrorMessage("Required");
        _isValid = false;
      }

      return _isValid;
    };

    const _isActionValid = (data: Decision, _isValid: boolean): boolean => {
      if (data.actionTaken && !data.actionTakenDate) {
        setDateActionTakenErrorMessage("Date required when action taken selected");
        _isValid = false;
      }

      if (data.actionTakenDate && !data.actionTaken) {
        setActionTakenErrorMessage("Action taken required when date is selected");
        _isValid = false;
      }

      return _isValid;
    };

    _isValid = _isDecisionValid(data, _isValid);

    if (data.actionTaken === CASE_ACTION_CODE.FWDLEADAGN && !data.leadAgency) {
      setLeadAgencyErrorMessage("Required");
      _isValid = false;
    }

    if (
      data.actionTaken === CASE_ACTION_CODE.RESPREC &&
      data.inspectionNumber &&
      !data.inspectionNumber.match(/^\d{1,10}$/)
    ) {
      setInspectionNumberErrorMessage("Invalid format. Please only include numbers.");
      _isValid = false;
    }

    _isValid = _isActionValid(data, _isValid);

    return _isValid;
  };

  return (
    <>
      <div className="comp-details-form">
        <div
          className="comp-details-form-row"
          id="decision-schedule-sector-type"
        >
          <label htmlFor="outcome-decision-schedule-sector">
            WDR schedule/IPM sector type<span className="required-ind">*</span>
          </label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-schedule-sector"
              showInactive={false}
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={schedulesOptions}
              enableValidation={true}
              errorMessage={scheduleErrorMessage}
              placeholder="Select "
              onChange={(evt) => {
                handleScheduleChange(evt?.value);
              }}
              isDisabled={isReadOnly}
              value={getDropdownOption(data.schedule, schedulesOptions)}
              isClearable={true}
            />
          </div>
        </div>
        {isIPMSector && (
          <div
            className="comp-details-form-row"
            id="decision-ipm-auth-category"
          >
            <label htmlFor="outcome-decision-ipm-auth-category">
              Authorization category<span className="required-ind">*</span>
            </label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="outcome-decision-ipm-auth-category"
                showInactive={false}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={ipmAuthCategoryOptions}
                enableValidation={true}
                errorMessage={ipmAuthCategoryErrorMessage}
                placeholder="Select "
                onChange={(evt) => {
                  handleIPMAuthCategoryChange(evt?.value ? evt.value.trim() : null);
                }}
                isDisabled={isReadOnly}
                value={getDropdownOption(data.ipmAuthCategory, ipmAuthCategoryOptions)}
                isClearable={true}
              />
            </div>
          </div>
        )}
        <div
          className="comp-details-form-row"
          id="decision-sector-category"
        >
          <label htmlFor="outcome-decision-sector-category">
            Sector<span className="required-ind">*</span>
          </label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-sector-category"
              showInactive={false}
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={sectorList}
              enableValidation={true}
              errorMessage={sectorErrorMessage}
              placeholder="Select "
              onChange={(evt) => {
                updateModel("sector", evt?.value);
              }}
              isDisabled={isReadOnly}
              value={data.sector ? getDropdownOption(data.sector, sectorsOptions) : null}
              isClearable={true}
            />
          </div>
        </div>
        <div
          className={`comp-details-form-row ${isIPMSector ? "align-flex-end" : ""}`}
          id="decision-discharge-type"
        >
          <label htmlFor="outcome-decision-discharge">
            Discharge type<span className="required-ind">*</span>
          </label>
          <div className="comp-details-input full-width">
            {isIPMSector ? (
              <span>Pesticides</span>
            ) : (
              <CompSelect
                id="outcome-decision-discharge"
                showInactive={false}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={dischargesOptions}
                enableValidation={true}
                errorMessage={dischargeErrorMessage}
                placeholder="Select "
                onChange={(evt) => {
                  updateModel("discharge", evt?.value);
                }}
                isDisabled={isReadOnly}
                value={getDropdownOption(data.discharge, dischargesOptions)}
                isClearable={true}
              />
            )}
          </div>
        </div>
        <hr></hr>
        <div
          className="comp-details-form-row"
          id="decision-action-taken"
        >
          <label htmlFor="outcome-decision-action-taken">Action taken</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-action-taken"
              showInactive={false}
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={decisionTypeOptions}
              enableValidation={true}
              errorMessage={actionTakenErrorMessage}
              placeholder="Select"
              onChange={(evt) => {
                const action = evt?.value ? evt?.value : "";
                handleActionTakenChange(action);
              }}
              isDisabled={isReadOnly}
              value={getDropdownOption(data.actionTaken, decisionTypeOptions)}
              isClearable={true}
            />
          </div>
        </div>
        {data.actionTaken === CASE_ACTION_CODE.FWDLEADAGN && (
          <div
            className="comp-details-form-row"
            id="decision-lead-agency"
          >
            <label htmlFor="outcome-decision-lead-agency">Lead agency</label>
            <div className="comp-details-input full-width">
              <CompSelect
                id="outcome-decision-lead-agency"
                showInactive={false}
                className="comp-details-input"
                classNamePrefix="comp-select"
                options={leadAgencyOptions}
                enableValidation={true}
                errorMessage={leadAgencyErrorMessage}
                placeholder="Select"
                onChange={(evt) => {
                  updateModel("leadAgency", evt?.value);
                }}
                value={getDropdownOption(data.leadAgency, leadAgencyOptions)}
                isClearable={true}
              />
            </div>
          </div>
        )}
        {data.actionTaken === CASE_ACTION_CODE.RESPREC && (
          <div
            className="comp-details-form-row"
            id="decision-inspection-number"
          >
            <label htmlFor="outcome-decision-inspection-number">NRIS inspection number</label>
            <div className="comp-details-input full-width">
              <CompInput
                id="outcome-decision-inspection-number"
                divid="outcome-decision-inspection-number-value"
                type="input"
                inputClass="comp-form-control"
                value={data?.inspectionNumber}
                error={inspectionNumberErrorMessage}
                maxLength={10}
                onChange={(evt: any) => {
                  const {
                    target: { value },
                  } = evt;

                  updateModel("inspectionNumber", value);
                }}
              />
            </div>
          </div>
        )}
        <div
          className="comp-details-form-row"
          id="decision-non-compliance-decision-matrix"
        >
          <label htmlFor="outcome-decision-non-compliance">Non-compliance decision matrix</label>
          <div className="comp-details-input full-width">
            <CompSelect
              id="outcome-decision-non-compliance"
              showInactive={false}
              className="comp-details-input"
              classNamePrefix="comp-select"
              options={nonComplianceOptions}
              enableValidation={true}
              errorMessage={nonComplianceErrorMessage}
              placeholder="Select"
              onChange={(evt) => {
                updateModel("nonCompliance", evt ? evt?.value : null);
              }}
              isDisabled={isReadOnly}
              value={getDropdownOption(data.nonCompliance, nonComplianceOptions)}
              isClearable={true}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="decision-rationale"
        >
          <label htmlFor="outcome-decision-rationale">Rationale</label>
          <div className="comp-details-input full-width">
            <ValidationTextArea
              className="comp-form-control"
              id="outcome-decision-rationale"
              defaultValue={rationale}
              rows={2}
              errMsg={""}
              maxLength={4000}
              onChange={handleRationaleChange}
              disabled={isReadOnly}
            />
          </div>
        </div>
        <div
          className="comp-details-form-row"
          id="complaint-outcome-date-div"
        >
          <label htmlFor="outcome-decision-outcome-date">Date</label>
          <div className="comp-details-input">
            <ValidationDatePicker
              id="outcome-decision-outcome-date"
              selectedDate={data?.actionTakenDate}
              onChange={handleDateChange}
              placeholder="Select date"
              className="comp-details-edit-calendar-input" // Adjust class as needed
              classNamePrefix="comp-select" // Adjust class as needed
              errMsg={dateActionTakenErrorMessage} // Pass error message if any
              maxDate={new Date()}
              isDisabled={isReadOnly}
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
          disabled={isReadOnly}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          id="outcome-decision-save-button"
          title="Save Decision"
          onClick={() => handleSaveButtonClick()}
          disabled={isReadOnly}
        >
          Save
        </Button>
      </div>
    </>
  );
};
