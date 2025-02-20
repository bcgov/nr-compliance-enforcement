import { FC } from "react";
import { Notes } from "./notes";

export const GIROutcomeReport: FC = () => {
  return (
    <section className="comp-details-body comp-container comp-gir-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <Notes />
    </section>
  );
};
