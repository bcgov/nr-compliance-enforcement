import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { get, post } from "../../external_api/case_management";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { REQUEST } from "@nestjs/core";
import { AxiosResponse, AxiosError } from "axios";
import { CreateSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/create-supplemental-notes-input";
import { UpdateSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/update-supplemental-note-input";

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
        actor
        date
        actionCode
        shortDescription
        longDescription
        activeIndicator
      }
    }
    preventionDetails {
      actions {
        actor
        date
        actionCode
        shortDescription
        longDescription
        activeIndicator
      }
    }
  }
  `;
  
  constructor(@Inject(REQUEST) private request: Request, @InjectMapper() mapper) {
    this.mapper = mapper;
  }

  find = async (
    complaint_id: string,
    token: string
  ): Promise<CaseFileDto> => {

    const { data } = await get(token, {
      query: `{getCaseFileByLeadId (leadIdentifier: "${complaint_id}")
        ${this.caseFileQueryFields}
      }`
    });
    if (data?.getCaseFileByLeadId?.caseIdentifier) {
      const caseFileDto = data.getCaseFileByLeadId as CaseFileDto;
      return caseFileDto;
    } else {
      this.logger.error(`Case with complaint Id ${complaint_id} not found.`);
      return null;
    }
  }

  createAssessment = async (
    token: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {

    const result = await post(token, {
      query: `mutation CreateAssessment($createAssessmentInput: CreateAssessmentInput!) {
        createAssessment(createAssessmentInput: $createAssessmentInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model
    },
    );
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createAssessment;
  }

 updateAssessment = async (
    token: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {

    const result = await post(token, {
      query: `mutation UpdateAssessment($updateAssessmentInput: UpdateAssessmentInput!) {
        updateAssessment(updateAssessmentInput: $updateAssessmentInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model
    },
    );
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updateAssessment;

  }


  createPrevention = async (
    token: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {

    const result = await post(token, {
      query: `mutation CreatePrevention($createPreventionInput: CreatePreventionInput!) {
        createPrevention(createPreventionInput: $createPreventionInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model
    },
    );
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.createPrevention;
  }

  updatePrevention = async (
    token: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {
    
    const result = await post(token, {
      query: `mutation UpdatePrevention($updatePreventionInput: UpdatePreventionInput!) {
        updatePrevention(updatePreventionInput: $updatePreventionInput) 
        ${this.caseFileQueryFields}
      }`,
      variables: model
    },
    );
    const returnValue = await this.handleAPIResponse(result);
    return returnValue?.updatePrevention;

  }

 private handleAPIResponse = async (result: { response: AxiosResponse, error: AxiosError }):
    Promise<any> => {
    if (result?.response?.data?.data) {
      const caseFileDto = result.response.data.data;
      return caseFileDto;
    } else if (result?.response?.data?.errors) {
      this.logger.error(`Error occurred. ${JSON.stringify(result.response.data.errors)}`);
      return null;
    }
    else if (result?.error) {
      this.logger.error(`Error occurred. ${JSON.stringify(result.error)}`);
    } else {
      this.logger.error(`Unknwown error occurred during web request`);
      return null;
    }
  }

  createNote = async (token: any, model: CreateSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation CreateNote($input: CreateSupplementalNoteInput!) {
        createNote(input: $input) {
          note { note, action { actor,date,action } }
        }
      }`,
      variables: { input: model },
    });
    const returnValue = await this.handleAPIResponse(result);

    return returnValue?.createNotes;
  };

  updateNote = async (token: any, model: UpdateSupplementalNotesInput): Promise<CaseFileDto> => {
    const result = await post(token, {
      query: `mutation UpdateNote($input: UpdateSupplementalNoteInput!) {
        updateNote(input: $input) {
          note { note, action { actor,date,action } }
        }
      }`,
      variables: { input: model },
    });
    const returnValue = await this.handleAPIResponse(result);

    return returnValue?.updateNotes;
  };
}
