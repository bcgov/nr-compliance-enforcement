import { FC } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";

export const HWCRPreventionEducation: FC = () => {  
    return (
        <div className="comp-outcome-report-block">
            <h6>Prevention and education</h6>
            <div className="comp-outcome-report-button">
                <Button
                    id="outcome-report-add-actions"
                    title="Add actions"
                    variant="primary">
                    <span>Add actions</span>
                    <BsPlusCircle />
                </Button>
            </div>
        </div>
    );
};
  