import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Button, Container, Row, Col } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { selectOfficersByAgency } from "../../../../../store/reducers/officer";
import { getComplaintById, selectComplaint, selectComplaintCallerInformation, selectComplaintHeader } from "../../../../../store/reducers/complaints";
import { CompSelect } from "../../../../common/comp-select";
import { getSelectedOfficer } from "../../../../../common/methods";

import { IEquipment } from "./types";
import Option from "../../../../../types/app/option";
import { Officer } from "../../../../../types/person/person";

//Todo: get data from GraphQL
const equipmentTypeList = [
  {
    label: 'Bear snare',
    value: 'Bear snare'
  },
  {
    label: 'Bear live trap',
    value: 'Bear live trap'
  },
  {
    label: 'Cougar foothold trap',
    value: 'Cougar foothold trap'
  },
  {
    label: 'Cougar live trap',
    value: 'Cougar live trap'
  },
  {
    label: 'Neck snare',
    value: 'Neck snare'
  },
  {
    label: 'Signage',
    value: 'Signage'
  },
  {
    label: 'Trail camera',
    value: 'Trail camera'
  },
]

export interface IEquipmentForm {
  isInEditMode: boolean
  setIsInEditMode: (param: any) => void | null
  equipmentItemData?: IEquipment | null
  setEquipmentItemData?: (param: any) => void | null
  equipmentData?: Array<IEquipment>
  setEquipmentData?: (param: any) => void | null
  indexItem?: number
  setShowEquipmentForm?: (param: boolean) => void | null
}

export const EquipmentForm: FC<IEquipmentForm> = ({
  isInEditMode,
  equipmentData,
  indexItem,
  setIsInEditMode,
  equipmentItemData,
  setEquipmentItemData,
  setShowEquipmentForm,
  setEquipmentData
}) => {
  const [type, setType] = useState<Option|undefined>()
  const [dateSet, setDateSet] = useState<Date>();
  const [dateRemoved, setDateRemoved] = useState<Date>();
  const [officerSet, setOfficerSet] = useState<Option>();
  const [officerRemoved, setOfficerRemoved] = useState<Option>();
  const [address, setAddress] = useState<string|undefined>("");
  const [xCoordinate, setXCoordinate] = useState<string>('');
  const [yCoordinate, setYCoordinate] = useState<string>('');
  
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
      setOfficerSet(officer);
    }
  }, [complaintData]);

  useEffect(() => {
    if(equipmentItemData){
      const {type, address, dateSet, dateRemoved, officerSet, officerRemoved, xCoordinate, yCoordinate} = equipmentItemData
      setType(type);
      setAddress(address);
      setXCoordinate(xCoordinate);
      setYCoordinate(yCoordinate);
      setDateRemoved(dateRemoved);
      setDateSet(dateSet);
      setOfficerSet(officerSet);
      setOfficerRemoved(officerRemoved);
    }
  }, [equipmentItemData])

  const handleSaveEquipment = () => {
    const newEquipment = {
      type,
      address,
      xCoordinate,
      yCoordinate,
      officerSet,
      dateSet,
      officerRemoved,
      dateRemoved,
    }
    if(isInEditMode) {
      const newEquipmentArr = equipmentData?.map((equipment,i) => {
        if(i === indexItem) return equipment = newEquipment
        else return equipment
      })
      if(setEquipmentData) setEquipmentData(newEquipmentArr)
      setIsInEditMode(false);
    }
    else {
      if(setEquipmentData && setShowEquipmentForm) {
        setEquipmentData((prevState: Array<IEquipment>) => [...prevState, newEquipment]);
        setShowEquipmentForm(false);
      }
    }
  }

  const handleCancelEditEquipment = () => {
    if(equipmentItemData){
      equipmentItemData.isEdit = false;
    }
    setIsInEditMode(false);
    if(setEquipmentItemData) setEquipmentItemData(null)
  }

  const hasCoordinates = (complaintData?.location?.coordinates[0] !== 0 || 
    complaintData?.location?.coordinates[1] !== 0) ? true : false

  return (
    <div className="comp-outcome-report-complaint-assessment">
      <Container style={{ padding: 0 }}>
        <Row>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair">
              <label>Equipment type</label>
              <CompSelect
                id="equipment-type-select"
                classNamePrefix="comp-select"
                className="comp-details-input"
                placeholder="Select"
                options={equipmentTypeList}
                enableValidation={false}
                onChange={(type: any) => setType(type)}
                defaultOption={equipmentItemData?.type}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair">
              <label style={{ marginTop: complaintData?.locationSummary? '-21px' : '0px' }}>Address</label>
              <div className="edit-input">
                <input
                  type="text"
                  className="comp-form-control"
                  onChange={(e) => setAddress(e.target.value)}
                  maxLength={120}
                  value={address}
                />
                {complaintData?.locationSummary && 
                  <div 
                    className="copy-text" 
                    onClick={() => complaintData? setAddress(complaintData.locationSummary) : ''}
                  >Copy location from complaint details</div>
                }
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair">
            <label style={{ marginTop: hasCoordinates? '-20px' :'0px' }}>X Coordinate</label>
              <div className="edit-input">
                <input
                  type="text"
                  className="comp-form-control"
                  onChange={(e) => setXCoordinate(e.target.value)}
                  value={xCoordinate?? ''}
                  maxLength={120}
                />
                {hasCoordinates &&
                  <div
                    className="copy-text"
                    onClick={() => {
                      setXCoordinate(complaintData?.location?.coordinates[0].toString() ?? '')
                      setYCoordinate(complaintData?.location?.coordinates[1].toString() ?? '')
                    }}
                  >
                    Copy location from complaint details
                  </div>
                }
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair">
              <label>Y Coordinate</label>
              <div className="edit-input">
                <input
                  type="text"
                  className="comp-form-control"
                  onChange={(e) => setYCoordinate(e.target.value)}
                  value={yCoordinate?? ''}
                  maxLength={120}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair" id="reported-pair-id">
              <label htmlFor="equipment-officer-set-select">Set by</label>
                <CompSelect
                  id="equipment-officer-set-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  placeholder="Select"
                  options={assignableOfficers}
                  value={officerSet}
                  enableValidation={false}
                  onChange={(officer: any) => setOfficerSet(officer)}
                />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair" id="reported-pair-id">
              <label htmlFor="equipment-day-set">Set date</label>
                <DatePicker
                  id="equipment-day-set"
                  showIcon
                  maxDate={dateRemoved ?? new Date()}
                  onChange={(date: Date) => setDateSet(date)}
                  selected={dateSet}
                  dateFormat="yyyy-MM-dd"
                  wrapperClassName="comp-details-edit-calendar-input"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair" id="reported-pair-id">
              <label htmlFor="equipment-officer-removed-select">Removed by</label>
                <CompSelect
                  id="equipment-officer-removed-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  placeholder="Select"
                  options={assignableOfficers}
                  value={officerRemoved}
                  enableValidation={false}
                  onChange={(officer: any) => setOfficerRemoved(officer)}
                />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="comp-details-label-input-pair" id="reported-pair-id">
              <label htmlFor="equipment-date-removed">Removed date</label>
                <DatePicker
                  id="equipment-date-removed"
                  showIcon
                  maxDate={new Date()}
                  minDate={dateSet ?? null}
                  onChange={(date: Date) => setDateRemoved(date)}
                  selected={dateRemoved}
                  dateFormat="yyyy-MM-dd"
                  wrapperClassName="comp-details-edit-calendar-input"
              />
            </div>
          </Col>
        </Row>
        <div className="comp-outcome-report-actions">
          <Button
            id="equipment-cancel-button"
            title="Cancel Outcome"
            className="comp-outcome-cancel"
            onClick={() => setShowEquipmentForm? setShowEquipmentForm(false) : handleCancelEditEquipment()}
          >
            Cancel
          </Button>
          <Button
            id="equipment-save-button"
            title="Save Outcome"
            className="comp-outcome-save"
            onClick={handleSaveEquipment}
          >
            Save
          </Button>
        </div>
      </Container>
    </div>
  );
};
  