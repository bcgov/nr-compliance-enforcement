import { FC, useState, memo } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";

import "../../../../../../assets/sass/hwcr-equipment.scss"
import { Equipment } from "../../../../../types/outcomes/equipment";

export const HWCREquipment: FC = memo(() => {
  const [equipmentData, setEquipmentData] = useState<Array<Equipment>>([]);
  const [showEquipmentForm, setShowEquipmentForm] = useState<boolean>(false);
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [editEquipment, setEditEquipment] = useState<Equipment|null>(null);

  const handleDelete = (indexItem: number) => {
    equipmentData.splice(indexItem,1);
    setEquipmentData([...equipmentData]);
  }

  return (
    <div className="comp-outcome-report-block">
      <h6>Equipment</h6>
      {equipmentData && equipmentData.length > 0 ? equipmentData.map((equipment,indexItem)=>
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
            indexItem={indexItem}
            handleDelete={handleDelete}
          />
      ): null}
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
  