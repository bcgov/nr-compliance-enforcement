import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { selectIsInEdit, selectAssessments } from "@store/reducers/case-selectors";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectComplaintViewMode, selectComplaint } from "@/app/store/reducers/complaints";
import { HWCRAssessment } from "./hwcr-assessment";

export const HWCRAssessments: FC = () => {
  const isInEdit = useAppSelector(selectIsInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const assessments = useAppSelector(selectAssessments);
  const complaint = useAppSelector(selectComplaint);
  const [status, setStatus] = useState("CLOSED");

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
    }
  }, [complaint]);

  const [showAddAssessment, setShowAddAssessment] = useState(false);

  useEffect(() => {
    if (assessments?.length === 0) {
      setShowAddAssessment(true);
    } else if (!isInEdit.assessment) {
      setShowAddAssessment(isInEdit.assessment);
    }
  }, [isInEdit.assessment, assessments]);

  const hasExistingDuplicate = assessments?.some(
    (assessment: any) => assessment.action_required === "No" && assessment.justification?.value === "DUPLICATE",
  );
  const allowDuplicate = assessments?.length === 0 && !hasExistingDuplicate;

  return (
    <section
      id="outcome-assessments"
      className="comp-details-section mb-4"
    >
      <div className="comp-details-section-header">
        <h3>Complaint assessments</h3>
      </div>
      {assessments?.map((assessment: any) => (
        <>
          <HWCRAssessment
            key={assessment.id}
            assessment={assessment}
            allowDuplicate={
              assessment.justification?.value === "DUPLICATE" || assessments.length === 1 ? true : allowDuplicate
            } // Allow saving as duplicate if it is already a duplicate or if it is the only assessment
            allowCancel={assessments?.length !== 0}
          />
          <br />
        </>
      ))}
      {showAddAssessment && <HWCRAssessment allowDuplicate={allowDuplicate} />}
      {!isInEdit.assessment && !hasExistingDuplicate && !showAddAssessment && (
        <Button
          variant="primary"
          id="outcome-report-add-assessment"
          title="Add additional assessment"
          onClick={(e) => setShowAddAssessment(true)}
          disabled={isReadOnly ?? status === "CLOSED"}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Add assessment</span>
        </Button>
      )}
    </section>
  );
};
