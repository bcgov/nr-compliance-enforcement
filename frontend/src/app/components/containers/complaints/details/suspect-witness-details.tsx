import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintSuspectWitnessDetails } from "../../../../store/reducers/complaints";
import { ComplaintSuspectWitness } from "../../../../types/complaints/details/complaint-suspect-witness-details";

export const SuspectWitnessDetails: FC = () => {
  const { details } = useAppSelector(
    selectComplaintSuspectWitnessDetails,
  ) as ComplaintSuspectWitness;

  return (
    <div className="comp-complaint-details-block">
      <h6>Subject of Complaint / Witness Details</h6>
      <div className="comp-complaint-call-information">
        <div>
          <div className="comp-details-content-label">
            Description (vehicle, license plate, features, clothing, weapons,
            name, address)
          </div>
          <p id="comp-details-witness-details">{details}</p>
        </div>
      </div>
    </div>
  );
};
