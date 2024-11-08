import { useState, useEffect } from "react";
import { useAppSelector } from "@hooks/hooks";
import {
  selectAssessment,
  selectPrevention,
  selectEquipment,
  selectSubject,
  selectIsInEdit,
  selectIsReviewRequired,
  selectReviewComplete,
} from "@store/reducers/case-selectors";
import { EquipmentDetailsDto } from "@apptypes/app/case-files/equipment-details";

type validationResults = {
  noEditSections: boolean;
  assessmentCriteria: boolean;
  preventionCriteria: boolean;
  equipmentCriteria: boolean;
  animalCriteria: boolean;
  fileReviewCriteria: boolean;
};

const useValidateComplaint = () => {
  // Selectors
  const assessment = useAppSelector(selectAssessment);
  const prevention = useAppSelector(selectPrevention);
  const equipment = useAppSelector(selectEquipment);
  const subject = useAppSelector(selectSubject);
  const isInEdit = useAppSelector(selectIsInEdit);
  const isReviewRequired = useAppSelector(selectIsReviewRequired);
  const reviewComplete = useAppSelector(selectReviewComplete);

  // State
  const [validationResults, setValidationResults] = useState<validationResults>({
    noEditSections: false,
    assessmentCriteria: false,
    preventionCriteria: false,
    equipmentCriteria: false,
    animalCriteria: false,
    fileReviewCriteria: false,
  });

  // Effects
  useEffect(() => {
    const validateComplaint = () => {
      const noEditSections =
        !isInEdit.assessment &&
        !isInEdit.prevention &&
        !isInEdit.equipment &&
        !isInEdit.animal &&
        !isInEdit.note &&
        !isInEdit.attachments &&
        !isInEdit.fileReview;

      //check Assessment section must be filled out
      const assessmentCriteria = Object.keys(assessment).length !== 0;

      //check Prevention must be filled out if action required is Yes
      const preventionCriteria = assessment.action_required === "Yes" ? Object.keys(prevention).length !== 0 : true;

      //check Equipment must have removed date, except for Signage and Trail
      const equipmentCriteria =
        equipment?.find(
          (item: EquipmentDetailsDto) =>
            item.wasAnimalCaptured === "U" && item.typeCode !== "SIGNG" && item.typeCode !== "TRCAM",
        ) === undefined;

      //check Animal has outcome, officer and date
      const animalCriteria =
        //@ts-ignore
        subject?.find((item: AnimalOutcomeSubject) => !item.outcome) === undefined;
      //check if file review is required, review must be completed
      const fileReviewCriteria = (isReviewRequired && reviewComplete !== null) || !isReviewRequired;

      setValidationResults({
        noEditSections: noEditSections,
        assessmentCriteria: assessmentCriteria,
        preventionCriteria: preventionCriteria,
        equipmentCriteria: equipmentCriteria,
        animalCriteria: animalCriteria,
        fileReviewCriteria: fileReviewCriteria,
      });
    };

    validateComplaint();
  }, [assessment, equipment, isInEdit, isReviewRequired, prevention, reviewComplete, subject]);

  return validationResults;
};

export default useValidateComplaint;
