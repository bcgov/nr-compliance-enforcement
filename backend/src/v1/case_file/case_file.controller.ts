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
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { CaseFileDto } from "../../types/models/case-files/case-file";
import { Token } from "../../auth/decorators/token.decorator";
import { CreateSupplementalNotesInput } from "../../types/models/case-files/supplemental-notes/create-supplemental-notes-input";
import { UpdateSupplementalNotesInput } from "../../types/models/case-files/supplemental-notes/update-supplemental-note-input";
import { DeleteSupplementalNotesInput } from "../../types/models/case-files/supplemental-notes/delete-supplemental-notes-input";
import { FileReviewInput } from "../../types/models/case-files/file-review-input";
import { CreateWildlifeInput } from "../../types/models/case-files/wildlife/create-wildlife-input";
import { DeleteWildlifeInput } from "../../types/models/case-files/wildlife/delete-wildlife-outcome";
import { UpdateWildlifeInput } from "../../types/models/case-files/wildlife/update-wildlife-input";
import { CreateDecisionInput } from "../../types/models/case-files/ceeb/decision/create-decision-input";
import { UpdateDecisionInput } from "../../types/models/case-files/ceeb/decision/update-decison-input";
import { CreateAuthorizationOutcomeInput } from "../../types/models/case-files/ceeb/site/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "../../types/models/case-files/ceeb/site/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "../../types/models/case-files/ceeb/site/delete-authorization-outcome-input";
import { CaseManagementError } from "src/enum/case_management_error.enum";

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
  @Roles(Role.COS)
  async createEquipment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createEquipment(token, model);
  }

  @Patch("/equipment")
  @Roles(Role.COS)
  async updateEquipment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updateEquipment(token, model);
  }

  @Delete("/equipment")
  @Roles(Role.COS)
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
  @Roles(Role.COS)
  async createAssessment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createAssessment(token, model);
  }

  @Patch("/updateAssessment")
  @Roles(Role.COS)
  async updateAssessment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updateAssessment(token, model);
  }

  @Post("/createPrevention")
  @Roles(Role.COS)
  async createPrevention(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createPrevention(token, model);
  }

  @Patch("/updatePrevention")
  @Roles(Role.COS)
  async updatePrevention(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updatePrevention(token, model);
  }

  @Post("/review")
  @Roles(Role.COS)
  async createReview(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createReview(token, model);
  }

  @Patch("/review")
  @Roles(Role.COS)
  async updateReview(@Token() token, @Body() model: FileReviewInput): Promise<CaseFileDto> {
    return await this.service.updateReview(token, model);
  }

  @Get("/:complaint_id")
  @Roles(Role.COS, Role.CEEB)
  find(@Param("complaint_id") complaint_id: string, @Token() token) {
    return this.service.find(complaint_id, token);
  }

  @Post("/note")
  @Roles(Role.COS, Role.CEEB)
  async createNote(@Token() token, @Body() model: CreateSupplementalNotesInput): Promise<CaseFileDto> {
    return await this.service.createNote(token, model);
  }

  @Patch("/note")
  @Roles(Role.COS, Role.CEEB)
  async UpdateNote(@Token() token, @Body() model: UpdateSupplementalNotesInput): Promise<CaseFileDto> {
    return await this.service.updateNote(token, model);
  }

  @Delete("/note")
  @Roles(Role.COS, Role.CEEB)
  async deleteNote(
    @Token() token,
    @Query("caseIdentifier") caseIdentifier: string,
    @Query("actor") actor: string,
    @Query("updateUserId") updateUserId: string,
    @Query("actionId") actionId: string,
  ): Promise<CaseFileDto> {
    const input = {
      caseIdentifier,
      actor,
      updateUserId,
      actionId,
    };

    return await this.service.deleteNote(token, input as DeleteSupplementalNotesInput);
  }

  @Post("/wildlife")
  @Roles(Role.COS)
  async createWildlife(@Token() token, @Body() model: CreateWildlifeInput): Promise<CaseFileDto> {
    return await this.service.createWildlife(token, model);
  }

  @Patch("/wildlife")
  @Roles(Role.COS)
  async updateWildlife(@Token() token, @Body() model: UpdateWildlifeInput): Promise<CaseFileDto> {
    return await this.service.updateWildlife(token, model);
  }

  @Delete("/wildlife")
  @Roles(Role.COS)
  async deleteWildlife(
    @Token() token,
    @Query("caseIdentifier") caseIdentifier: string,
    @Query("actor") actor: string,
    @Query("updateUserId") updateUserId: string,
    @Query("outcomeId") outcomeId: string,
  ): Promise<CaseFileDto> {
    const input = {
      caseIdentifier,
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
    @Query("updateUserId") updateUserId: string,
    @Query("id") id: string,
  ): Promise<CaseFileDto> {
    const input = {
      caseIdentifier,
      updateUserId,
      id,
    };

    return await this.service.deleteAuthorizationOutcome(token, input as DeleteAuthorizationOutcomeInput);
  }
}
