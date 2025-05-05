import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { setIsInEdit } from "@store/reducers/cases";
import { HWCRAssessmentItem } from "./hwcr-assessment-item";
import { HWCRAssessmentForm } from "./hwcr-assessment-form";
import { Assessment } from "@/app/types/outcomes/assessment";

type props = {
  assessment?: Assessment;
  allowDuplicate?: boolean;
};

export const HWCRAssessment: FC<props> = ({ assessment, allowDuplicate = false }) => {
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
      {showInput ? (
        <HWCRAssessmentForm
          assessment={assessment}
          handleCancel={() => setShowInput(false)}
          handleSave={() => setShowInput(false)}
          allowDuplicate={allowDuplicate}
        />
      ) : (
        assessment && (
          <HWCRAssessmentItem
            assessment={assessment}
            handleEdit={() => setShowInput(true)}
          />
        )
      )}
    </>
  );
};
