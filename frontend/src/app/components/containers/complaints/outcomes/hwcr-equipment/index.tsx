import { FC, useState, memo } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";

import { IEquipment } from "./types";

import "./style.scss"

export const HWCREquipment: FC = memo(() => {
  const [equipmentData, setEquipmentData] = useState<Array<IEquipment>>([]);
  const [showEquipmentForm, setShowEquipmentForm] = useState<boolean>(false);
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [editEquipment, setEditEquipment] = useState<IEquipment|null>(null);

  return (
    <div className="comp-outcome-report-block">
      <h6>Equipment</h6>
      {equipmentData.map((equipment,indexItem)=>
        isInEditMode && equipment.isEdit? 
          <EquipmentForm
            key={equipment.id}
            isInEditMode={isInEditMode}
            setIsInEditMode={setIsInEditMode}
            equipmentItemData={editEquipment}
            indexItem={indexItem}
            setEquipmentItemData={setEditEquipment}
            equipmentData={equipmentData}
            setEquipmentData={setEquipmentData}
          />
          :
          <EquipmentItem
            key={equipment.id}
            isInEditMode={isInEditMode} 
            equipment={equipment}
            setIsInEditMode={setIsInEditMode}
            setEditEquipment={setEditEquipment}
          />
      )}
      {/* Add Equipment Form */}
      {showEquipmentForm ?
        <EquipmentForm
          isInEditMode={false}
          setIsInEditMode={setIsInEditMode}
          equipmentData={equipmentData}
          setEquipmentData={setEquipmentData}
          setShowEquipmentForm={setShowEquipmentForm}
        />
        :
        <div className="comp-outcome-report-button">
          <Button
            id="outcome-report-add-equipment"
            title="Add equipment"
            variant="primary"
            onClick={() => setShowEquipmentForm(true)}
          >
              <span>Add equipment</span>
            <BsPlusCircle />
          </Button>
        </div>
      }
    </div>
  );
});
  