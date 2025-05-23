import { useState, useEffect } from "react";
import { useAppSelector } from "@hooks/hooks";
import {
  selectAssessments,
  selectPreventions,
  selectEquipment,
  selectAnimalOutcomes,
  selectSubject,
  selectIsInEdit,
  selectIsReviewRequired,
  selectReviewComplete,
} from "@store/reducers/case-selectors";
import { EquipmentDetailsDto } from "@apptypes/app/case-files/equipment-details";
import { AnimalOutcomeSubject } from "@apptypes/state/cases-state";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { selectComplaint } from "@/app/store/reducers/complaints";
import { getComplaintType } from "@/app/common/methods";

type validationResults = {
  canCloseComplaint: boolean;
  canQuickCloseComplaint: boolean;
  scrollToErrors: () => void;
  validationDetails: {
    noEditSections: boolean;
    onlyAssessmentInEdit: boolean;
    assessmentCriteria: boolean;
    animalCapturedCriteria: boolean;
    preventionCriteria: boolean;
    equipmentCriteria: boolean;
    animalCriteria: boolean;
    fileReviewCriteria: boolean;
    referenceNumberCriteria: boolean;
  };
};

const useValidateComplaint = () => {
  // Selectors
  const assessments = useAppSelector(selectAssessments);
  const preventions = useAppSelector(selectPreventions);
  const equipment = useAppSelector(selectEquipment);
  const outcomes = useAppSelector(selectAnimalOutcomes);
  const subject = useAppSelector(selectSubject);
  const isInEdit = useAppSelector(selectIsInEdit);
  const isReviewRequired = useAppSelector(selectIsReviewRequired);
  const reviewComplete = useAppSelector(selectReviewComplete);
  const complaint = useAppSelector(selectComplaint);
  const complaintType = getComplaintType(complaint);

  // State
  const [validationResults, setValidationResults] = useState<validationResults>({
    canCloseComplaint: false,
    canQuickCloseComplaint: false,
    scrollToErrors: () => {},
    validationDetails: {
      noEditSections: false,
      onlyAssessmentInEdit: false,
      assessmentCriteria: false,
      animalCapturedCriteria: false,
      preventionCriteria: false,
      equipmentCriteria: false,
      animalCriteria: false,
      fileReviewCriteria: false,
      referenceNumberCriteria: false,
    },
  });

  // Effects
  useEffect(() => {
    const validateComplaint = () => {
      const noEditSections =
        !isInEdit.assessment &&
        !isInEdit.prevention &&
        !isInEdit.equipment &&
        !isInEdit.animal &&
        !isInEdit.notes &&
        !isInEdit.attachments &&
        !isInEdit.fileReview;

      const onlyAssessmentInEdit =
        isInEdit.assessment &&
        !isInEdit.prevention &&
        !isInEdit.equipment &&
        !isInEdit.animal &&
        !isInEdit.notes &&
        !isInEdit.attachments &&
        !isInEdit.fileReview;

      //check Assessment section must be filled out if complaint type is HWCR
      const assessmentCriteria = complaintType === COMPLAINT_TYPES.HWCR ? assessments.length !== 0 : true;

      //check Prevention must be filled out if action required is Yes
      const preventionCriteria = assessments.some((assessment) => assessment.action_required === "Yes")
        ? preventions.some((prevention) => Object.keys(prevention).length !== 0)
        : true;

      //check Equipment must have removed date, except for Signage and Trail
      const equipmentCriteria =
        equipment?.find(
          (item: EquipmentDetailsDto) =>
            item.wasAnimalCaptured === "U" &&
            item.typeCode !== "SIGNG" &&
            item.typeCode !== "TRCAM" &&
            item.typeCode !== "LLTHL" &&
            item.typeCode !== "K9UNT",
        ) === undefined;

      //check Animal has outcome, officer and date
      const animalCriteria =
        //@ts-ignore
        subject?.find((item: AnimalOutcomeSubject) => !item.outcome) === undefined;

      // Check Outcome by animal is filled out if animal was captured
      const animalCapturedCriteria =
        complaintType === COMPLAINT_TYPES.HWCR
          ? !(equipment?.find((item: EquipmentDetailsDto) => item.wasAnimalCaptured === "Y") && outcomes.length === 0)
          : true;

      //check if file review is required, review must be completed
      const fileReviewCriteria = (isReviewRequired && reviewComplete !== null) || !isReviewRequired;

      // check External file reference exists if required required
      const referenceNumberCriteria =
        complaintType === COMPLAINT_TYPES.ERS && complaint && ["COS", "PARKS"].includes(complaint.ownedBy)
          ? !!complaint.referenceNumber
          : true;

      const scrollToErrorSection = (
        assessmentCriteria: boolean,
        preventionCriteria: boolean,
        equipmentCriteria: boolean,
        animalCriteria: boolean,
        fileReviewCriteria: boolean,
        animalCapturedCriteria: boolean,
        referenceNumberCriteria: boolean,
      ) => {
        const { assessment, prevention, equipment, animal, note, attachments, fileReview } = isInEdit;
        if (!preventionCriteria || prevention) {
          document.getElementById("outcome-prevention-education")?.scrollIntoView({ block: "end" });
        } else if (!equipmentCriteria || equipment) {
          document.getElementById("outcome-equipment")?.scrollIntoView({ block: "end" });
        } else if (!animalCriteria || animal) {
          document.getElementById("outcome-animal")?.scrollIntoView({ block: "end" });
        } else if (!animalCapturedCriteria || animal) {
          document.getElementById("outcome-animal")?.scrollIntoView({ block: "end" });
        } else if (note) {
          document.getElementById("outcome-note")?.scrollIntoView({ block: "end" });
        } else if (attachments) {
          document.getElementById("outcome-attachments")?.scrollIntoView({ block: "end" });
        } else if (!fileReviewCriteria || fileReview) {
          document.getElementById("outcome-file-review")?.scrollIntoView({ block: "end" });
        } else if (!assessmentCriteria || assessment) {
          document.getElementById("outcome-assessment")?.scrollIntoView({ block: "end" });
        } else if (!referenceNumberCriteria || complaint?.referenceNumber) {
          document.getElementById("external-file-reference")?.scrollIntoView({ block: "end" });
        }
      };

      const scrollToErrors = () => {
        scrollToErrorSection(
          assessmentCriteria,
          preventionCriteria,
          equipmentCriteria,
          animalCriteria,
          fileReviewCriteria,
          animalCapturedCriteria,
          referenceNumberCriteria,
        );
      };

      setValidationResults({
        canCloseComplaint:
          noEditSections &&
          assessmentCriteria &&
          equipmentCriteria &&
          animalCriteria &&
          animalCapturedCriteria &&
          fileReviewCriteria &&
          referenceNumberCriteria,
        canQuickCloseComplaint:
          (noEditSections || onlyAssessmentInEdit) &&
          equipmentCriteria &&
          animalCriteria &&
          animalCapturedCriteria &&
          fileReviewCriteria,
        scrollToErrors,
        validationDetails: {
          noEditSections: noEditSections,
          onlyAssessmentInEdit: onlyAssessmentInEdit,
          assessmentCriteria: assessmentCriteria,
          animalCapturedCriteria: animalCapturedCriteria,
          preventionCriteria: preventionCriteria,
          equipmentCriteria: equipmentCriteria,
          animalCriteria: animalCriteria,
          fileReviewCriteria: fileReviewCriteria,
          referenceNumberCriteria: referenceNumberCriteria,
        },
      });
    };

    validateComplaint();
  }, [
    assessments,
    equipment,
    isInEdit,
    isReviewRequired,
    preventions,
    reviewComplete,
    subject,
    complaintType,
    outcomes,
    complaint,
  ]);

  return validationResults;
};

export default useValidateComplaint;
