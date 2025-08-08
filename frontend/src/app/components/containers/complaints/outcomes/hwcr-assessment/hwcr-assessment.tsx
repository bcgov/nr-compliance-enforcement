import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { setIsInEdit } from "@/app/store/reducers/complaint-outcomes";
import { HWCRAssessmentItem } from "./hwcr-assessment-item";
import { HWCRAssessmentForm } from "./hwcr-assessment-form";
import { Assessment } from "@/app/types/outcomes/assessment";
import { useParams } from "react-router-dom";

type props = {
  assessment?: Assessment;
  allowDuplicate?: boolean;
  allowCancel?: boolean;
};

export const HWCRAssessment: FC<props> = ({ assessment, allowDuplicate = false, allowCancel = true }) => {
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
        <HWCRAssessmentForm
          id={id}
          assessment={assessment}
          handleCancel={() => {
            allowCancel && setShowInput(false);
          }}
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
