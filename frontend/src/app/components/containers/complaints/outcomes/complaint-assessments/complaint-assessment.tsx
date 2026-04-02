import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { ComplaintAssessmentItem } from "./complaint-assessment-item";
import { ComplaintAssessmentForm } from "./complaint-assessment-form";
import { Assessment } from "@/app/types/outcomes/assessment";
import { useParams } from "react-router-dom";

type props = {
  assessment?: Assessment;
  allowDuplicate?: boolean;
  allowCancel?: boolean;
  onDirtyChange?: (index: number, isDirty: boolean) => void;
};

export const ComplaintAssessment: FC<props> = ({
  assessment,
  allowDuplicate = false,
  allowCancel = true,
  onDirtyChange,
}) => {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();

  const [showInput, setShowInput] = useState(!assessment);

  useEffect(() => {
    dispatch(setIsInEdit({ assessment: showInput }));
    return () => {
      dispatch(setIsInEdit({ assessment: false }));
    };
  }, [dispatch, showInput]);

  return (
    <>
      {!assessment || showInput ? (
        <ComplaintAssessmentForm
          id={id}
          assessment={assessment}
          handleCancel={() => {
            allowCancel && setShowInput(false);
          }}
          handleSave={() => setShowInput(false)}
          allowDuplicate={allowDuplicate}
          onDirtyChange={onDirtyChange}
        />
      ) : (
        assessment && (
          <ComplaintAssessmentItem
            assessment={assessment}
            handleEdit={() => setShowInput(true)}
          />
        )
      )}
    </>
  );
};
