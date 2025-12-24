import { Action, ThunkAction } from "@reduxjs/toolkit";
import config from "@/config";
import { deleteMethod, generateApiParameters, get, patch, post } from "@common/api";
import { AppThunk, RootState } from "@store/store";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { ComplaintOutcomeDto } from "@/app/types/app/complaint-outcomes/complaint-outcome";
import {
  clearAssessment,
  clearPrevention,
  setAssessments,
  setCaseFile,
  setComplaintOutcomeGuid,
  setIsReviewedRequired,
  setPreventions,
  setReviewComplete,
} from "./complaint-outcomes";
import { Assessment } from "@apptypes/outcomes/assessment";
import { AppUser } from "@apptypes/app/app_user/app_user";
import { AssessmentActionDto } from "@/app/types/app/complaint-outcomes/assessment/assessment-action";
import { UpdateAssessmentInput } from "@/app/types/app/complaint-outcomes/assessment/update-assessment-input";
import { CreateAssessmentInput } from "@/app/types/app/complaint-outcomes/assessment/create-assessment-input";
import { Prevention } from "@apptypes/outcomes/prevention";
import { PreventionActionDto } from "@/app/types/app/complaint-outcomes/prevention/prevention-action";
import { UpdatePreventionInput } from "@/app/types/app/complaint-outcomes/prevention/update-prevention-input";
import { CreatePreventionInput } from "@/app/types/app/complaint-outcomes/prevention/create-prevention-input";
import { CreateNoteInput } from "@/app/types/app/complaint-outcomes/notes/create-note-input";
import { UpdateNoteInput } from "@/app/types/app/complaint-outcomes/notes/update-note-input";
import { DeleteNoteInput } from "@/app/types/app/complaint-outcomes/notes/delete-note-input";
import { UUID } from "node:crypto";
import { ReviewInput } from "@/app/types/app/complaint-outcomes/review-input";
import { ReviewCompleteAction } from "@/app/types/app/complaint-outcomes/review-complete-action";
import { EquipmentDetailsDto } from "@/app/types/app/complaint-outcomes/equipment-details";
import { CreateEquipmentInput } from "@/app/types/app/complaint-outcomes/equipment-inputs/create-equipment-input";
import { UpdateEquipmentInput } from "@/app/types/app/complaint-outcomes/equipment-inputs/update-equipment-input";
import { getComplaintStatusById, clearComplaint } from "./complaints";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { AnimalOutcome } from "@apptypes/app/complaints/outcomes/wildlife/animal-outcome";
import { CreateAnimalOutcomeInput } from "@/app/types/app/complaint-outcomes/animal-outcome/create-animal-outcome-input";
import { CASE_ACTION_CODE } from "@constants/case_actions";
import { from } from "linq-to-typescript";
import { EarTagInput } from "@/app/types/app/complaint-outcomes/animal-outcome/ear-tag-input";
import { DrugUsedInputV3 } from "@/app/types/app/complaint-outcomes/animal-outcome/drug-used-input";
import { AnimalOutcomeActionInput } from "@/app/types/app/complaint-outcomes/animal-outcome/animal-outcome-action-input";
import { DeleteAnimalOutcomeInput } from "@/app/types/app/complaint-outcomes/animal-outcome/delete-animal-outcome-input";
import { UpdateAnimalOutcomeInput } from "@/app/types/app/complaint-outcomes/animal-outcome/update-animal-outcome-input";
import { Decision } from "@/app/types/app/complaint-outcomes/ceeb/decision/decision";
import { CreateDecisionInput } from "@/app/types/app/complaint-outcomes/ceeb/decision/create-decision-input";
import { UpdateDecisionInput } from "@/app/types/app/complaint-outcomes/ceeb/decision/update-decsion-input";
import { PermitSite } from "@/app/types/app/complaint-outcomes/ceeb/authorization-outcome/permit-site";
import { CreateAuthorizationOutcomeInput } from "@/app/types/app/complaint-outcomes/ceeb/authorization-outcome/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "@/app/types/app/complaint-outcomes/ceeb/authorization-outcome/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "@/app/types/app/complaint-outcomes/ceeb/authorization-outcome/delete-authorization-outcome-input";
import { Note } from "@/app/types/outcomes/note";
import { AssessmentDto } from "@/app/types/app/complaint-outcomes/assessment/assessment";
import { PreventionDto } from "@/app/types/app/complaint-outcomes/prevention/prevention";
import { DeletePreventionInput } from "@/app/types/app/complaint-outcomes/prevention/delete-prevention-input";

//-- general thunks
export const findCase =
  (complaintIdentifier?: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/${complaintIdentifier}`);
      const response = await get<ComplaintOutcomeDto>(dispatch, parameters);
      return response?.complaintOutcomeGuid;
    } catch (error) {
      console.warn("Something went wrong requesting outcome identifier for %s", complaintIdentifier, error);
    }
  };

export const getCaseFile =
  (complaintIdentifier?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/${complaintIdentifier}`);
      const response = await get<ComplaintOutcomeDto>(dispatch, parameters);
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
    } catch (error) {
      console.warn("Something went wrong requesting outcome for %s", complaintIdentifier, error);
    }
  };

//-- assessment thunks
export const getAssessment =
  (complaintIdentifier?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
    } = getState();
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/${complaintIdentifier}`);
    return await get<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
      const assessments = await parseAssessmentResponse(res, officers);
      dispatch(setComplaintOutcomeGuid(res.complaintOutcomeGuid));
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
    const complaintOutcomeGuid = await dispatch(findCase(complaintIdentifier));
    if (!complaintOutcomeGuid || !assessment.id) {
      dispatch(addAssessment(assessment, complaintIdentifier, complaintOutcomeGuid));
    } else {
      dispatch(updateAssessment(assessment, complaintIdentifier, complaintOutcomeGuid));
    }
  };

const addAssessment =
  (assessment: Assessment, complaintIdentifier: string, complaintOutcomeGuid?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType, "assessment-cat1-type": assessmentCat1Type },
      officers: { officers },
      app: { profile },
      complaintOutcomes: { complaintOutcomeGuid },
    } = getState();
    let createAssessmentInput = {
      complaintId: complaintIdentifier,
      complaintOutcomeGuid: complaintOutcomeGuid,
      createUserId: profile.idir_username,
      outcomeAgencyCode: assessment.agency,
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

    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint-outcome/createAssessment`,
      createAssessmentInput,
    );
    await post<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
      const assessments = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessments(assessments));
        if (!complaintOutcomeGuid) dispatch(setComplaintOutcomeGuid(res.complaintOutcomeGuid));
        dispatch(clearComplaint());
        ToggleSuccess(`Assessment has been saved`);
      } else {
        dispatch(clearAssessment());
        ToggleError(`Unable to create assessment`);
      }
    });
  };

const updateAssessment =
  (assessment: Assessment, complaintIdentifier: string, complaintOutcomeGuid: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType, "assessment-cat1-type": assessmentCat1Type },
      officers: { officers },
      app: { profile },
    } = getState();

    let updateAssessmentInput = {
      complaintId: complaintIdentifier,
      complaintOutcomeGuid: complaintOutcomeGuid,
      updateUserId: profile.idir_username,
      outcomeAgencyCode: assessment.agency,
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
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint-outcome/updateAssessment`,
      updateAssessmentInput,
    );
    await patch<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
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

const parseAssessmentResponse = async (res: ComplaintOutcomeDto, officers: AppUser[]): Promise<Assessment[] | null> =>
  res?.assessment?.map((assessment: AssessmentDto) => {
    const { actor, actionDate } = assessment.actions.map((action: { actor: any; date: any }) => {
      return { actor: action.actor, actionDate: action.date };
    })[0];

    let officerFullName = null;

    let officerNames = officers
      .filter((person) => person.auth_user_guid === actor)
      .map((officer) => {
        return `${officer.last_name}, ${officer.first_name}`;
      });

    if (officerNames?.length) {
      officerFullName = officerNames[0];
    } else {
      officerFullName = actor;
    }

    const updatedAssessmentData = {
      id: assessment.id,
      agency: assessment.outcomeAgencyCode,
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
            key: action.actionCode,
            value: action.longDescription,
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
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/${complaintIdentifier}`);
    await get<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
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
    const complaintOutcomeGuid = await dispatch(findCase(complaintIdentifier));
    if (!complaintOutcomeGuid || !prevention.id) {
      dispatch(addPrevention(complaintIdentifier, agencyCode, prevention, complaintOutcomeGuid));
    } else {
      dispatch(updatePrevention(complaintIdentifier, agencyCode, prevention, complaintOutcomeGuid));
    }
  };

const addPrevention =
  (complaintIdentifier: string, agencyCode: string, prevention: Prevention, complaintOutcomeGuid?: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "prevention-type": preventionType },
      officers: { officers },
      app: { profile },
      complaintOutcomes: { complaintOutcomeGuid },
    } = getState();
    let createPreventionInput = {
      complaintId: complaintIdentifier,
      complaintOutcomeGuid: complaintOutcomeGuid,
      createUserId: profile.idir_username,
      outcomeAgencyCode: agencyCode,
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
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint-outcome/createPrevention`,
      createPreventionInput,
    );
    await post<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
      const updatedPreventionData = await parsePreventionResponse(res, officers);
      if (res) {
        dispatch(setPreventions(updatedPreventionData));
        if (!complaintOutcomeGuid) dispatch(setComplaintOutcomeGuid(res.complaintOutcomeGuid));
        ToggleSuccess(`Prevention and education has been saved`);
      } else {
        dispatch(clearPrevention());
        ToggleError(`Unable to create prevention and education`);
      }
    });
  };

const updatePrevention =
  (complaintIdentifier: string, agencyCode: string, prevention: Prevention, complaintOutcomeGuid: string): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "prevention-type": preventionType },
      officers: { officers },
      app: { profile },
    } = getState();
    let updatePreventionInput = {
      complaintId: complaintIdentifier,
      complaintOutcomeGuid: complaintOutcomeGuid,
      updateUserId: profile.idir_username,
      outcomeAgencyCode: agencyCode,
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
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint-outcome/updatePrevention`,
      updatePreventionInput,
    );
    await patch<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
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
      complaintId: complaintIdentifier,
      updateUserId: profile.idir_username,
    } as DeletePreventionInput;
    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint-outcome/prevention`,
      deletePreventionInput,
    );
    await deleteMethod<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
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
  res: ComplaintOutcomeDto,
  officers: AppUser[],
): Promise<Prevention[] | undefined | null> =>
  res?.prevention?.map((prevention: PreventionDto) => {
    const { actor, actionDate } = prevention.actions.map((action) => {
      return { actor: action.actor, actionDate: action.date };
    })[0];

    let officerFullName = null;
    let officerNames = officers
      .filter((person) => person.auth_user_guid === actor)
      .map((officer) => {
        return `${officer.last_name}, ${officer.first_name}`;
      });

    if (officerNames?.length) {
      officerFullName = officerNames[0];
    } else {
      officerFullName = actor;
    }
    const updatedPreventionData = {
      id: prevention.id,
      outcomeAgencyCode: prevention.outcomeAgencyCode,
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
    complaintId: string,
    complaintType: string,
    note: string,
    agencyCode: string,
    id?: UUID,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      complaintOutcomes: { notes: currentNotes },
    } = getState();

    const _createNote =
      (
        id: string,
        note: string,
        actor: string,
        userId: string,
        agencyCode: string,
      ): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: CreateNoteInput = {
          note,
          complaintId,
          outcomeAgencyCode: agencyCode,
          actor,
          createUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/note`, input);
        return await post<ComplaintOutcomeDto>(dispatch, parameters);
      };

    const _updateNote =
      (
        id: UUID,
        note: string,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const complaintOutcomeGuid = await dispatch(findCase(complaintId));

        const input: UpdateNoteInput = {
          id,
          note,
          complaintId: complaintId,
          complaintOutcomeGuid: complaintOutcomeGuid as UUID,
          actor,
          updateUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/note`, input);
        return await patch<ComplaintOutcomeDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);

    let result;
    if (!id) {
      result = await dispatch(_createNote(complaintId, note, officer ? officer.auth_user_guid : "", idir, agencyCode));

      if (result !== null) {
        dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid)); //ideally check if complaintOutcomeGuid exists first, if not then do this function.

        ToggleSuccess("Note created");
      } else {
        ToggleError("Error, unable to create note");
      }
    } else if (currentNotes.find((note: Note) => note.id === id)) {
      result = await dispatch(_updateNote(id, note, officer ? officer.auth_user_guid : "", idir));

      if (result !== null) {
        dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid));
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
      complaintOutcomes: { complaintOutcomeGuid, notes: currentNotes },
    } = getState();

    const _deleteNote =
      (
        id: UUID,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: DeleteNoteInput = {
          complaintId: leadIdentifer,
          complaintOutcomeGuid: complaintOutcomeGuid as UUID,
          id,
          actor,
          updateUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/note`, input);
        return await deleteMethod<ComplaintOutcomeDto>(dispatch, parameters);
      };

    if (currentNotes.find((note: Note) => note.id === id)) {
      const officer = officers.find((item) => item.user_id === idir);
      const result = await dispatch(_deleteNote(id, officer ? officer.app_user_guid : "", idir));

      if (result !== null) {
        dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid));
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
      complaintOutcomes: { complaintOutcomeGuid },
    } = getState();
    let reviewInput = {
      reviewInput: {
        complaintId: complaintId,
        complaintOutcomeGuid: complaintOutcomeGuid,
        userId: profile.idir_username,
        outcomeAgencyCode: "COS",
        isReviewRequired,
      } as ReviewInput,
    };

    if (reviewComplete) {
      reviewInput.reviewInput.reviewComplete = reviewComplete;
    }

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/review`, reviewInput);
    await post<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
      if (res) {
        if (!complaintOutcomeGuid) dispatch(setComplaintOutcomeGuid(res.complaintOutcomeGuid));
        dispatch(setIsReviewedRequired(res.isReviewRequired));
        if (res.reviewComplete) {
          dispatch(setReviewComplete(res.reviewComplete));
        }
        dispatch(getComplaintStatusById(complaintId, COMPLAINT_TYPES.HWCR));
        ToggleSuccess("File review has been updated", { toastId: "review-updated-toast" });
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
      complaintOutcomes: { complaintOutcomeGuid, reviewComplete },
    } = getState();
    let reviewInput = {
      reviewInput: {
        complaintId,
        complaintOutcomeGuid: complaintOutcomeGuid,
        userId: profile.idir_username,
        outcomeAgencyCode: "COS",
        isReviewRequired,
      } as ReviewInput,
    };

    if (reviewCompleteInput) {
      reviewInput.reviewInput.reviewComplete = reviewCompleteInput;
      reviewInput.reviewInput.reviewComplete.actionId = reviewComplete?.actionId;
    }

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/review`, reviewInput);
    await patch<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
      if (res) {
        dispatch(setIsReviewedRequired(res.isReviewRequired));
        dispatch(setReviewComplete(res.reviewComplete));
        dispatch(getComplaintStatusById(complaintId, COMPLAINT_TYPES.HWCR));
        ToggleSuccess("File review has been updated", { toastId: "review-updated-toast" });
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
      complaintId: complaintId,
    };

    const parameters = generateApiParameters(
      `${config.API_BASE_URL}/v1/complaint-outcome/equipment`,
      deleteEquipmentInput,
    );
    await deleteMethod<boolean>(dispatch, parameters).then(async (res) => {
      if (res) {
        // remove equipment from state
        const {
          complaintOutcomes: { equipment, notes, subject, reviewComplete },
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
      complaintOutcomes: { complaintOutcomeGuid },
    } = getState();
    // equipment does not exist, let's create it
    if (complaintIdentifier && !equipment.id) {
      let createEquipmentInput = {
        createEquipmentInput: {
          complaintId: complaintIdentifier,
          createUserId: profile.idir_username,
          outcomeAgencyCode: "COS",
          equipment: [equipment],
        },
      } as CreateEquipmentInput;
      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint-outcome/equipment`,
        createEquipmentInput,
      );
      await post<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
        if (res) {
          dispatch(setCaseFile(res));
          if (!complaintOutcomeGuid) dispatch(setComplaintOutcomeGuid(res.complaintOutcomeGuid));
          ToggleSuccess(`Equipment has been updated`);
        } else {
          ToggleError(`Unable to update equipment`);
        }
      });
    } else {
      // equipment exists, we're updating it here
      let updateEquipmentInput = {
        updateEquipmentInput: {
          complaintId: complaintIdentifier,
          updateUserId: profile.idir_username,
          outcomeAgencyCode: "COS",
          equipment: [equipment],
        },
      } as UpdateEquipmentInput;

      const parameters = generateApiParameters(
        `${config.API_BASE_URL}/v1/complaint-outcome/equipment`,
        updateEquipmentInput,
      );
      await patch<ComplaintOutcomeDto>(dispatch, parameters).then(async (res) => {
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
    complaintId: string,
    animalOutcome: AnimalOutcome,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      complaintOutcomes: { complaintOutcomeGuid },
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
      complaintId,
      outcomeAgencyCode: "COS",
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

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/wildlife`, input);
    let result = await post<ComplaintOutcomeDto>(dispatch, parameters);

    if (result) {
      if (!complaintOutcomeGuid) dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid));

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
    complaintId: string,
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
      complaintOutcomeGuid: id,
      complaintId: complaintId,
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

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/wildlife`, input);
    let result = await patch<ComplaintOutcomeDto>(dispatch, parameters);

    if (result) {
      const { complaintOutcomeGuid } = result;
      dispatch(setComplaintOutcomeGuid(complaintOutcomeGuid));

      ToggleSuccess("Animal outcome updated");
      return "success";
    } else {
      ToggleError("Error, unable to update animal outcome");
      return "error";
    }
  };

export const deleteAnimalOutcome =
  (id: string, complaintId: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      officers: { officers },
      app: {
        profile: { idir_username: idir },
      },
      complaintOutcomes: { complaintOutcomeGuid },
    } = getState();

    const _deleteAnimalOutcome =
      (
        outcomeId: string,
        complaintId: string,
        actor: string,
        userId: string,
      ): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: DeleteAnimalOutcomeInput = {
          complaintOutcomeGuid: complaintOutcomeGuid as UUID,
          complaintId: complaintId,
          actor,
          updateUserId: userId,
          outcomeId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/wildlife`, input);
        return await deleteMethod<ComplaintOutcomeDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);
    const result = await dispatch(_deleteAnimalOutcome(id, complaintId, officer ? officer.app_user_guid : "", idir));

    if (result) {
      const { complaintOutcomeGuid } = result;
      dispatch(setComplaintOutcomeGuid(complaintOutcomeGuid));

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
    complaintId: string,
    decision: Decision,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      complaintOutcomes: { decision: current },
    } = getState();

    const _createDecision =
      (id: string, decision: Decision): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const { assignedTo } = decision;

        const input: CreateDecisionInput = {
          complaintId: id,
          outcomeAgencyCode: "EPO",
          actor: assignedTo,
          createUserId: idir,
          decision,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/decision`, input);
        return await post<ComplaintOutcomeDto>(dispatch, parameters);
      };

    const _updateDecison =
      (id: string, decision: Decision): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const { assignedTo } = decision;

        const input: UpdateDecisionInput = {
          complaintOutcomeGuid: id,
          complaintId: complaintId,
          outcomeAgencyCode: "EPO",
          actor: assignedTo,
          updateUserId: idir,
          decision,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/decision`, input);
        return await patch<ComplaintOutcomeDto>(dispatch, parameters);
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
      dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid));

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
    complaintId: string,
    input: PermitSite,
  ): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      complaintOutcomes: { authorization: current },
    } = getState();

    const _create =
      (id: string, input: PermitSite): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const payload: CreateAuthorizationOutcomeInput = {
          complaintId: id,
          outcomeAgencyCode: "EPO",
          createUserId: idir,
          input,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/site`, payload);
        return await post<ComplaintOutcomeDto>(dispatch, parameters);
      };

    const _update =
      (
        id: string,
        complaintId: string,
        site: PermitSite,
      ): ThunkAction<Promise<ComplaintOutcomeDto>, RootState, unknown, Action<string>> =>
      async (dispatch) => {
        const input: UpdateAuthorizationOutcomeInput = {
          complaintOutcomeGuid: id,
          complaintId: complaintId,
          updateUserId: idir,
          input: site,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/site`, input);
        return await patch<ComplaintOutcomeDto>(dispatch, parameters);
      };

    let result;

    if (!current?.id) {
      result = await dispatch(_create(id, input));
    } else {
      const update = { ...input, id: current.id };
      result = await dispatch(_update(id, complaintId, update));
    }
    const { authorization } = result;

    if (result && authorization.id) {
      dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid));

      ToggleSuccess(`Authorization outcome ${!current?.id ? "added" : "updated"}`);
      return "success";
    } else {
      ToggleError(`Error, unable to ${!current?.id ? "create" : "update"} authroization outcome`);
      return "error";
    }
  };

export const deleteAuthorizationOutcome =
  (complaintId: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
  async (dispatch, getState) => {
    const {
      app: {
        profile: { idir_username: idir },
      },
      complaintOutcomes: { complaintOutcomeGuid, authorization },
    } = getState();

    if (complaintOutcomeGuid && authorization?.id) {
      const { id } = authorization;
      const input: DeleteAuthorizationOutcomeInput = {
        complaintOutcomeGuid: complaintOutcomeGuid,
        complaintId: complaintId,
        updateUserId: idir,
        id,
      };

      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/complaint-outcome/site`, input);
      const result = await deleteMethod<ComplaintOutcomeDto>(dispatch, parameters);

      const { authorization: outcome } = result;

      if (result && !outcome) {
        dispatch(setComplaintOutcomeGuid(result.complaintOutcomeGuid));

        ToggleSuccess("Authroization outcome deleted");
        return "success";
      } else {
        ToggleError("Error, unable to delete authorization outcome");
        return "error";
      }
    }
  };
