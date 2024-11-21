import { FC, useEffect } from "react";
import { CeebDecision } from "./ceeb-decision/decision";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@hooks/hooks";
import { getCaseFile } from "@store/reducers/case-thunks";
import { ComplaintParams } from "@components/containers/complaints/details/complaint-details-edit";
import { OutcomeAttachments } from "@components/containers/complaints/outcomes/outcome-attachments";
import { AuthoizationOutcome } from "./authorization-outcome/authorization-outcome";
import { SupplementalNote } from "@components/containers/complaints/outcomes/supplemental-note";

export const CeebOutcomeReport: FC = () => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCaseFile(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section className="comp-details-body comp-container comp-hwcr-outcome-report">
      <hr className="comp-details-body-spacer"></hr>
      <div className="comp-details-section-header">
        <h2>Outcome report</h2>
      </div>
      <AuthoizationOutcome />
      <CeebDecision />
      <SupplementalNote />
      <OutcomeAttachments showAddButton={true} />
    </section>
  );
};
