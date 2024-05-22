import { FC, useState, memo } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";
import { useAppSelector } from "../../../../../hooks/hooks";
import { selectEquipment } from "../../../../../store/reducers/case-selectors";
import { selectComplaintAssignedBy } from "../../../../../store/reducers/complaints";
import "../../../../../../assets/sass/hwcr-equipment.scss";

export const HWCREquipment: FC = memo(() => {
  const [showEquipmentForm, setShowEquipmentForm] = useState<boolean>(false);
  const assigned = useAppSelector(selectComplaintAssignedBy);
  // used to indicate which equipment's guid is in edit mode (only one can be edited at a time
  const equipmentList = useAppSelector(selectEquipment);

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
      {equipmentList && equipmentList.length > 0
        ? equipmentList.map((equipment) =>
            editingGuid === equipment.id ? (
              <EquipmentForm
                key={equipment.id}
                equipment={equipment}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <EquipmentItem
                key={equipment.id}
                equipment={equipment}
                onEdit={handleEdit}
                isEditDisabled={!!editingGuid && editingGuid !== equipment.id}
              />
            ),
          )
        : null}

      {/* Add Equipment Form */}
      {showEquipmentForm ? (
        <EquipmentForm
          onSave={handleSave}
          onCancel={handleCancel}
          assignedOfficer={assigned}
        />
      ) : (
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
      )}
    </div>
  );
});
