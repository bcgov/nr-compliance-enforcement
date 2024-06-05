import { FC } from "react";
import { useAppSelector } from "../../../../hooks/hooks";
import { selectComplaintSuspectWitnessDetails } from "../../../../store/reducers/complaints";
import { ComplaintSuspectWitness } from "../../../../types/complaints/details/complaint-suspect-witness-details";

export const SuspectWitnessDetails: FC = () => {
  const { details } = useAppSelector(selectComplaintSuspectWitnessDetails) as ComplaintSuspectWitness;

  return (
    <section className="comp-details-section">
      <h3>Subject of Complaint / Witness Details</h3>
      <dl>
        <div>
          <dt>Description</dt>
          <dd>
            <pre>{details}</pre>
          </dd>
        </div>
      </dl>
    </section>
  );
};
