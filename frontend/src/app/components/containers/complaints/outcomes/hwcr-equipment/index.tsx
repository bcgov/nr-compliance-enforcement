import { FC, useState, memo, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";

import "../../../../../../assets/sass/hwcr-equipment.scss"
import { Equipment } from "../../../../../types/outcomes/equipment";
import { useParams } from "react-router-dom";
import { getCaseFile, selectEquipment } from "../../../../../store/reducers/cases";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";

export const HWCREquipment: FC = memo(() => {
  const [showEquipmentForm, setShowEquipmentForm] = useState<boolean>(false);
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [editEquipment, setEditEquipment] = useState<Equipment|null>(null);
  const { id = "" } = useParams<{ id: string; complaintType: string }>();
  const dispatch = useAppDispatch();
  const equipmentList = useAppSelector(selectEquipment);
  

  useEffect(() => {
    if (id) {
      dispatch(getCaseFile(id));
    }
  }, [id, dispatch]);

  const handleDelete = (indexItem: number) => {

  }  

  return (
    <div className="comp-outcome-report-block">
      <h6>Equipment</h6>
      {equipmentList && equipmentList.length > 0 ? equipmentList.map((equipment,indexItem)=>
          isInEditMode ?
          <EquipmentForm
            key={indexItem}
            isInEditMode={isInEditMode}
            setIsInEditMode={setIsInEditMode}
            equipmentItemData={editEquipment}
            indexItem={indexItem}
            setEquipmentItemData={setEditEquipment}
          />
          :
          <EquipmentItem
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
  