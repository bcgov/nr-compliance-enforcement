import { FC } from "react";
import { SupplementalNote } from "./supplemental-note";

export const GIROutcomeReport: FC = () => {
  return (
    <section className="comp-details-body comp-container comp-gir-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <SupplementalNote />
    </section>
  );
};
