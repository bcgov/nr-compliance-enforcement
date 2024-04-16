import { FC, useState, memo, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";

import "../../../../../../assets/sass/hwcr-equipment.scss"
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { selectEquipment } from "../../../../../store/reducers/case-selectors";
import { getCaseFile } from "../../../../../store/reducers/case-thunks";

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
          editingGuid === equipment.id ?
          <EquipmentForm
            key={equipment.id}
            equipment={equipment}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          :
          <EquipmentItem
            key={equipment.id}
            equipment={equipment}
            onEdit={handleEdit}
            isEditDisabled={!!editingGuid && editingGuid !== equipment.id}
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
  