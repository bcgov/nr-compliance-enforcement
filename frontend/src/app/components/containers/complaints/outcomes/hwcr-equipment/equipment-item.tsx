import { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { BsPencil } from "react-icons/bs";
import { formatDate, getAvatarInitials } from "../../../../../common/methods";

import { Equipment } from "./index";

interface EquipmentItem {
  isInEditMode: boolean
  equipment: Equipment
  setIsInEditMode: (param: any) => void | null
  setEditEquipment: (param: any) => void | null
}

export const EquipmentItem: FC<EquipmentItem> = ({ 
  equipment,
  isInEditMode,
  setIsInEditMode,
  setEditEquipment
}) => {
  const isActive = !equipment.dateRemoved

  const handleEdit = (equipment: Equipment) => {
    if(!isInEditMode) {
      equipment.isEdit = true;
      setIsInEditMode(true);
      setEditEquipment(equipment);
    }
  }
  return (
    <div className="comp-outcome-report-complaint-assessment equipment-item">
      {isActive && <div className="status-bar"></div>}
      <div className="equipment-item-header">
        <div className="title">
          <h6>{equipment.type?.label}</h6>
          {isActive && <div>Active</div>}
        </div>
        <button
          className="button-text equipment-item-edit" 
          onClick={() => handleEdit(equipment)}
        >
          <span>Edit</span>
          <BsPencil />
        </button>
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
                data-initials-sm={getAvatarInitials(equipment.officerSet?.label ?? '')}
                className="comp-pink-avatar-sm"
              >
                <span
                  id="comp-details-assigned-officer-name-text-id"
                  className="comp-padding-left-xs"
                >
                  {equipment.officerSet?.label}
                </span>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="equipment-item-content">
            <div className="label">Set date</div>
            <div className="value" id="">
              {formatDate(equipment.dateSet?.toString())}
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
                  data-initials-sm={getAvatarInitials(equipment.officerRemoved?.label ?? '')}
                  className="comp-pink-avatar-sm"
                >
                  <span
                    id="comp-details-assigned-officer-name-text-id"
                    className="comp-padding-left-xs"
                  >
                    {equipment.officerRemoved?.label}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="equipment-item-content">
              <div className="label">Removed date</div>
              <div className="value" id="">
                {formatDate(equipment.dateRemoved?.toString())}
              </div>
            </div>
          </Col>
        </Row>
      }
    </div>
  );
}
  