import { FC } from "react";
import { useAppSelector } from "@hooks/hooks";
import { selectComplaintSuspectWitnessDetails } from "@store/reducers/complaints";
import { ComplaintSuspectWitness } from "@apptypes/complaints/details/complaint-suspect-witness-details";

export const SuspectWitnessDetails: FC = () => {
  const { details } = useAppSelector(selectComplaintSuspectWitnessDetails) as ComplaintSuspectWitness;

  return (
    <section className="comp-details-section">
      <h3>Subject of complaint / witness details</h3>
      <div className="card">
        <div className="card-body">
          <dl>
            <div>
              <dt>Description</dt>
              <dd>
                <pre id="comp-details-witness-details">{details}</pre>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
