import { Action, ThunkAction } from "@reduxjs/toolkit";
import config from "@/config";
import { deleteMethod, generateApiParameters, get, patch, post } from "@common/api";
import { AppThunk, RootState } from "@store/store";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { CaseFileDto } from "@apptypes/app/case-files/case-file";
import {
  clearAssessment,
  clearPrevention,
  setAssessment,
  setCaseFile,
  setCaseId,
  setIsReviewedRequired,
  setPrevention,
  setReviewComplete,
} from "./cases";
import { Assessment } from "@apptypes/outcomes/assessment";
import { Officer } from "@apptypes/person/person";
import { AssessmentActionDto } from "@apptypes/app/case-files/assessment-action";
import { UpdateAssessmentInput } from "@apptypes/app/case-files/update-assessment-input";
import { CreateAssessmentInput } from "@apptypes/app/case-files/create-assessment-input";
import { Prevention } from "@apptypes/outcomes/prevention";
import { PreventionActionDto } from "@apptypes/app/case-files/prevention/prevention-action";
import { UpdatePreventionInput } from "@apptypes/app/case-files/prevention/update-prevention-input";
import { CreatePreventionInput } from "@apptypes/app/case-files/prevention/create-prevention-input";
import { CreateSupplementalNotesInput } from "@apptypes/app/case-files/supplemental-notes/create-supplemental-notes-input";
import { UUID } from "crypto";
import { UpdateSupplementalNotesInput } from "@apptypes/app/case-files/supplemental-notes/update-supplemental-notes-input";
import { ReviewInput } from "@apptypes/app/case-files/review-input";
import { ReviewCompleteAction } from "@apptypes/app/case-files/review-complete-action";
import { DeleteSupplementalNoteInput } from "@apptypes/app/case-files/supplemental-notes/delete-supplemental-notes-input";
import { EquipmentDetailsDto } from "@apptypes/app/case-files/equipment-details";
import { CreateEquipmentInput } from "@apptypes/app/case-files/equipment-inputs/create-equipment-input";
import { UpdateEquipmentInput } from "@apptypes/app/case-files/equipment-inputs/update-equipment-input";
import { getComplaintStatusById, clearComplaint } from "./complaints";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { AnimalOutcome } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { CreateAnimalOutcomeInput } from "@apptypes/app/case-files/animal-outcome/create-animal-outcome-input";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { from } from "linq-to-typescript";
import { EarTagInput } from "@apptypes/app/case-files/animal-outcome/ear-tag-input";
import { DrugUsedInputV3 } from "@apptypes/app/case-files/animal-outcome/drug-used-input";
import { AnimalOutcomeActionInput } from "@apptypes/app/case-files/animal-outcome/animal-outcome-action-input";
import { DeleteAnimalOutcomeInput } from "@apptypes/app/case-files/animal-outcome/delete-animal-outcome-input";
import { UpdateAnimalOutcomeInput } from "@apptypes/app/case-files/animal-outcome/update-animal-outcome-input";
import { Decision } from "@apptypes/app/case-files/ceeb/decision/decision";
import { CreateDecisionInput } from "@apptypes/app/case-files/ceeb/decision/create-decision-input";
import { UpdateDecisionInput } from "@apptypes/app/case-files/ceeb/decision/update-decsion-input";
import { PermitSite } from "@apptypes/app/case-files/ceeb/authorization-outcome/permit-site";
import { CreateAuthorizationOutcomeInput } from "@apptypes/app/case-files/ceeb/authorization-outcome/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "@apptypes/app/case-files/ceeb/authorization-outcome/update-authorization-outcome-input";
import { getUserAgency } from "@service/user-service";
import { DeleteAuthorizationOutcomeInput } from "@apptypes/app/case-files/ceeb/authorization-outcome/delete-authorization-outcome-input";

//-- general thunks
export const findCase =
  (complaintIdentifier?: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/${complaintIdentifier}`);
    const response = await get<CaseFileDto>(dispatch, parameters);
    return response?.caseIdentifier;
  };

export const getCaseFile =
  (complaintIdentifier?: string): AppThunk =>
  async (dispatch) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/${complaintIdentifier}`);
    const response = await get<CaseFileDto>(dispatch, parameters);

    dispatch(setCaseFile(response));
  };

//-- assessment thunks
export const getAssessment =
  (complaintIdentifier?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
    } = getState();
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/${complaintIdentifier}`);
    return await get<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedAssessmentData = await parseAssessmentResponse(res, officers);
      dispatch(setCaseId(res.caseIdentifier));
      dispatch(setAssessment({ assessment: updatedAssessmentData }));
      dispatch(setIsReviewedRequired(res.isReviewRequired));
      dispatch(setReviewComplete(res.reviewComplete));
    });
  };

export const upsertAssessment =
  (complaintIdentifier: string, assessment: Assessment): AppThunk =>
  async (dispatch) => {
    if (!assessment) {
      return;
    }
    const caseIdentifier = await dispatch(findCase(complaintIdentifier));
    if (!caseIdentifier) {
      dispatch(addAssessment(complaintIdentifier, assessment));
    } else {
      dispatch(updateAssessment(complaintIdentifier, caseIdentifier, assessment));
    }
  };

const addAssessment =
  (complaintIdentifier: string, assessment: Assessment): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType, "assessment-cat1-type": assessmentCat1Type },
      officers: { officers },
      app: { profile },
      cases: { caseId },
    } = getState();
    let createAssessmentInput = {
      createAssessmentInput: {
        leadIdentifier: complaintIdentifier,
        createUserId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        assessmentDetails: {
          actionNotRequired: assessment.action_required === "No",
          actionCloseComplaint: assessment.close_complaint,
          actions: assessment.assessment_type
            ? assessment.assessment_type.map((item) => {
                return {
                  date: assessment.date,
                  actor: assessment.officer?.value,
                  activeIndicator: true,
                  actionCode: item.value,
                };
              })
            : [],
          actionJustificationCode: assessment.justification?.value,
          actionLinkedComplaintIdentifier: assessment.linked_complaint?.value,
          contactedComplainant: assessment.contacted_complainant,
          attended: assessment.attended,
          locationType: assessment.location_type,
          conflictHistory: assessment.conflict_history,
          categoryLevel: assessment.category_level,
          cat1Actions: assessment.assessment_cat1_type
            ? assessment.assessment_cat1_type.map((item) => {
                return {
                  date: assessment.date,
                  actor: assessment.officer?.value,
                  activeIndicator: true,
                  actionCode: item.value,
                };
              })
            : [],
        },
      },
    } as CreateAssessmentInput;

    let {
      createAssessmentInput: {
        assessmentDetails: { actions, cat1Actions },
      },
    } = createAssessmentInput;
    for (let item of assessmentType.filter((record) => record.isActive)) {
      if (
        !actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.assessmentType)
      ) {
        actions.push({
          date: assessment.date,
          actor: assessment.officer?.value,
          activeIndicator: false,
          actionCode: item.assessmentType,
        } as AssessmentActionDto);
      }
    }
    for (let item of assessmentCat1Type.filter((record) => record.isActive)) {
      if (
        !cat1Actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.assessmentType)
      ) {
        cat1Actions.push({
          date: assessment.date,
          actor: assessment.officer?.value,
          activeIndicator: false,
          actionCode: item.assessmentType,
        } as AssessmentActionDto);
      }
    }

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/createAssessment`, createAssessmentInput);
    await post<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedAssessmentData = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessment({ assessment: updatedAssessmentData }));
        if (!caseId) dispatch(setCaseId(res.caseIdentifier));
        dispatch(clearComplaint());
        ToggleSuccess(`Assessment has been saved`);
      } else {
        dispatch(clearAssessment());
        ToggleError(`Unable to create assessment`);
      }
    });
  };

const updateAssessment =
  (complaintIdentifier: string, caseIdentifier: string, assessment: Assessment): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType, "assessment-cat1-type": assessmentCat1Type },
      officers: { officers },
      app: { profile },
    } = getState();

    let updateAssessmentInput = {
      updateAssessmentInput: {
        leadIdentifier: complaintIdentifier,
        caseIdentifier: caseIdentifier,
        updateUserId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        assessmentDetails: {
          actionNotRequired: assessment.action_required === "No",
          actionCloseComplaint: assessment.close_complaint,
          actionJustificationCode: assessment.justification?.value,
          actionLinkedComplaintIdentifier: assessment.linked_complaint?.value,
          actions: assessment.assessment_type
            ? assessment.assessment_type.map((item) => {
                return {
                  actor: assessment.officer?.value,
                  date: assessment.date,
                  actionCode: item.value,
                  activeIndicator: true,
                };
              })
            : [],
          contactedComplainant: assessment.contacted_complainant,
          attended: assessment.attended,
          locationType: assessment.location_type,
          conflictHistory: assessment.conflict_history,
          categoryLevel: assessment.category_level,
          cat1Actions: assessment.assessment_cat1_type
            ? assessment.assessment_cat1_type.map((item) => {
                return {
                  actor: assessment.officer?.value,
                  date: assessment.date,
                  actionCode: item.value,
                  activeIndicator: true,
                };
              })
            : [],
        },
      },
    } as UpdateAssessmentInput;
    let {
      updateAssessmentInput: {
        assessmentDetails: { actions, cat1Actions },
      },
    } = updateAssessmentInput;

    for (let item of assessmentType.filter((record) => record.isActive)) {
      if (
        !actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.assessmentType)
      ) {
        actions.push({
          actor: assessment.officer?.value,
          date: assessment.date,
          actionCode: item.assessmentType,
          activeIndicator: false,
        } as AssessmentActionDto);
      }
    }

    for (let item of assessmentCat1Type.filter((record) => record.isActive)) {
      if (
        !cat1Actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.assessmentType)
      ) {
        cat1Actions.push({
          actor: assessment.officer?.value,
          date: assessment.date,
          actionCode: item.assessmentType,
          activeIndicator: false,
        } as AssessmentActionDto);
      }
    }
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/updateAssessment`, updateAssessmentInput);
    await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedAssessmentData = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessment({ assessment: updatedAssessmentData }));
        dispatch(clearComplaint());
        ToggleSuccess(`Assessment has been updated`);
      } else {
        ToggleError(`Unable to update assessment`);
      }
    });
  };

const parseAssessmentResponse = async (
  res: CaseFileDto,
  officers: Officer[],
): Promise<Assessment | undefined | null> => {
  if (res?.assessmentDetails?.actions?.length) {
    const { actor, actionDate } = res.assessmentDetails.actions.map((action) => {
      return { actor: action.actor, actionDate: action.date };
    })[0];

    let officerFullName = null;

    let officerNames = officers
      .filter((person) => person.auth_user_guid === actor)
      .map((officer) => {
        return `${officer.person_guid.last_name}, ${officer.person_guid.first_name}`;
      });

    if (officerNames?.length) {
      officerFullName = officerNames[0];
    } else {
      officerFullName = actor;
    }

    const updatedAssessmentData = {
      date: actionDate,
      officer: { key: officerFullName, value: actor },
      action_required: res.assessmentDetails.actionNotRequired ? "No" : "Yes",
      justification: {
        value: res.assessmentDetails.actionJustificationCode,
        key: res.assessmentDetails.actionJustificationLongDescription,
      },
      assessment_type: [],
      assessment_type_legacy: [],
      contacted_complainant: res.assessmentDetails.contactedComplainant,
      attended: res.assessmentDetails.attended,
      location_type: res.assessmentDetails.locationType,
      conflict_history: res.assessmentDetails.conflictHistory,
      category_level: res.assessmentDetails.categoryLevel,
      assessment_cat1_type: res.assessmentDetails.cat1Actions
        .filter((action) => {
          return action.activeIndicator;
        })
        .map((action) => {
          return { key: action.longDescription, value: action.actionCode };
        }),
    } as unknown as Assessment;
    for (let action of res.assessmentDetails.actions) {
      if (action.activeIndicator) {
        if (action.isLegacy && updatedAssessmentData.assessment_type_legacy) {
          updatedAssessmentData.assessment_type_legacy.push({ key: action.longDescription, value: action.actionCode });
        } else {
          updatedAssessmentData.assessment_type.push({ key: action.longDescription, value: action.actionCode });
        }
      }
    }

    return updatedAssessmentData;
  } else {
    return null;
  }
};

//-- prevention and education thunks
export const getPrevention =
  (complaintIdentifier?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
    } = getState();
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/${complaintIdentifier}`);
    await get<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedPreventionData = await parsePreventionResponse(res, officers);
      dispatch(setPrevention({ prevention: updatedPreventionData }));
    });
  };

export const upsertPrevention =
  (complaintIdentifier: string, prevention: Prevention): AppThunk =>
  async (dispatch) => {
    if (!prevention) {
      return;
    }
    const caseIdentifier = await dispatch(findCase(complaintIdentifier));
    if (!caseIdentifier) {
      dispatch(addPrevention(complaintIdentifier, prevention));
    } else {
      dispatch(updatePrevention(complaintIdentifier, caseIdentifier, prevention));
    }
  };

const addPrevention =
  (complaintIdentifier: string, prevention: Prevention): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "prevention-type": preventionType },
      officers: { officers },
      app: { profile },
      cases: { caseId },
    } = getState();
    let createPreventionInput = {
      createPreventionInput: {
        leadIdentifier: complaintIdentifier,
        createUserId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        preventionDetails: {
          actions: prevention.prevention_type.map((item) => {
            return {
              date: prevention.date,
              actor: prevention.officer?.value,

              activeIndicator: true,
              actionCode: item.value,
            };
          }),
        },
      },
    } as CreatePreventionInput;

    let {
      createPreventionInput: {
        preventionDetails: { actions },
      },
    } = createPreventionInput;
    for (let item of preventionType.filter((record) => record.isActive)) {
      if (
        !actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.preventionType)
      ) {
        actions.push({
          date: prevention.date,
          actor: prevention.officer?.value,
          activeIndicator: false,
          actionCode: item.preventionType,
        } as PreventionActionDto);
      }
    }

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/createPrevention`, createPreventionInput);
    await post<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedPreventionData = await parsePreventionResponse(res, officers);
      if (res) {
        dispatch(setPrevention({ prevention: updatedPreventionData }));
        if (!caseId) dispatch(setCaseId(res.caseIdentifier));
        ToggleSuccess(`Prevention and education has been saved`);
      } else {
        await dispatch(clearPrevention());
        ToggleError(`Unable to create prevention and education`);
      }
    });
  };

const updatePrevention =
  (complaintIdentifier: string, caseIdentifier: string, prevention: Prevention): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "prevention-type": preventionType },
      officers: { officers },
      app: { profile },
    } = getState();

    let updatePreventionInput = {
      updatePreventionInput: {
        leadIdentifier: complaintIdentifier,
        caseIdentifier: caseIdentifier,
        updateUserId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        preventionDetails: {
          actions: prevention.prevention_type.map((item) => {
            return {
              actor: prevention.officer?.value,
              date: prevention.date,
              actionCode: item.value,
              activeIndicator: true,
            };
          }),
        },
      },
    } as UpdatePreventionInput;
    let {
      updatePreventionInput: {
        preventionDetails: { actions },
      },
    } = updatePreventionInput;

    for (let item of preventionType.filter((record) => record.isActive)) {
      if (
        !actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.preventionType)
      ) {
        actions.push({
          actor: prevention.officer?.value,
          date: prevention.date,
          actionCode: item.preventionType,
          activeIndicator: false,
        } as PreventionActionDto);
      }
    }
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/updatePrevention`, updatePreventionInput);
    await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedPreventionData = await parsePreventionResponse(res, officers);
      if (res) {
        dispatch(setPrevention({ prevention: updatedPreventionData }));
        ToggleSuccess(`Prevention and education has been updated`);
      } else {
        await dispatch(getPrevention(complaintIdentifier));
        ToggleError(`Unable to update prevention and education`);
      }
    });
  };

const parsePreventionResponse = async (
  res: CaseFileDto,
  officers: Officer[],
): Promise<Prevention | undefined | null> => {
  if (res?.preventionDetails?.actions?.length) {
    const { actor, actionDate } = res.preventionDetails.actions.map((action) => {
      return { actor: action.actor, actionDate: action.date };
    })[0];

    let officerFullName = null;
    let officerNames = officers
      .filter((person) => person.auth_user_guid === actor)
      .map((officer) => {
        return `${officer.person_guid.last_name}, ${officer.person_guid.first_name}`;
      });

    if (officerNames?.length) {
      officerFullName = officerNames[0];
    } else {
      officerFullName = actor;
    }
    const updatedPreventionData = {
      date: actionDate,
      officer: { key: officerFullName, value: actor },
      prevention_type: res.preventionDetails.actions
        .filter((action) => {
          return action.activeIndicator;
        })
        .map((action) => {
          return { key: action.longDescription, value: action.actionCode };
        }),
    } as Prevention;
    return updatedPreventionData;
  } else {
    return null;
  }
};

//-- supplemental note thunks
export const upsertNote =
  (
    id: string,
    complaintType: string,
    note: string,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      cases: { note: currentNote },
    } = getState();

    const _createNote =
      (
        id: string,
        note: string,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const input: CreateSupplementalNotesInput = {
          note,
          leadIdentifier: id,
          agencyCode: getUserAgency(),
          caseCode: complaintType,
          actor,
          createUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/note`, input);
        return await post<CaseFileDto>(dispatch, parameters);
      };

    const _updateNote =
      (
        id: UUID,
        note: string,
        actor: string,
        userId: string,
        actionId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const caseId = await dispatch(findCase(id));

        const input: UpdateSupplementalNotesInput = {
          note,
          caseIdentifier: caseId as UUID,
          actor,
          updateUserId: userId,
          actionId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/note`, input);
        return await patch<CaseFileDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);

    let result;
    if (!currentNote?.action) {
      result = await dispatch(_createNote(id, note, officer ? officer.auth_user_guid : "", idir));

      if (result !== null) {
        dispatch(setCaseId(result.caseIdentifier)); //ideally check if caseId exists first, if not then do this function.

        ToggleSuccess("Supplemental note created");
      } else {
        ToggleError("Error, unable to create supplemental note");
      }
    } else {
      const {
        action: { actionId },
      } = currentNote;
      result = await dispatch(_updateNote(id as UUID, note, officer ? officer.auth_user_guid : "", idir, actionId));

      if (result !== null) {
        dispatch(setCaseId(result.caseIdentifier));
        ToggleSuccess("Supplemental note updated");
      } else {
        ToggleError("Error, unable to update supplemental note");
      }
    }

    if (result !== null) {
      return "success";
    } else {
      return "error";
    }
  };

export const deleteNote =
  (): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> => async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      cases: { caseId, note: currentNote },
    } = getState();

    const _deleteNote =
      (
        id: UUID,
        actor: string,
        userId: string,
        actionId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const input: DeleteSupplementalNoteInput = {
          caseIdentifier: caseId as UUID,
          actor,
          updateUserId: userId,
          actionId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/note`, input);
        return await deleteMethod<CaseFileDto>(dispatch, parameters);
      };

    if (currentNote?.action) {
      const {
        action: { actionId },
      } = currentNote;

      const officer = officers.find((item) => item.user_id === idir);
      const result = await dispatch(_deleteNote(caseId as UUID, officer ? officer.officer_guid : "", idir, actionId));

      if (result !== null) {
        ToggleSuccess("Supplemental note deleted");
        return "success";
      } else {
        ToggleError("Error, unable to delete supplemental note");
        return "error";
      }
    } else {
      ToggleError("Error, unable to delete supplemental note");
      return "error";
    }
  };

//-- file review thunks
export const createReview =
  (complaintId: string, isReviewRequired: boolean, reviewComplete: ReviewCompleteAction | null): AppThunk =>
  async (dispatch, getState) => {
    const {
      app: { profile },
      cases: { caseId },
    } = getState();
    let reviewInput = {
      reviewInput: {
        leadIdentifier: complaintId,
        caseIdentifier: caseId,
        userId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        isReviewRequired,
      } as ReviewInput,
    };

    if (reviewComplete) {
      reviewInput.reviewInput.reviewComplete = reviewComplete;
    }

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/review`, reviewInput);
    await post<CaseFileDto>(dispatch, parameters).then(async (res) => {
      if (res) {
        if (!caseId) dispatch(setCaseId(res.caseIdentifier));
        dispatch(setIsReviewedRequired(res.isReviewRequired));
        if (res.reviewComplete) {
          dispatch(setReviewComplete(res.reviewComplete));
        }
        dispatch(getComplaintStatusById(complaintId, COMPLAINT_TYPES.HWCR));
        ToggleSuccess("File review has been updated");
      } else {
        ToggleError("Unable to update file review");
      }
    });
  };

export const updateReview =
  (complaintId: string, isReviewRequired: boolean, reviewCompleteInput: ReviewCompleteAction | null): AppThunk =>
  async (dispatch, getState) => {
    const {
      app: { profile },
      cases: { caseId, reviewComplete },
    } = getState();
    let reviewInput = {
      reviewInput: {
        leadIdentifier: complaintId,
        caseIdentifier: caseId,
        userId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        isReviewRequired,
      } as ReviewInput,
    };

    if (reviewCompleteInput) {
      reviewInput.reviewInput.reviewComplete = reviewCompleteInput;
      reviewInput.reviewInput.reviewComplete.actionId = reviewComplete?.actionId;
    }

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/review`, reviewInput);
    await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
      if (res) {
        dispatch(setIsReviewedRequired(res.isReviewRequired));
        dispatch(setReviewComplete(res.reviewComplete));
        dispatch(getComplaintStatusById(complaintId, COMPLAINT_TYPES.HWCR));
        ToggleSuccess("File review has been updated");
      } else {
        ToggleError("Unable to update file review");
      }
    });
  };

//-- equipment thunks
export const deleteEquipment =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    if (!id) {
      return;
    }

    const {
      app: { profile },
    } = getState();

    const deleteEquipmentInput = {
      id: id,
      updateUserId: profile.idir_username,
    };

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/equipment`, deleteEquipmentInput);
    await deleteMethod<boolean>(dispatch, parameters).then(async (res) => {
      if (res) {
        // remove equipment from state
        const {
          cases: { equipment, note, subject, reviewComplete },
        } = getState();
        const updatedEquipment = equipment?.filter((equipment) => equipment.id !== id);

        dispatch(setCaseFile({ equipment: updatedEquipment, note, subject, reviewComplete }));
        ToggleSuccess(`Equipment has been deleted`);
      } else {
        ToggleError(`Unable to update equipment`);
      }
    });
  };

export const upsertEquipment =
  (complaintIdentifier: string, equipment: EquipmentDetailsDto): AppThunk =>
  async (dispatch, getState) => {
    if (!equipment) {
      return;
    }

    const {
      app: { profile },
      cases: { caseId },
    } = getState();
    // equipment does not exist, let's create it
    if (complaintIdentifier && !equipment.id) {
      let createEquipmentInput = {
        createEquipmentInput: {
          leadIdentifier: complaintIdentifier,
          createUserId: profile.idir_username,
          agencyCode: "COS",
          caseCode: "HWCR",
          equipment: [equipment],
        },
      } as CreateEquipmentInput;
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/equipment`, createEquipmentInput);
      await post<CaseFileDto>(dispatch, parameters).then(async (res) => {
        if (res) {
          dispatch(setCaseFile(res));
          if (!caseId) dispatch(setCaseId(res.caseIdentifier));
          ToggleSuccess(`Equipment has been updated`);
        } else {
          ToggleError(`Unable to update equipment`);
        }
      });
    } else {
      // equipment exists, we're updating it here
      let updateEquipmentInput = {
        updateEquipmentInput: {
          leadIdentifier: complaintIdentifier,
          updateUserId: profile.idir_username,
          agencyCode: "COS",
          caseCode: "HWCR",
          equipment: [equipment],
        },
      } as UpdateEquipmentInput;

      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/equipment`, updateEquipmentInput);
      await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
        if (res) {
          dispatch(setCaseFile(res));
          ToggleSuccess(`Equipment has been updated`);
        } else {
          ToggleError(`Unable to update equipment`);
        }
      });
    }
  };

//-- animal outcome thunks
export const createAnimalOutcome =
  (
    id: string,
    animalOutcome: AnimalOutcome,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
    } = getState();

    const {
      species,
      sex,
      age,
      identifyingFeatures,
      outcome,
      threatLevel,
      officer,
      date,
      tags,
      drugs,
      drugAuthorization,
    } = animalOutcome;

    let actions: Array<AnimalOutcomeActionInput> = [];

    //-- add an action if there is an outcome with officer
    if (outcome && date) {
      actions = [...actions, { action: CASE_ACTION_CODE.RECOUTCOME, actor: officer ?? "", date }];
    }

    //-- add an action if there are any drugs used
    if (from(drugs).any() && drugAuthorization) {
      const { officer, date } = drugAuthorization;
      actions = [...actions, { action: CASE_ACTION_CODE.ADMNSTRDRG, actor: officer, date }];
    }

    //-- convert eartags and drugs to input types
    const earTags = tags.map(({ ear, identifier }) => {
      let record: EarTagInput = { ear, identifier };
      return record;
    });

    const drugsUsed = drugs.map((item) => {
      const { vial, drug, amountUsed, injectionMethod, remainingUse, additionalComments } = item;
      const record: DrugUsedInputV3 = {
        vial,
        drug,
        amountUsed,
        injectionMethod,
        remainingUse,
        additionalComments,
      };

      return record;
    });

    const input: CreateAnimalOutcomeInput = {
      leadIdentifier: id,
      agencyCode: "COS",
      caseCode: "HWCR",
      createUserId: idir,
      wildlife: {
        species,
        sex,
        age,
        categoryLevel: threatLevel,
        identifyingFeatures,
        outcome,
        tags: earTags,
        drugs: drugsUsed,
        actions: from(actions).any() ? actions : undefined,
      },
    };

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/wildlife`, input);
    let result = await post<CaseFileDto>(dispatch, parameters);

    if (result) {
      const { caseIdentifier } = result;
      dispatch(setCaseId(caseIdentifier));

      ToggleSuccess("Animal outcome added");
      return "success";
    } else {
      ToggleError("Error, unable to add animal outcome");
      return "error";
    }
  };

export const updateAnimalOutcome =
  (
    id: UUID,
    animalOutcome: AnimalOutcome,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
    } = getState();

    const {
      id: wildlifeId,
      species,
      sex,
      age,
      identifyingFeatures,
      outcome,
      threatLevel,
      officer,
      date,
      tags,
      drugs,
      drugAuthorization,
    } = animalOutcome;
    let actions: Array<AnimalOutcomeActionInput> = [];

    //-- add an action if there is an outcome with officer
    if (outcome && date) {
      actions = [...actions, { action: CASE_ACTION_CODE.RECOUTCOME, actor: officer ?? "", date }];
    }

    //-- add an action if there are any drugs used
    if (from(drugs).any() && drugAuthorization) {
      const { officer, date } = drugAuthorization;
      actions = [...actions, { action: CASE_ACTION_CODE.ADMNSTRDRG, actor: officer, date }];
    }

    //-- convert eartags and drugs to input types
    const drugsUsed = drugs.map((item) => {
      const { id: drugId, vial, drug, amountUsed, injectionMethod, additionalComments, remainingUse } = item;
      const record: DrugUsedInputV3 = {
        id: drugId,
        vial,
        drug,
        amountUsed,
        injectionMethod,
        remainingUse,
        additionalComments,
      };

      return record;
    });

    const input: UpdateAnimalOutcomeInput = {
      caseIdentifier: id,
      updateUserId: idir,
      wildlife: {
        id: wildlifeId,
        species,
        sex,
        age,
        categoryLevel: threatLevel,
        identifyingFeatures,
        outcome,
        tags,
        drugs: drugsUsed,
        actions: from(actions).any() ? actions : undefined,
      },
    };

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/wildlife`, input);
    let result = await patch<CaseFileDto>(dispatch, parameters);

    if (result) {
      const { caseIdentifier } = result;
      dispatch(setCaseId(caseIdentifier));

      ToggleSuccess("Animal outcome updated");
      return "success";
    } else {
      ToggleError("Error, unable to update animal outcome");
      return "error";
    }
  };

export const deleteAnimalOutcome =
  (id: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      cases: { caseId },
    } = getState();

    const _deleteAnimalOutcome =
      (
        outcomeId: string,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const input: DeleteAnimalOutcomeInput = {
          caseIdentifier: caseId as UUID,
          actor,
          updateUserId: userId,
          outcomeId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/wildlife`, input);
        return await deleteMethod<CaseFileDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);
    const result = await dispatch(_deleteAnimalOutcome(id, officer ? officer.officer_guid : "", idir));

    if (result) {
      const { caseIdentifier } = result;
      dispatch(setCaseId(caseIdentifier));

      ToggleSuccess("Animal outcome deleted");
      return "success";
    } else {
      ToggleError("Error, unable to delete animal outcome");
      return "error";
    }
  };

export const upsertDecisionOutcome =
  (id: string, decision: Decision): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      cases: { decision: current },
    } = getState();

    const _createDecision =
      (id: string, decision: Decision): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const { assignedTo } = decision;

        const input: CreateDecisionInput = {
          leadIdentifier: id,
          agencyCode: "EPO",
          caseCode: "ERS",
          actor: assignedTo,
          createUserId: idir,
          decision,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/decision`, input);
        return await post<CaseFileDto>(dispatch, parameters);
      };

    const _updateDecison =
      (id: string, decision: Decision): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const { assignedTo } = decision;

        const input: UpdateDecisionInput = {
          caseIdentifier: id,
          agencyCode: "EPO",
          caseCode: "ERS",
          actor: assignedTo,
          updateUserId: idir,
          decision,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/decision`, input);
        return await patch<CaseFileDto>(dispatch, parameters);
      };

    //-- if there's no decsionId then create a new decsion
    //-- otherwise update an exisitng decision
    let result;

    if (!current?.id) {
      result = await dispatch(_createDecision(id, decision));
      if (!result) {
        return "error";
      }
    } else {
      const update = { ...decision, id: current.id };
      result = await dispatch(_updateDecison(id, update));
    }

    const { decision: _decision } = result;

    if (result && _decision.id) {
      dispatch(setCaseId(result.caseIdentifier));

      ToggleSuccess(`Decision ${!current?.id ? "added" : "updated"}`);
      return "success";
    } else {
      ToggleError(`Error, unable to ${!current?.id ? "create" : "update"} decision`);
      return "error";
    }
  };

export const upsertAuthorizationOutcome =
  (id: string, input: PermitSite): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      cases: { authorization: current },
    } = getState();

    const _create =
      (id: string, input: PermitSite): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const payload: CreateAuthorizationOutcomeInput = {
          leadIdentifier: id,
          agencyCode: "EPO",
          caseCode: "ERS",
          createUserId: idir,
          input,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/site`, payload);
        return await post<CaseFileDto>(dispatch, parameters);
      };

    const _update =
      (id: string, site: PermitSite): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const input: UpdateAuthorizationOutcomeInput = {
          caseIdentifier: id,
          updateUserId: idir,
          input: site,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/site`, input);
        return await patch<CaseFileDto>(dispatch, parameters);
      };

    let result;

    if (!current?.id) {
      result = await dispatch(_create(id, input));
    } else {
      const update = { ...input, id: current.id };
      result = await dispatch(_update(id, update));
    }
    const { authorization } = result;

    if (result && authorization.id) {
      dispatch(setCaseId(result.caseIdentifier));

      ToggleSuccess(`Authorization outcome ${!current?.id ? "added" : "updated"}`);
      return "success";
    } else {
      ToggleError(`Error, unable to ${!current?.id ? "create" : "update"} authroization outcome`);
      return "error";
    }
  };

export const deleteAuthorizationOutcome =
  (): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> => async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      cases: { caseId, authorization },
    } = getState();

    if (caseId && authorization?.id) {
      const { id } = authorization;
      const input: DeleteAuthorizationOutcomeInput = {
        caseIdentifier: caseId,
        updateUserId: idir,
        id,
      };

      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/site`, input);
      const result = await deleteMethod<CaseFileDto>(dispatch, parameters);

      const { authorization: outcome } = result;

      if (result && !outcome) {
        dispatch(setCaseId(result.caseIdentifier));

        ToggleSuccess("Authroization outcome deleted");
        return "success";
      } else {
        ToggleError("Error, unable to delete authorization outcome");
        return "error";
      }
    }
  };
