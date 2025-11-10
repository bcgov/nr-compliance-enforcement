import { FC } from "react";
import { Complaint } from "@/app/types/app/complaints/complaint";
import { ActivityColumn } from "./activity-column";
import { ComplaintCard } from "./complaint-card";
import { openModal } from "@/app/store/reducers/app";
import { ADD_COMPLAINT_TO_CASE } from "@/app/types/modal/modal-types";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useParams } from "react-router-dom";

interface ComplaintColumnProps {
  complaints?: Complaint[];
  isLoading?: boolean;
  caseName?: string;
  caseIdentifier: string;
}

export const ComplaintColumn: FC<ComplaintColumnProps> = ({
  complaints,
  isLoading = false,
  caseName,
  caseIdentifier,
}) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id?: string }>();

  const handleAddComplaint = () => {
    document.body.click();
    dispatch(
      openModal({
        modalSize: "lg",
        modalType: ADD_COMPLAINT_TO_CASE,
        data: {
          title: "Add complaint to case",
          description: "",
          caseId: id,
          addedComplaints: complaints,
        },
      }),
    );
  };

  return (
    <ActivityColumn
      title="Complaints"
      items={complaints}
      ItemComponent={ComplaintCard}
      addButtonText="Add complaint"
      isLoading={isLoading}
      loadingText="Loading complaints..."
      onAddClick={handleAddComplaint}
      caseName={caseName}
      caseIdentifier={caseIdentifier}
    />
  );
};
