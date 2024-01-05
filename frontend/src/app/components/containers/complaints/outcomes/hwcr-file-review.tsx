import { FC } from "react";

export const HWCRFileReview: FC = () => {  
    return (
        <div className="comp-outcome-report-block">
            <h6>File review</h6>
            <div className="comp-outcome-report-file-review">
                <div className="form-check">
                    <input className="form-check-input" id="review-required" type="checkbox" />
                    <label className="form-check-label" htmlFor="review-required">Review required</label>
                </div>
            </div>
        </div>
    );
};
  