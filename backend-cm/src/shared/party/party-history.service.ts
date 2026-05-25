import { Injectable } from "@nestjs/common";
import { withRlsBypass } from "../../pg-session-extension/with-rls-bypass";
import { InvestigationService } from "../../investigation/investigation/investigation.service";
import { InspectionService } from "../../inspection/inspection/inspection.service";
import { CaseFileService } from "../case_file/case_file.service";

@Injectable()
export class PartyHistoryService {
  constructor(
    private readonly investigationService: InvestigationService,
    private readonly inspectionService: InspectionService,
    private readonly caseFileService: CaseFileService,
  ) {}

  findInvestigationsByParty(partyId: string, partyType: string) {
    // Bypass RLS to get history across all agencies
    return withRlsBypass(() => this.investigationService.findManyByParty(partyId, partyType));
  }

  findInspectionsByParty(partyId: string, partyType: string) {
    // Bypass RLS to get history across all agencies
    return withRlsBypass(() => this.inspectionService.findManyByParty(partyId, partyType));
  }

  findCaseFilesByActivityIds(activityIdentifiers: string[]) {
    // Bypass RLS to get history across all agencies
    return withRlsBypass(() => this.caseFileService.findCaseFilesByActivityIds(activityIdentifiers));
  }
}
