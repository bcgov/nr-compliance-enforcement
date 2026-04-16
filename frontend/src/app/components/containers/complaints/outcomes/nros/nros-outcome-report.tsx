import { FC, useEffect } from "react";
import { NrosDecision } from "./nros-decision/decision";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@hooks/hooks";
import { getCaseFile } from "@/app/store/reducers/complaint-outcome-thunks";
import { ComplaintParams } from "@components/containers/complaints/details/complaint-details-edit";
import { OutcomeAttachments } from "@components/containers/complaints/outcomes/outcome-attachments";
import { AuthorizationOutcome } from "./authorization-outcome/authorization-outcome";
import { Notes } from "@/app/components/containers/complaints/outcomes/notes";
import { useFormDirtyState } from "@/app/hooks/use-unsaved-changes-warning";

interface NROSOutcomeReportProps {
  onDirtyChange?: (index: number, isDirty: boolean) => void;
}

export const NrosOutcomeReport: FC<NROSOutcomeReportProps> = ({ onDirtyChange }) => {
  const { id = "" } = useParams<ComplaintParams>();
  const dispatch = useAppDispatch();

  const { handleChildDirtyChange } = useFormDirtyState(onDirtyChange);

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
      <AuthorizationOutcome onDirtyChange={(_, isDirty) => handleChildDirtyChange(0, isDirty)} />
      <NrosDecision onDirtyChange={(_, isDirty) => handleChildDirtyChange(1, isDirty)} />
      <Notes onDirtyChange={(_, isDirty) => handleChildDirtyChange(2, isDirty)} />
      <OutcomeAttachments onDirtyChange={(_, isDirty) => handleChildDirtyChange(3, isDirty)} />
    </section>
  );
};
