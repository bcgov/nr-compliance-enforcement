import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Post,
  Delete,
  Query,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { CaseFileService } from "./case_file.service";
import { Role, coreRoles } from "../../../enum/role.enum";
import { Roles } from "../../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { CaseFileDto } from "../../../types/models/case-files/case-file";
import { Token } from "../../../auth/decorators/token.decorator";
import { CreateNoteInput } from "../../../types/models/case-files/notes/create-note-input";
import { UpdateNoteInput } from "../../../types/models/case-files/notes/update-note-input";
import { DeleteNoteInput } from "../../../types/models/case-files/notes/delete-note-input";
import { FileReviewInput } from "../../../types/models/case-files/file-review-input";
import { CreateWildlifeInput } from "../../../types/models/case-files/wildlife/create-wildlife-input";
import { DeleteWildlifeInput } from "../../../types/models/case-files/wildlife/delete-wildlife-outcome";
import { UpdateWildlifeInput } from "../../../types/models/case-files/wildlife/update-wildlife-input";
import { CreateDecisionInput } from "../../../types/models/case-files/ceeb/decision/create-decision-input";
import { UpdateDecisionInput } from "../../../types/models/case-files/ceeb/decision/update-decison-input";
import { CreateAuthorizationOutcomeInput } from "../../../types/models/case-files/ceeb/site/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "../../../types/models/case-files/ceeb/site/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "../../../types/models/case-files/ceeb/site/delete-authorization-outcome-input";
import { CaseManagementError } from "src/enum/case_management_error.enum";
import { UpdateAssessmentInput } from "src/types/models/case-files/assessment/update-assessment-input";
import { CreateAssessmentInput } from "src/types/models/case-files/assessment/create-assessment-input";
import { UpdatePreventionInput } from "src/types/models/case-files/prevention/update-prevention-input";
import { CreatePreventionInput } from "src/types/models/case-files/prevention/create-prevention-input";
import { DeletePreventionInput } from "src/types/models/case-files/prevention/delete-prevention-input";

@UseGuards(JwtRoleGuard)
@ApiTags("case")
@Controller({
  path: "case",
  version: "1",
})
export class CaseFileController {
  constructor(private readonly service: CaseFileService) {}
  private readonly logger = new Logger(CaseFileController.name);

  @Post("/equipment")
  @Roles(Role.COS, Role.PARKS)
  async createEquipment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createEquipment(token, model);
  }

  @Patch("/equipment")
  @Roles(Role.COS, Role.PARKS)
  async updateEquipment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updateEquipment(token, model);
  }

  @Delete("/equipment")
  @Roles(Role.COS, Role.PARKS)
  async deleteEquipment(
    @Token() token,
    @Query("id") id: string,
    @Query("updateUserId") userId: string,
    @Query("leadIdentifier") leadIdentifier: string,
  ): Promise<boolean> {
    const deleteEquipment = {
      id: id,
      updateUserId: userId,
      leadIdentifier: leadIdentifier,
    };
    return await this.service.deleteEquipment(token, deleteEquipment);
  }

  @Post("/createAssessment")
  @Roles(Role.COS, Role.PARKS)
  async createAssessment(@Token() token, @Body() model: CreateAssessmentInput): Promise<CaseFileDto> {
    return await this.service.createAssessment(token, model);
  }

  @Patch("/updateAssessment")
  @Roles(Role.COS, Role.PARKS)
  async updateAssessment(@Token() token, @Body() model: UpdateAssessmentInput): Promise<CaseFileDto> {
    return await this.service.updateAssessment(token, model);
  }

  @Post("/createPrevention")
  @Roles(Role.COS, Role.PARKS)
  async createPrevention(@Token() token, @Body() model: CreatePreventionInput): Promise<CaseFileDto> {
    return await this.service.createPrevention(token, model);
  }

  @Patch("/updatePrevention")
  @Roles(Role.COS, Role.PARKS)
  async updatePrevention(@Token() token, @Body() model: UpdatePreventionInput): Promise<CaseFileDto> {
    return await this.service.updatePrevention(token, model);
  }

  @Delete("/prevention")
  @Roles(coreRoles)
  async deletePrevention(
    @Token() token,
    @Query("id") id: string,
    @Query("leadIdentifier") leadIdentifier: string,
    @Query("updateUserId") updateUserId: string,
  ): Promise<CaseFileDto> {
    const input = {
      id,
      leadIdentifier,
      updateUserId,
    };

    return await this.service.deletePrevention(token, input as DeletePreventionInput);
  }

  @Post("/review")
  @Roles(Role.COS, Role.PARKS)
  async createReview(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createReview(token, model);
  }

  @Patch("/review")
  @Roles(Role.COS, Role.PARKS)
  async updateReview(@Token() token, @Body() model: FileReviewInput): Promise<CaseFileDto> {
    return await this.service.updateReview(token, model);
  }

  @Get("/:complaint_id")
  @Roles(coreRoles)
  find(@Param("complaint_id") complaint_id: string, @Token() token) {
    return this.service.find(complaint_id, token);
  }

  @Post("/note")
  @Roles(coreRoles)
  async createNote(@Token() token, @Body() model: CreateNoteInput): Promise<CaseFileDto> {
    return await this.service.createNote(token, model);
  }

  @Patch("/note")
  @Roles(coreRoles)
  async UpdateNote(@Token() token, @Body() model: UpdateNoteInput): Promise<CaseFileDto> {
    return await this.service.updateNote(token, model);
  }

  @Delete("/note")
  @Roles(coreRoles)
  async deleteNote(
    @Token() token,
    @Query("id") id: string,
    @Query("caseIdentifier") caseIdentifier: string,
    @Query("actor") actor: string,
    @Query("updateUserId") updateUserId: string,
  ): Promise<CaseFileDto> {
    const input = {
      id,
      caseIdentifier,
      actor,
      updateUserId,
    };

    return await this.service.deleteNote(token, input as DeleteNoteInput);
  }

  @Post("/wildlife")
  @Roles(Role.COS, Role.PARKS)
  async createWildlife(@Token() token, @Body() model: CreateWildlifeInput): Promise<CaseFileDto> {
    return await this.service.createWildlife(token, model);
  }

  @Patch("/wildlife")
  @Roles(Role.COS, Role.PARKS)
  async updateWildlife(@Token() token, @Body() model: UpdateWildlifeInput): Promise<CaseFileDto> {
    return await this.service.updateWildlife(token, model);
  }

  @Delete("/wildlife")
  @Roles(Role.COS, Role.PARKS)
  async deleteWildlife(
    @Token() token,
    @Query("caseIdentifier") caseIdentifier: string,
    @Query("leadIdentifier") leadIdentifier: string,
    @Query("actor") actor: string,
    @Query("updateUserId") updateUserId: string,
    @Query("outcomeId") outcomeId: string,
  ): Promise<CaseFileDto> {
    const input = {
      caseIdentifier,
      leadIdentifier,
      actor,
      updateUserId,
      wildlifeId: outcomeId,
    };

    return await this.service.deleteWildlife(token, input as DeleteWildlifeInput);
  }

  @Post("/decision")
  @Roles(Role.CEEB)
  async createDecision(@Token() token, @Body() model: CreateDecisionInput): Promise<CaseFileDto> {
    const result = await this.service.createDecision(token, model);
    if (result === CaseManagementError.DECISION_ACTION_EXIST) {
      throw new HttpException("Decision Action Exist", HttpStatus.CONFLICT);
    } else {
      return result;
    }
  }

  @Patch("/decision")
  @Roles(Role.CEEB)
  async updateDecision(@Token() token, @Body() model: UpdateDecisionInput): Promise<CaseFileDto> {
    return await this.service.updateDecision(token, model);
  }

  @Post("/site")
  @Roles(Role.CEEB)
  async createAuthorizationOutcome(
    @Token() token,
    @Body() model: CreateAuthorizationOutcomeInput,
  ): Promise<CaseFileDto> {
    return await this.service.createAuthorizationOutcome(token, model);
  }

  @Patch("/site")
  @Roles(Role.CEEB)
  async updateAuthorizationOutcome(
    @Token() token,
    @Body() model: UpdateAuthorizationOutcomeInput,
  ): Promise<CaseFileDto> {
    return await this.service.updateAuthorizationOutcome(token, model);
  }

  @Delete("/site")
  @Roles(Role.CEEB)
  async deleteAuthorizationOutcome(
    @Token() token,
    @Query("caseIdentifier") caseIdentifier: string,
    @Query("leadIdentifier") leadIdentifier: string,
    @Query("updateUserId") updateUserId: string,
    @Query("id") id: string,
  ): Promise<CaseFileDto> {
    const input = {
      caseIdentifier,
      leadIdentifier,
      updateUserId,
      id,
    };

    return await this.service.deleteAuthorizationOutcome(token, input as DeleteAuthorizationOutcomeInput);
  }
}
