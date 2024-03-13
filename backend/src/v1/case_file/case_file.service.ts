
import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { get, post } from "../../external_api/case_management";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class CaseFileService {
  private readonly logger = new Logger(CaseFileService.name);
  private mapper: Mapper;
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectMapper() mapper,
  ) {
    this.mapper = mapper;
  }

  find = async (
    complaint_id: string,
    token: string
  ): Promise<CaseFileDto> => {

    const { data } = await get(token, {
      query: `{getCaseFileByLeadId (leadIdentifier: "${complaint_id}")
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
      }}`
    });
    if (data && data.getCaseFileByLeadId && data.getCaseFileByLeadId.caseIdentifier) {
      const caseFileDto = data.getCaseFileByLeadId as CaseFileDto;
      return caseFileDto;
    } else {
      this.logger.error(`Case with complaint Id ${complaint_id} not found.`);
      return null;
    }
  }

  create = async (
    token: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {

    const result = await post(token, {
      query: `mutation CreateAssessment($createAssessmentInput: CreateAssessmentInput!) {
        createAssessment(createAssessmentInput: $createAssessmentInput) {
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
        }
      }`,
      variables: model
    },
    );
    if (result?.response?.data?.data) {
      const caseFileDto = result.response.data.data as CaseFileDto;
      return caseFileDto;
    } else {

      if (result?.response?.data?.errors) {
        this.logger.error(`Error occurred. ${JSON.stringify(result.response.data.errors)}`);
        return null;
      }
      else {
        this.logger.error(`Unknwown error occurred during web request`);
        return null;
      }
    }
  }

  update = async (
    token: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {

    const result = await post(token, {
      query: `mutation UpdateAssessment($updateAssessmentInput: UpdateAssessmentInput!) {
        updateAssessment(updateAssessmentInput: $updateAssessmentInput) {
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
        }
      }`,
      variables: model
    },
    );
    if (result?.response?.data?.data) {
      const caseFileDto = result.response.data.data as CaseFileDto;
      return caseFileDto;
    } else {

      if (result?.response?.data?.errors) {
        this.logger.error(`Error occurred. ${JSON.stringify(result.response.data.errors)}`);
        return null;
      }
      else {
        this.logger.error(`Unknwown error occurred during web request`);
        return null;
      }
    }
  }
}
