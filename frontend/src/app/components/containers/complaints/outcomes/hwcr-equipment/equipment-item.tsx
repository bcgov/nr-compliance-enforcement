import { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";

import { CompTextIconButton } from "../../../../common/comp-text-icon-button";
import { DeleteConfirmModal } from "../../../../modal/instances/delete-confirm-modal";
import { EquipmentDetailsDto } from "../../../../../types/app/case-files/equipment-details";

interface EquipmentDetailsWithVariables {
  actionEquipmentTypeCode: string;
  actionEquipmentTypeShortDescription?: string;
  actionEquipmentTypeLongDescription?: string;
  actionEquipmentTypeActiveIndicator: boolean;
  address?: string;
  xCoordinate: string;
  yCoordinate: string;
  setBy?: string;
  setDate?: Date; 
  removedBy?: string;
  removedDate?: Date;
}

interface EquipmentItemProps {
  isInEditMode: boolean
  equipment: EquipmentDetailsDto
  indexItem: number
  handleDelete: (param: any) => void | null
  setIsInEditMode: (param: any) => void | null
  setEditEquipment: (param: any) => void | null
}

function processEquipmentDetails(details: EquipmentDetailsDto): EquipmentDetailsWithVariables {
  const result: EquipmentDetailsWithVariables = { ...details }; // Copy original details
  
  // Initialize variables
  let setBy: string | undefined;
  let setDate: Date | undefined;
  let removedBy: string | undefined;
  let removedDate: Date | undefined;

  // Iterate through actions
  details.actions?.forEach(action => {
    if (action.actionCode === "SETEQUIPMT") {
      setBy = action.actor;
      setDate = new Date(action.date);
    } else if (action.actionCode === "REMEQUIPMT") {
      removedBy = action.actor;
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
  isInEditMode,
  setIsInEditMode,
  setEditEquipment,
  handleDelete,
  indexItem
}) => {
  const isActive = !equipment.actionEquipmentTypeActiveIndicator
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (equipment: EquipmentDetailsDto) => {
    if(!isInEditMode) {
      //equipment.isEdit = true;
      setIsInEditMode(true);
      setEditEquipment(equipment);
    }
  }

  const processedEquipment = processEquipmentDetails(equipment);
  
  return (
    <>
      <DeleteConfirmModal
        show={showModal}
        title="Delete equipment?"
        content="All the data in this section will be lost."
        onHide={() => setShowModal(false)}
        onDelete={() => {
          handleDelete(indexItem);
          setShowModal(false);
        }}
        confirmText="Yes, delete equipment"
      />
      <div className="comp-outcome-report-complaint-assessment equipment-item">
        {isActive && <div className="status-bar"></div>}
        <div className="equipment-item-header">
          <div className="title">
            <h6>{equipment.actionEquipmentTypeShortDescription}</h6>
            {isActive && <div className="badge">Active</div>}
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
                  data-initials-sm={getAvatarInitials(processedEquipment.setBy ?? '')}
                  className="comp-pink-avatar-sm"
                >
                  <span
                    id="comp-details-assigned-officer-name-text-id"
                    className="comp-padding-left-xs"
                  >
                    
                    {equipment?.actions? equipment?.actions[0].actor : null}
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
        {!isActive && 
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
  