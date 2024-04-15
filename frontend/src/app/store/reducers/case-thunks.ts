import { Action, ThunkAction } from "@reduxjs/toolkit";
import config from "../../../config";
import { deleteMethod, generateApiParameters, get, patch, post } from "../../common/api";
import { AppThunk, RootState } from "../store";
import { ToggleError, ToggleSuccess } from "../../common/toast";
import { CaseFileDto } from "../../types/app/case-files/case-file";
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
import { Assessment } from "../../types/outcomes/assessment";
import { Officer } from "../../types/person/person";
import { AssessmentActionDto } from "../../types/app/case-files/assessment-action";
import { UpdateAssessmentInput } from "../../types/app/case-files/update-assessment-input";
import { CreateAssessmentInput } from "../../types/app/case-files/create-assessment-input";
import { Prevention } from "../../types/outcomes/prevention";
import { PreventionActionDto } from "../../types/app/case-files/prevention/prevention-action";
import { UpdatePreventionInput } from "../../types/app/case-files/prevention/update-prevention-input";
import { CreatePreventionInput } from "../../types/app/case-files/prevention/create-prevention-input";
import { CreateSupplementalNotesInput } from "../../types/app/case-files/supplemental-notes/create-supplemental-notes-input";
import { UUID } from "crypto";
import { UpdateSupplementalNotesInput } from "../../types/app/case-files/supplemental-notes/update-supplemental-notes-input";
import { ReviewInput } from "../../types/app/case-files/review-input";
import { ReviewCompleteAction } from "../../types/app/case-files/review-complete-action";
import { EquipmentDetailsDto } from "../../types/app/case-files/equipment-details";
import { CreateEquipmentInput } from "../../types/app/case-files/equipment-inputs/create-equipment-input";
import { UpdateEquipmentInput } from "../../types/app/case-files/equipment-inputs/update-equipment-input";

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
    await get<CaseFileDto>(dispatch, parameters).then(async (res) => {
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
      codeTables: { "assessment-type": assessmentType },
      officers: { officers },
      app: { profile },
    } = getState();
    let createAssessmentInput = {
      createAssessmentInput: {
        leadIdentifier: complaintIdentifier,
        createUserId: profile.idir_username,
        agencyCode: "COS",
        caseCode: "HWCR",
        assessmentDetails: {
          actionNotRequired: assessment.action_required === "No",
          actions: assessment.assessment_type.map((item) => {
            return {
              date: assessment.date,
              actor: assessment.officer?.value,
              activeIndicator: true,
              actionCode: item.value,
            };
          }),
          actionJustificationCode: assessment.justification?.value,
        },
      },
    } as CreateAssessmentInput;

    let {
      createAssessmentInput: {
        assessmentDetails: { actions },
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

    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/createAssessment`, createAssessmentInput);
    await post<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedAssessmentData = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessment({ assessment: updatedAssessmentData }));
        ToggleSuccess(`Assessment has been saved`);
      } else {
        await dispatch(clearAssessment());
        ToggleError(`Unable to create assessment`);
      }
    });
  };

const updateAssessment =
  (complaintIdentifier: string, caseIdentifier: string, assessment: Assessment): AppThunk =>
  async (dispatch, getState) => {
    const {
      codeTables: { "assessment-type": assessmentType },
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
          actionJustificationCode: assessment.justification?.value,
          actions: assessment.assessment_type.map((item) => {
            return {
              actor: assessment.officer?.value,
              date: assessment.date,
              actionCode: item.value,
              activeIndicator: true,
            };
          }),
        },
      },
    } as UpdateAssessmentInput;
    let {
      updateAssessmentInput: {
        assessmentDetails: { actions },
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
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/updateAssessment`, updateAssessmentInput);
    await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
      const updatedAssessmentData = await parseAssessmentResponse(res, officers);
      if (res) {
        dispatch(setAssessment({ assessment: updatedAssessmentData }));
        ToggleSuccess(`Assessment has been updated`);
      } else {
        await dispatch(getAssessment(complaintIdentifier));
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
      .filter((person) => person.person_guid.person_guid === actor)
      .map((officer) => {
        return `${officer.person_guid.first_name} ${officer.person_guid.last_name}`;
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
      assessment_type: res.assessmentDetails.actions
        .filter((action) => {
          return action.activeIndicator;
        })
        .map((action) => {
          return { key: action.longDescription, value: action.actionCode };
        }),
    } as Assessment;
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
      .filter((person) => person.person_guid.person_guid === actor)
      .map((officer) => {
        return `${officer.person_guid.first_name} ${officer.person_guid.last_name}`;
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
  (id: string, note: string): ThunkAction<Promise<string | undefined>, RootState, unknown, Action<string>> =>
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
          agencyCode: "COS",
          caseCode: "HWCR",
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
      ): ThunkAction<Promise<CaseFileDto>, RootState, unknown, Action<CaseFileDto>> =>
      async (dispatch) => {
        const caseId = await dispatch(findCase(id));

        const input: UpdateSupplementalNotesInput = {
          note,
          caseIdentifier: caseId as UUID,
          actor,
          updateUserId: userId,
        };

        const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/note`, input);
        return await patch<CaseFileDto>(dispatch, parameters);
      };

    const officer = officers.find((item) => item.user_id === idir);

    let result;
    if (!currentNote?.action) {
      result = await dispatch(_createNote(id, note, officer ? officer.officer_guid : "", idir));
      if (result !== null) {
        ToggleSuccess("Supplemental note created");
      } else {
        ToggleError("Error, unable to create supplemental note");
      }
    } else {
      result = await dispatch(_updateNote(id as UUID, note, officer ? officer.officer_guid : "", idir));

      if (result !== null) {
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
        if (!caseId) {
          dispatch(setCaseId(res.caseIdentifier));
        }
        dispatch(setIsReviewedRequired(res.isReviewRequired));
        if (res.reviewComplete) {
          dispatch(setReviewComplete(res.reviewComplete));
        }
        ToggleSuccess("File review has been updated");
      } else {
        ToggleError("Unable to update file review");
      }
    });
  };

export const updateReview =
  (complaintId: string, isReviewRequired: boolean): AppThunk =>
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
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/review`, reviewInput);
    await patch<CaseFileDto>(dispatch, parameters).then(async (res) => {
      if (res) {
        dispatch(setIsReviewedRequired(res.isReviewRequired));
        ToggleSuccess("File review has been updated");
      } else {
        ToggleError("Unable to update file review");
      }
    });
  };

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
      userId: profile.idir_username,
    };
    
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/case/equipment`, deleteEquipmentInput);
      await deleteMethod<boolean>(dispatch, parameters).then(async (res) => {
        if (res) {
          // remove equipment from state
          const { cases: { equipment } } =  getState();
          const updatedEquipment = equipment?.filter(equipment => equipment.id !== id);
          
          dispatch(setCaseFile({ equipment: updatedEquipment }));
          ToggleSuccess(`Equipment has been deleted`);
        } else {
          ToggleError(`Unable to update equipment`);
        }
      });
     }

  export const upsertEquipment =
  (complaintIdentifier: string, equipment: EquipmentDetailsDto): AppThunk =>
  async (dispatch, getState) => {
    if (!equipment) {
      return;
    }

    const {
      app: { profile },
    } = getState();
    // equipment does not exist, let's create it
    if (complaintIdentifier
       && !equipment.id) {
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
          ToggleSuccess(`Equipment has been updated`);
        } else {
          ToggleError(`Unable to update equipment`);
        }
      });
    } else { // equipment exists, we're updating it here
      let updateEquipmentInput = {
        updateEquipmentInput: {
          leadIdentifier: complaintIdentifier,
          createUserId: profile.idir_username,
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
    }
    
