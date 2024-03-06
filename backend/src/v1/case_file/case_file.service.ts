
import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { get } from "../../external_api/case_management";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { AssessmentDetailsDto } from "src/types/models/case-files/assessment-details";
import { AssessmentActionDto } from "src/types/models/case-files/assessment-action";
import { CodeTableService } from "../code-table/code-table.service";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class CaseFileService {
  private readonly logger = new Logger(CaseFileService.name);
  private mapper: Mapper;
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectMapper() mapper,
    private readonly _codeTableService: CodeTableService,
  ) {
    this.mapper = mapper;
  }

  find = async (
    complaint_id: string,
    token: string
  ): Promise<CaseFileDto> => {

    const { data } = await get(token, {
      query: `{getCaseFileByLeadId (lead_identifier: "${complaint_id}")
      {
        case_file_guid
        lead_identifier
        assessment_details {
        action_not_required_ind
          inaction_reason_code
          short_description
          long_description
          active_ind
          assessment_actions {
            actor_guid
            action_date
            action_code
            short_description
            long_description
            active_ind
          }
        }
      }}`
    });
    const queryResult = data.getCaseFileByLeadId;
    const caseFileDto: CaseFileDto = {
      caseFileGuid: queryResult.case_file_guid,
      leadIdentifier: queryResult.lead_identifier,
      assessmentDetails: {
        actionNotRequiredInd: queryResult.assessment_details.action_not_required_ind,
        inactionReasonCode: queryResult.assessment_details.inaction_reason_code,
        shortDescription: queryResult.assessment_details.short_description,
        longDescription: queryResult.assessment_details.long_description,
        activeId: queryResult.assessment_details.active_ind,
        assessmentActions: queryResult.assessment_details.assessment_actions.map(
          ({
            actor_guid,
            action_date,
            action_code,
            short_description,
            long_description,
            active_ind
          }) => {
            const assessmentActionsData: AssessmentActionDto = {
              actorGuid: actor_guid,
              actionDate: action_date,
              actionCode: action_code,
              shortDescription: short_description,
              longDescription: long_description,
              activeInd: active_ind
            };
            return assessmentActionsData;
          }
        )
      } as AssessmentDetailsDto
    };
    return caseFileDto;
  }

  create = async (
    complaint_id: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {
    return new Promise<CaseFileDto>(null);
  }

  update = async (
    complaint_id: string,
    model: CaseFileDto
  ): Promise<CaseFileDto> => {
    return new Promise<CaseFileDto>(null);
  }
}
