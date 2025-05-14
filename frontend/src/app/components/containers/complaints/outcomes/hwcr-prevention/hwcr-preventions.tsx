import { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { selectIsInEdit, selectPreventions } from "@store/reducers/case-selectors";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectComplaintViewMode, selectComplaint } from "@/app/store/reducers/complaints";
import { HWCRPrevention } from "./hwcr-prevention";

export const HWCRPreventions: FC = () => {
  const isInEdit = useAppSelector(selectIsInEdit);
  const isReadOnly = useAppSelector(selectComplaintViewMode);
  const preventions = useAppSelector(selectPreventions);
  const complaint = useAppSelector(selectComplaint);
  const [status, setStatus] = useState("CLOSED");

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status);
    }
  }, [complaint]);

  const [showAddPrevention, setShowAddPrevention] = useState(false);

  useEffect(() => {
    if (!isInEdit.prevention) {
      setShowAddPrevention(isInEdit.prevention);
    }
  }, [isInEdit.prevention, preventions]);

  return (
    <section
      id="outcome-preventions"
      className="comp-details-section mb-4"
    >
      <div className="comp-details-section-header">
        <h3>Prevention and education</h3>
      </div>
      {preventions?.map((prevention: any) => (
        <>
          <HWCRPrevention
            key={prevention.id}
            prevention={prevention}
          />
          <br />
        </>
      ))}
      {showAddPrevention && <HWCRPrevention />}
      {!isInEdit.prevention && !showAddPrevention && (
        <Button
          variant="primary"
          id="outcome-report-add-prevention"
          title="Add prevention and education"
          onClick={(e) => setShowAddPrevention(true)}
          disabled={isReadOnly ?? status === "CLOSED"}
        >
          <i className="bi bi-plus-circle"></i>
          <span>Add actions</span>
        </Button>
      )}
    </section>
  );
};
