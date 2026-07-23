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
  selectCeebAuthorization,
} from "@/app/store/reducers/complaint-outcome-selectors";
import { EquipmentDetailsDto } from "@/app/types/app/complaint-outcomes/equipment-details";
import { AnimalOutcomeSubject } from "@/app/types/state/complaint-outcomes-state";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { selectComplaint } from "@/app/store/reducers/complaints";
import { getComplaintType } from "@/app/common/methods";
import { Roles } from "@apptypes/app/roles";
import UserService from "@service/user-service";
import { selectComplaintAssessmentApplies } from "@/app/access/module-access";

type validationResults = {
  canCloseComplaint: boolean;
  canQuickCloseComplaint: boolean;
  canStartInvestigation: boolean;
  canAddToCase: boolean;
  validationMissing: string[];
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

const getCaseValidationMessages = (
  requireValidation: boolean,
  isAssigned: boolean,
  hasAssessment: boolean,
  hasAuthorization: boolean,
): string[] => {
  if (!requireValidation) return [];
  const messages: string[] = [];
  if (!isAssigned) messages.push("assign the complaint");
  if (!hasAssessment) messages.push("complete the complaint assessment");
  if (!hasAuthorization) messages.push("populate the authorization section");
  return messages;
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
  const authorization = useAppSelector(selectCeebAuthorization);
  const complaintType = getComplaintType(complaint);
  // Feature-flagged assessments for COS/PARKS ERS + GIR complaints
  const assessmentApplies = useAppSelector(selectComplaintAssessmentApplies(complaintType, complaint?.ownedBy));

  // State
  const [validationResults, setValidationResults] = useState<validationResults>({
    canCloseComplaint: false,
    canQuickCloseComplaint: false,
    canStartInvestigation: true,
    canAddToCase: true,
    validationMissing: [],
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

      //check Assessment section must be filled out for HWCR, and for ERS/GIR when the assessment feature applies
      const assessmentCriteria =
        complaintType === COMPLAINT_TYPES.HWCR || assessmentApplies ? assessments.length !== 0 : true;

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

      // check External file reference exists if required
      const hasCaseAccessRole = UserService.hasRole(Roles.CASE_ACCESS);
      const referenceNumberCriteria =
        complaintType === COMPLAINT_TYPES.ERS &&
        complaint &&
        ["COS", "PARKS"].includes(complaint.ownedBy) &&
        !hasCaseAccessRole
          ? !!complaint.referenceNumber ||
            (assessmentApplies && assessments.some((assessment) => assessment.action_required === "No"))
          : true;

      // check validation for investigation/case actions (for CEEB/NROS/MINES)
      const isAssigned = (complaint?.delegates ?? []).some((d) => d.type === "ASSIGNEE" && d.isActive);
      const hasAssessment = assessments.length > 0;
      const hasAuthorization = !!authorization?.id;
      const requireValidation =
        complaintType === COMPLAINT_TYPES.ERS && ["EPO", "NROS", "MINES"].includes(complaint?.ownedBy ?? "");
      const validationMissing = getCaseValidationMessages(
        requireValidation,
        isAssigned,
        hasAssessment,
        hasAuthorization,
      );
      const canCreateCase = validationMissing.length === 0;

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
        if (requireValidation && !hasAuthorization) {
          document.getElementById("ceeb-authorization")?.scrollIntoView({ block: "end" });
          return;
        }
        if (requireValidation && !hasAssessment) {
          document.getElementById("outcome-assessment")?.scrollIntoView({ block: "end" });
          return;
        }
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
        canStartInvestigation: canCreateCase,
        canAddToCase: canCreateCase,
        validationMissing: validationMissing,
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
    authorization,
    equipment,
    isInEdit,
    isReviewRequired,
    preventions,
    reviewComplete,
    subject,
    complaintType,
    outcomes,
    complaint,
    assessmentApplies,
  ]);

  return validationResults;
};

export default useValidateComplaint;
