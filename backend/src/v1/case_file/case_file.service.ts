import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { get, post } from "../../external_api/case_management";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { REQUEST } from "@nestjs/core";
import { AxiosResponse, AxiosError } from "axios";
import { CreateSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/create-supplemental-notes-input";
import { UpdateSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/update-supplemental-note-input";
import { DeleteSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/delete-supplemental-notes-input";
import { DeleteEquipmentDto } from "src/types/models/case-files/supplemental-notes/equipment/delete-equipment-dto";

@Injectable({ scope: Scope.REQUEST })
export class CaseFileService {
  private readonly logger = new Logger(CaseFileService.name);
  private mapper: Mapper;

  private caseFileQueryFields: string = `
  {
    caseIdentifier
    leadIdentifier
    assessmentDetails {
      actionNotRequired
      actionJustificationCode
      actionJustificationShortDescription
      actionJustificationLongDescription
      actionJustificationActiveIndicator
      actions {
        actionGuid
        actor
        date
        actionCode
        shortDescription
        longDescription
        activeIndicator
      }
    }
    isReviewRequired
    reviewComplete {
      actor
      date
      actionCode
    }
    preventionDetails {
      actions {
        actionGuid
        actor
        date
        actionCode
        shortDescription
        longDescription
        activeIndicator
      }
    }
    note {
      note 
      action { 
        actor
        actionCode
        date,
        actionGuid
      }
    }
    equipment {
      equipmentGuid
      equipmentTypeCode
      equipmentTypeActiveIndicator
      address
      xCoordinate
      yCoordinate
      actions { 
        actionGuid
        actor
        actionCode
        date
      }
    }
  }
  `;

  constructor(@Inject(REQUEST) private request: Request, @InjectMapper() mapper) {
    this.mapper = mapper;
  }

  find = async (complaint_id: string, token: string): Promise<CaseFileDto> => {
    const { data } = await get(token, {
      query: `{getCaseFileByLeadId (leadIdentifier: "${complaint_id}")
        ${this.caseFileQueryFields}
      }`,
    });

    if (data?.getCaseFileByLeadId?.caseIdentifier) {
      const caseFileDto = data.getCaseFileByLeadId as CaseFileDto;
      return caseFileDto;
    } else {
      this.logger.error(`Case with complaint Id ${complaint_id} not found.`);
      return null;
    }
  };

  createAssessment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreateAssessment($createAssessmentInput: CreateAssessmentInput!) {
        createAssessment(createAssessmentInput: $createAssessmentInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createAssessment;
  };

  updateAssessment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateAssessment($updateAssessmentInput: UpdateAssessmentInput!) {
        updateAssessment(updateAssessmentInput: $updateAssessmentInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateAssessment;
  };

  createReview = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreateReview($reviewInput: ReviewInput!) {
        createReview(reviewInput: $reviewInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createReview;
  };

  updateReview = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateReview($reviewInput: ReviewInput!) {
        updateReview(reviewInput: $reviewInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateReview;
  };

  createPrevention = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreatePrevention($createPreventionInput: CreatePreventionInput!) {
        createPrevention(createPreventionInput: $createPreventionInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createPrevention;
  };

  updatePrevention = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdatePrevention($updatePreventionInput: UpdatePreventionInput!) {
        updatePrevention(updatePreventionInput: $updatePreventionInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updatePrevention;
  };

  private handleAPIResponse = async (result: { response: AxiosResponse; error: AxiosError }): Promise<any> => {
    if (result?.response?.data?.data) {
      const caseFileDto = result.response.data.data;
      return caseFileDto;
    } else if (result?.response?.data?.errors) {
      this.logger.error(`Error occurred. ${JSON.stringify(result.response.data.errors)}`);
      return null;
    } else if (result?.error) {
      this.logger.error(`Error occurred. ${JSON.stringify(result.error)}`);
    } else {
      this.logger.error(`Unknwown error occurred during web request`);
      return null;
    }
  };

  createEquipment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const mutationQuery = {
      query: `mutation CreateEquipment($createEquipmentInput: CreateEquipmentInput!) {
        createEquipment(createEquipmentInput: $createEquipmentInput)
          ${this.caseFileQueryFields}
      }`,
      variables: model,
    };

    this.logger.debug(mutationQuery);

    const result = await post(token, mutationQuery);

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createEquipment;
  };

  updateEquipment = async (token: string, model: CaseFileDto): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateEquipment($updateEquipmentInput: UpdateEquipmentInput!) {
        updateEquipment(updateEquipmentInput: $updateEquipmentInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model,
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateEquipment;
  };

  deleteEquipment = async (token: string, model: DeleteEquipmentDto): Promise<boolean> => {
    const result = await post(token, {
      query: `mutation DeleteEquipment($deleteEquipmentInput: DeleteEquipmentInput!) {
        deleteEquipment(deleteEquipmentInput: $deleteEquipmentInput) 
      }`,
      variables: {
        deleteEquipmentInput: model, // Ensure that the key matches the name of the variable in your mutation
      },
    });
    const returnValue = await this.handleAPIResponse(result);
    return returnValue;
  };

  createNote = async (token: any, model: CreateSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreateNote($input: CreateSupplementalNoteInput!) {
        createNote(input: $input) {
          caseIdentifier
          note { note, action { actor,date,actionCode, actionGuid } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createNote;
  };

  updateNote = async (token: any, model: UpdateSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateNote($input: UpdateSupplementalNoteInput!) {
        updateNote(input: $input) {
          caseIdentifier
          note { note, action { actor,date,actionCode,actionGuid } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateNote;
  };

  deleteNote = async (token: any, model: DeleteSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation DeleteNote($input: DeleteSupplementalNoteInput!) {
        deleteNote(input: $input) {
          caseIdentifier
          note { note, action { actor,date,actionCode,actionGuid } }
        }
      }`,
      variables: { input: model },
    });

    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.deleteNote;
  };
}
