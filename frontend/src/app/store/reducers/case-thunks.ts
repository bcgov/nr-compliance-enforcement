import { Action, ThunkAction } from "@reduxjs/toolkit";
import config from "@/config";
import { deleteMethod, generateApiParameters, get, patch, post } from "@common/api";
import { AppThunk, RootState } from "@store/store";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { CaseFileDto } from "@apptypes/app/case-files/case-file";
import {
  clearAssessment,
  clearPrevention,
  setAssessments,
  setCaseFile,
  setCaseId,
  setIsReviewedRequired,
  setPreventions,
  setReviewComplete,
} from "./cases";
import { Assessment } from "@apptypes/outcomes/assessment";
import { Officer } from "@apptypes/person/person";
import { AssessmentActionDto } from "@/app/types/app/case-files/assessment/assessment-action";
import { UpdateAssessmentInput } from "@/app/types/app/case-files/assessment/update-assessment-input";
import { CreateAssessmentInput } from "@/app/types/app/case-files/assessment/create-assessment-input";
import { Prevention } from "@apptypes/outcomes/prevention";
import { PreventionActionDto } from "@apptypes/app/case-files/prevention/prevention-action";
import { UpdatePreventionInput } from "@apptypes/app/case-files/prevention/update-prevention-input";
import { CreatePreventionInput } from "@apptypes/app/case-files/prevention/create-prevention-input";
import { CreateNoteInput } from "@apptypes/app/case-files/notes/create-note-input";
import { UpdateNoteInput } from "@apptypes/app/case-files/notes/update-note-input";
import { DeleteNoteInput } from "@apptypes/app/case-files/notes/delete-note-input";
import { UUID } from "crypto";
import { ReviewInput } from "@apptypes/app/case-files/review-input";
import { ReviewCompleteAction } from "@apptypes/app/case-files/review-complete-action";
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
import { Note } from "@/app/types/outcomes/note";
import { AssessmentDto } from "@/app/types/app/case-files/assessment/assessment";
import { PreventionDto } from "@/app/types/app/case-files/prevention/prevention";
import { DeletePreventionInput } from "@/app/types/app/case-files/prevention/delete-prevention-input";

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
  async (dispatch, getState) => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/${complaintIdentifier}`);
    const response = await get<CaseFileDto>(dispatch, parameters);
    dispatch(setCaseFile(response));
    // If there is a case file parse and set the assessment details which is not handled by setCaseFile
    if (response) {
      const {
        officers: { officers },
      } = getState();
      const assessments = await parseAssessmentResponse(response, officers);
      dispatch(setAssessments(assessments));
      const updatedPreventionData = await parsePreventionResponse(response, officers);
      dispatch(setPreventions(updatedPreventionData));
      dispatch(setIsReviewedRequired(response.isReviewRequired));
      dispatch(setReviewComplete(response.reviewComplete));
    } else {
      // If there is no case file clear the assessment and prevention sections
      dispatch(setAssessments([]));
      dispatch(setPreventions([]));
    }
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
      const assessments = await parseAssessmentResponse(res, officers);
      dispatch(setCaseId(res.caseIdentifier));
      dispatch(setAssessments(assessments));
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
    if (!caseIdentifier || !assessment.id) {
      dispatch(addAssessment(assessment, complaintIdentifier, caseIdentifier));
    } else {
      dispatch(updateAssessment(assessment, complaintIdentifier, caseIdentifier));
    }
  };

const addAssessment =
  (assessment: Assessment, complaintIdentifier: string, caseIdentifier?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType, "assessment-cat1-type": assessmentCat1Type },
      officers: { officers },
      app: { profile },
      cases: { caseId },
    } = getState();
    let createAssessmentInput = {
      leadIdentifier: complaintIdentifier,
      caseIdentifier: caseIdentifier,
      createUserId: profile.idir_username,
      agencyCode: "COS",
      caseCode: "HWCR",
      assessment: {
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
    } as CreateAssessmentInput;

    let {
      assessment: { actions, cat1Actions },
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
      const assessments = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessments(assessments));
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
  (assessment: Assessment, complaintIdentifier: string, caseIdentifier: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType, "assessment-cat1-type": assessmentCat1Type },
      officers: { officers },
      app: { profile },
    } = getState();

    let updateAssessmentInput = {
      leadIdentifier: complaintIdentifier,
      caseIdentifier: caseIdentifier,
      updateUserId: profile.idir_username,
      agencyCode: "COS",
      caseCode: "HWCR",
      assessment: {
        id: assessment.id,
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
    } as UpdateAssessmentInput;
    let {
      assessment: { actions, cat1Actions },
    } = updateAssessmentInput;

    for (let item of assessmentType.filter((record) => record.isActive)) {
      if (
        !actions
          .map((action: { actionCode: any }) => {
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
          .map((action: { actionCode: any }) => {
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
      const assessments = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessments(assessments));
        dispatch(clearComplaint());
        ToggleSuccess(`Assessment has been updated`);
      } else {
        ToggleError(`Unable to update assessment`);
      }
    });
  };

const parseAssessmentResponse = async (res: CaseFileDto, officers: Officer[]): Promise<Assessment[] | null> =>
  res?.assessment?.map((assessment: AssessmentDto) => {
    const { actor, actionDate } = assessment.actions.map((action: { actor: any; date: any }) => {
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
      id: assessment.id,
      agency: assessment.agencyCode,
      date: actionDate,
      officer: { key: officerFullName, value: actor },
      action_required: assessment.actionNotRequired ? "No" : "Yes",
      justification: {
        value: assessment.actionJustificationCode,
        key: assessment.actionJustificationLongDescription,
      },
      assessment_type: [],
      assessment_type_legacy: [],
      contacted_complainant: assessment.contactedComplainant,
      attended: assessment.attended,
      location_type: assessment.locationType,
      conflict_history: assessment.conflictHistory,
      category_level: assessment.categoryLevel,
      assessment_cat1_type: assessment.cat1Actions
        .filter((action: { activeIndicator: any }) => {
          return action.activeIndicator;
        })
        .map((action) => {
          return { key: action.longDescription, value: action.actionCode };
        }),
    } as unknown as Assessment;
    for (let action of assessment.actions) {
      if (action.activeIndicator) {
        if (action.isLegacy && updatedAssessmentData.assessment_type_legacy) {
          updatedAssessmentData.assessment_type_legacy.push({
            key: action.longDescription,
            value: action.actionCode,
          });
        } else {
          updatedAssessmentData.assessment_type.push({ key: action.longDescription, value: action.actionCode });
        }
      }
    }

    return updatedAssessmentData;
  }) || [];

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
      dispatch(setPreventions(updatedPreventionData));
    });
  };

export const upsertPrevention =
  (complaintIdentifier: string, agencyCode: string, prevention: Prevention): AppThunk =>
  async (dispatch) => {
    if (!prevention) {
      return;
    }
    const caseIdentifier = await dispatch(findCase(complaintIdentifier));
    if (!caseIdentifier || !prevention.id) {
      dispatch(addPrevention(complaintIdentifier, agencyCode, prevention, caseIdentifier));
    } else {
      dispatch(updatePrevention(complaintIdentifier, agencyCode, prevention, caseIdentifier));
    }
  };

const addPrevention =
  (complaintIdentifier: string, agencyCode: string, prevention: Prevention, caseIdentifier?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "prevention-type": preventionType },
      officers: { officers },
      app: { profile },
      cases: { caseId },
    } = getState();
    let createPreventionInput = {
      leadIdentifier: complaintIdentifier,
      caseIdentifier: caseIdentifier,
      createUserId: profile.idir_username,
      agencyCode: agencyCode,
      caseCode: "HWCR",
      prevention: {
        actions: prevention.prevention_type.map((item) => {
          return {
            date: prevention.date,
            actor: prevention.officer?.value,
            activeIndicator: true,
            actionCode: item.value,
          };
        }),
      },
    } as CreatePreventionInput;
    for (let item of preventionType.filter((record) => record.isActive && record.agencyCode === agencyCode)) {
      if (
        !createPreventionInput.prevention.actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.preventionType)
      ) {
        createPreventionInput.prevention.actions.push({
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
        dispatch(setPreventions(updatedPreventionData));
        if (!caseId) dispatch(setCaseId(res.caseIdentifier));
        ToggleSuccess(`Prevention and education has been saved`);
      } else {
        dispatch(clearPrevention());
        ToggleError(`Unable to create prevention and education`);
      }
    });
  };

const updatePrevention =
  (complaintIdentifier: string, agencyCode: string, prevention: Prevention, caseIdentifier: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "prevention-type": preventionType },
      officers: { officers },
      app: { profile },
    } = getState();
    let updatePreventionInput = {
      leadIdentifier: complaintIdentifier,
      caseIdentifier: caseIdentifier,
      updateUserId: profile.idir_username,
      agencyCode: agencyCode,
      caseCode: "HWCR",
      prevention: {
        id: prevention.id,
        actions: prevention.prevention_type.map((item) => {
          return {
            date: prevention.date,
            actor: prevention.officer?.value,
            activeIndicator: true,
            actionCode: item.value,
          };
        }),
      },
    } as UpdatePreventionInput;
    for (let item of preventionType.filter((record) => record.isActive && record.agencyCode === agencyCode)) {
      if (
        !updatePreventionInput.prevention.actions
          .map((action) => {
            return action.actionCode;
          })
          .includes(item.preventionType)
      ) {
        updatePreventionInput.prevention.actions.push({
          date: prevention.date,
          actor: prevention.officer?.value,
          activeIndicator: false,
          actionCode: item.preventionType,
        } as PreventionActionDto);
      }
    }
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/updatePrevention`, updatePreventionInput);
    await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedPreventionData = await parsePreventionResponse(res, officers);
      if (res) {
        dispatch(setPreventions(updatedPreventionData));
        ToggleSuccess(`Prevention and education has been updated`);
      } else {
        dispatch(getPrevention(complaintIdentifier));
        ToggleError(`Unable to update prevention and education`);
      }
    });
  };

export const deletePrevention =
  (complaintIdentifier: string, id: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: { profile },
    } = getState();
    const deletePreventionInput = {
      id: id,
      leadIdentifier: complaintIdentifier,
      updateUserId: profile.idir_username,
    } as DeletePreventionInput;
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/prevention`, deletePreventionInput);
    await deleteMethod<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedPreventionData = await parsePreventionResponse(res, officers);
      if (res) {
        dispatch(setPreventions(updatedPreventionData));
        ToggleSuccess(`Prevention and education actions have been deleted`);
      } else {
        dispatch(getPrevention(complaintIdentifier));
        ToggleError(`Unable to delete prevention and education actions`);
      }
    });
  };

const parsePreventionResponse = async (
  res: CaseFileDto,
  officers: Officer[],
): Promise<Prevention[] | undefined | null> =>
  res?.prevention?.map((prevention: PreventionDto) => {
    const { actor, actionDate } = prevention.actions.map((action) => {
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
      id: prevention.id,
      agencyCode: prevention.agencyCode,
      date: actionDate,
      officer: { key: officerFullName, value: actor },
      prevention_type: prevention.actions
        .filter((action) => {
          return action.activeIndicator;
        })
        .map((action) => {
          return { key: action.longDescription, value: action.actionCode };
        }),
    } as Prevention;
    return updatedPreventionData;
  }) || [];

//-- note thunks
export const upsertNote =
  (
    leadIdentifier: string,
    complaintType: string,
    note: string,
    id?: UUID,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      cases: { notes: currentNotes },
    } = getState();

    const _createNote =
      (
        id: string,
        note: string,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: CreateNoteInput = {
          note,
          leadIdentifier: leadIdentifier,
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
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const caseId = await dispatch(findCase(leadIdentifier));

        const input: UpdateNoteInput = {
          id,
          note,
          leadIdentifier: leadIdentifier,
          caseIdentifier: caseId as UUID,
          actor,
          updateUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/note`, input);
        return await patch<CaseFileDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);

    let result;
    if (!id) {
      result = await dispatch(_createNote(leadIdentifier, note, officer ? officer.auth_user_guid : "", idir));

      if (result !== null) {
        dispatch(setCaseId(result.caseIdentifier)); //ideally check if caseId exists first, if not then do this function.

        ToggleSuccess("Note created");
      } else {
        ToggleError("Error, unable to create note");
      }
    } else if (currentNotes.find((note: Note) => note.id === id)) {
      result = await dispatch(_updateNote(id, note, officer ? officer.auth_user_guid : "", idir));

      if (result !== null) {
        dispatch(setCaseId(result.caseIdentifier));
        ToggleSuccess("Note updated");
      } else {
        ToggleError("Error, unable to update note");
      }
    } else {
      ToggleError("Error, unable to update note");
    }

    if (result !== null) {
      return "success";
    } else {
      return "error";
    }
  };

export const deleteNote =
  (leadIdentifer: string, id: UUID): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      cases: { caseId, notes: currentNotes },
    } = getState();

    const _deleteNote =
      (
        id: UUID,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: DeleteNoteInput = {
          leadIdentifier: leadIdentifer,
          caseIdentifier: caseId as UUID,
          id,
          actor,
          updateUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/note`, input);
        return await deleteMethod<CaseFileDto>(dispatch, parameters);
      };

    if (currentNotes.find((note: Note) => note.id === id)) {
      const officer = officers.find((item) => item.user_id === idir);
      const result = await dispatch(_deleteNote(id, officer ? officer.officer_guid : "", idir));

      if (result !== null) {
        dispatch(setCaseId(result.caseIdentifier));
        ToggleSuccess("Note deleted");
        return "success";
      } else {
        ToggleError("Error, unable to delete note");
        return "error";
      }
    } else {
      ToggleError("Error, unable to delete note");
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
  (complaintId: string, id: string): AppThunk =>
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
      leadIdentifier: complaintId,
    };

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/equipment`, deleteEquipmentInput);
    await deleteMethod<boolean>(dispatch, parameters).then(async (res) => {
      if (res) {
        // remove equipment from state
        const {
          cases: { equipment, notes, subject, reviewComplete },
        } = getState();
        const updatedEquipment = equipment?.filter((equipment) => equipment.id !== id);

        dispatch(setCaseFile({ equipment: updatedEquipment, notes, subject, reviewComplete }));
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
      outcomeActionedBy,
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
        outcomeActionedBy,
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
    leadIdentifier: string,
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
      outcomeActionedBy,
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

    const tagsInput = tags.map(({ id, ear, identifier }) => ({ id, ear, identifier }));

    const input: UpdateAnimalOutcomeInput = {
      caseIdentifier: id,
      leadIdentifier: leadIdentifier,
      updateUserId: idir,
      wildlife: {
        id: wildlifeId,
        species,
        sex,
        age,
        categoryLevel: threatLevel,
        identifyingFeatures,
        outcome,
        outcomeActionedBy,
        tags: tagsInput,
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
  (id: string, leadIdentifier: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
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
        leadIdentifier: string,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: DeleteAnimalOutcomeInput = {
          caseIdentifier: caseId as UUID,
          leadIdentifier: leadIdentifier,
          actor,
          updateUserId: userId,
          outcomeId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/wildlife`, input);
        return await deleteMethod<CaseFileDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);
    const result = await dispatch(_deleteAnimalOutcome(id, leadIdentifier, officer ? officer.officer_guid : "", idir));

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
  (
    id: string,
    leadIdentifier: string,
    decision: Decision,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      cases: { decision: current },
    } = getState();

    const _createDecision =
      (id: string, decision: Decision): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
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
      (id: string, decision: Decision): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const { assignedTo } = decision;

        const input: UpdateDecisionInput = {
          caseIdentifier: id,
          leadIdentifier: leadIdentifier,
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
  (
    id: string,
    leadIdentifier: string,
    input: PermitSite,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      cases: { authorization: current },
    } = getState();

    const _create =
      (id: string, input: PermitSite): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
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
      (
        id: string,
        leadIdentifier: string,
        site: PermitSite,
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: UpdateAuthorizationOutcomeInput = {
          caseIdentifier: id,
          leadIdentifier: leadIdentifier,
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
      result = await dispatch(_update(id, leadIdentifier, update));
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
  (leadIdentifier: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
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
        leadIdentifier: leadIdentifier,
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
