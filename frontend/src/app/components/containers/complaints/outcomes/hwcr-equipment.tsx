import { FC } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";

export const HWCREquipment: FC = () => {  
    return (
        <div className="comp-outcome-report-block">
            <h6>Equipment</h6>
            <div className="comp-outcome-report-button">
                <Button
                    id="outcome-report-add-equipment"
                    title="Add equipment"
                    variant="primary">
                    <span>Add equipment</span>
                    <BsPlusCircle />
                </Button>
            </div>
        </div>
    );
};
  