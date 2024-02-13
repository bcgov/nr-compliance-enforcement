import { FC, useState, memo, useEffect } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";
import { EquipmentForm } from "./equipment-form";
import { EquipmentItem } from "./equipment-item";
import axios from "axios";

import Option from "../../../../../types/app/option";

import "../../../../../../assets/sass/hwcr-equipment.scss"

export interface Equipment {
  id: string | undefined;
  type: Option | undefined;
  address: string | undefined;
  xCoordinate: string;
  yCoordinate: string;
  officerSet: Option | undefined;
  dateSet: Date | undefined;
  officerRemoved?: Option;
  dateRemoved?: Date;
  isEdit?: boolean;
}

export const HWCREquipment: FC = memo(() => {
  const [equipmentData, setEquipmentData] = useState<Array<Equipment>>([]);
  const [showEquipmentForm, setShowEquipmentForm] = useState<boolean>(false);
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [editEquipment, setEditEquipment] = useState<Equipment|null>(null);
  const [equipmentTypeList, setEquipmentTypeList] = useState();

  useEffect(() => {
    axios({
      url: 'http://localhost:3003/graphql',
      method: 'post',
      data: {
        query: `
          {
            equipmentCodes {
              equipment_code
              short_description
            }
          }
        `
      }
    }).then((result) => {
      console.log(result.data)
      setEquipmentTypeList(result.data.data)
    });
  }, []);

  console.log(equipmentTypeList);

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
  