import { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";

import { CompTextIconButton } from "../../../../common/comp-text-icon-button";
import { DeleteConfirmModal } from "../../../../modal/instances/delete-confirm-modal";
import { EquipmentDetailsDto } from "../../../../../types/app/case-files/equipment-details";
import { selectOfficerByPersonGuid } from "../../../../../store/reducers/officer";
import { useAppSelector } from "../../../../../hooks/hooks";
import { Equipment } from "../../../../../types/outcomes/equipment";
import Option from "../../../../../types/app/option";
import { selectEquipment } from "../../../../../store/reducers/cases";
import { selectEquipmentDropdown } from "../../../../../store/reducers/code-table";
import { CASE_ACTION_CODE } from "../../../../../constants/case_actions";

interface EquipmentDetailsWithVariables {
  equipmentTypeCode: string;
  equipmentTypeShortDescription?: string;
  equipmentTypeLongDescription?: string;
  equipmentTypeActiveIndicator: boolean;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  setBy?: string;
  setDate?: Date; 
  removedBy?: string;
  removedDate?: Date;
}

interface EquipmentItemProps {
  equipment: EquipmentDetailsDto; 
  onEdit: (guid: string) => void

}

function processEquipmentDetails(details: EquipmentDetailsDto): EquipmentDetailsWithVariables {
  const result: EquipmentDetailsWithVariables = { ...details }; // Copy original details
  
  // Initialize variables
  let setBy: string | undefined;
  let setDate: Date | undefined;
  let removedBy: string | undefined;
  let removedDate: Date | undefined;

  details.actions?.forEach(action => {
    if (action.actionCode === CASE_ACTION_CODE.SETEQUIPMT) {
      const setOfficer = useAppSelector(selectOfficerByPersonGuid(action.actor));
      setBy =`${setOfficer?.person_guid.first_name} ${setOfficer?.person_guid.last_name}`;
      setDate = new Date(action.date);
    } else if (action.actionCode === CASE_ACTION_CODE.REMEQUIPMT) {
      const removedOfficer = useAppSelector(selectOfficerByPersonGuid(action.actor));
      removedBy =`${removedOfficer?.person_guid.first_name} ${removedOfficer?.person_guid.last_name}`;
      removedDate = new Date(action.date);
    }
  });

  // Assign variables to result
  if (setBy !== undefined && setDate !== undefined) {
    result.setBy = setBy;
    result.setDate = setDate;
  }
  if (removedBy !== undefined && removedDate !== undefined) {
    result.removedBy = removedBy;
    result.removedDate = removedDate;
  }

  return result;
}

export const EquipmentItem: FC<EquipmentItemProps> = ({ 
  equipment,
  onEdit,
}) => {

  const [showModal, setShowModal] = useState(false);

  const handleEdit = (equipment: EquipmentDetailsDto) => {
    if (equipment.equipmentGuid) {
      onEdit(equipment.equipmentGuid);
    }
  }

  // for turning codes into values
  const getValue = (property: string): Option | undefined => {
    switch (property) {
      case "equipment": {
        return equipmentTypeCodes.find((item) => item.value === equipment.equipmentTypeCode);
      }
    }
  };
  

  const equipmentTypeCodes = useAppSelector(selectEquipmentDropdown);

  const processedEquipment = processEquipmentDetails(equipment);
  
  return (
    <>
      <DeleteConfirmModal
        show={showModal}
        title="Delete equipment?"
        content="All the data in this section will be lost."
        onHide={() => setShowModal(false)}
        onDelete={() => {
          //handleDelete(indexItem);
          setShowModal(false);
        }}
        confirmText="Yes, delete equipment"
      />
      <div className="comp-outcome-report-complaint-assessment equipment-item">
        {equipment.equipmentGuid && <div className="status-bar"></div>}
        <div className="equipment-item-header">
          <div className="title">
            <h6>{getValue("equipment")?.label}</h6>
            {equipment.equipmentGuid && <div className="badge">Active</div>}
          </div>
          <div>
            <CompTextIconButton
              buttonClasses="button-text"
              style={{ marginRight: '15px'}}
              text="Delete"
              icon={BsTrash3}
              click={() => setShowModal(true)}
            />
            <CompTextIconButton
              buttonClasses="button-text"
              text="Edit"
              icon={BsPencil}
              click={() => handleEdit(equipment)}
            />
          </div>
        </div>
        <div className="equipment-item-content">
          <div className="label">Address</div>
          <div className="value" id="">
            {equipment.address}
          </div>
        </div>
        <Row>
          <Col xs={12} md={4}>
            <div className="equipment-item-content">
              <div className="label">X Coordinate</div>
              <div className="value" id="">
                {equipment.xCoordinate}
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="equipment-item-content">
              <div className="label">Y Coordinate</div>
              <div className="value" id="">
                {equipment.yCoordinate}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <div className="equipment-item-content">
              <div className="label">Set by</div>
              <div className="comp-details-content">
                <div
                  data-initials-sm={getAvatarInitials(`${processedEquipment.setBy}`)}
                  className="comp-pink-avatar-sm"
                >
                  <span
                    id="comp-details-assigned-officer-name-text-id"
                    className="comp-padding-left-xs"
                  >
                    
                    {processedEquipment.setBy}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="equipment-item-content">
              <div className="label">Set date</div>
              <div className="value" id="">
                {formatDate(processedEquipment.setDate?.toString())}
              </div>
            </div>
          </Col>
        </Row>
        {equipment.equipmentGuid && processedEquipment.removedBy &&
          <Row>
            <Col xs={12} md={4}>
              <div className="equipment-item-content">
                <div className="label">Removed by</div>
                <div className="comp-details-content">
                  <div
                    data-initials-sm={getAvatarInitials(processedEquipment.removedBy ?? '')}
                    className="comp-pink-avatar-sm"
                  >
                    <span
                      id="comp-details-assigned-officer-name-text-id"
                      className="comp-padding-left-xs"
                    >
                      {processedEquipment.removedBy}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="equipment-item-content">
                <div className="label">Removed date</div>
                <div className="value" id="">
                  {formatDate(processedEquipment.removedDate?.toString())}
                </div>
              </div>
            </Col>
          </Row>
        }
      </div>
    </>
  );
}
  