import { FC, useState, memo, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";

import "../../../../../../assets/sass/hwcr-equipment.scss"
import { useParams } from "react-router-dom";
import { getCaseFile, selectEquipment } from "../../../../../store/reducers/cases";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { Equipment } from "../../../../../types/outcomes/equipment";
import { EquipmentDetailsDto } from "../../../../../types/app/case-files/equipment-details";

export const HWCREquipment: FC = memo(() => {
  const [showEquipmentForm, setShowEquipmentForm] = useState<boolean>(false);
  
  // used to indicate which equipment's guid is in edit mode (only one can be edited at a time
  const { id = "" } = useParams<{ id: string; complaintType: string }>();
  const dispatch = useAppDispatch();
  const equipmentList = useAppSelector(selectEquipment);
  

  useEffect(() => {
    if (id) {
      dispatch(getCaseFile(id));
    }
  }, [id, dispatch]);

  const [editingGuid, setEditingGuid] = useState<string>("");

  const handleEdit = (guid: string) => {
    setEditingGuid(guid);
  };

  const handleSave = () => {
    setShowEquipmentForm(false);
    setEditingGuid("");
  };

  const handleCancel = () => {
    setShowEquipmentForm(false);
    setEditingGuid("");
  };
  

  return (
    <div className="comp-outcome-report-block">
      <h6>Equipment</h6>
      {equipmentList && equipmentList.length > 0 ? equipmentList.map((equipment)=>
          editingGuid === equipment.equipmentGuid ?
          <EquipmentForm
            key={equipment.equipmentGuid}
            equipment={equipment}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          :
          <EquipmentItem
            key={equipment.equipmentGuid}
            equipment={equipment}
            onEdit={handleEdit}
          />
      ): null}

      {/* Add Equipment Form */}
      {showEquipmentForm ?
        <EquipmentForm
        onSave={handleSave}
        onCancel={handleCancel}
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
  