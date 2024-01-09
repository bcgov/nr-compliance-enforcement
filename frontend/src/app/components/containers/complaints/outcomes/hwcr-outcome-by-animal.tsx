import { FC } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";

export const HWCROutcomeByAnimal: FC = () => {  
    return (
        <div className="comp-outcome-report-block">
            <h6>Outcome by animal</h6>
            <div className="comp-outcome-report-button">
                <Button
                    id="outcome-report-add-outcome"
                    title="Add outcome"
                    variant="primary">
                    <span>Add outcome</span>
                    <BsPlusCircle />
                </Button>
            </div>
        </div>
    );
};
  