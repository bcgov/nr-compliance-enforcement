import { FC } from "react";
import { Button } from "react-bootstrap";
import { BsPlusCircle } from "react-icons/bs";

export const HWCRWildlifeInformation: FC = () => {  
    return (
        <div className="comp-outcome-report-block">
            <h6>Wildlife information</h6>
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
  