import { Controller, Get, Body, Patch, Param, UseGuards, Post, Delete, Query } from "@nestjs/common";
import { CaseFileService } from "./case_file.service";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { CaseFileDto } from "src/types/models/case-files/case-file";
import { Token } from "src/auth/decorators/token.decorator";
import { CreateSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/create-supplemental-notes-input";
import { UpdateSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/update-supplemental-note-input";
import { DeleteSupplementalNotesInput } from "src/types/models/case-files/supplemental-notes/delete-supplemental-notes-input";
import { FileReviewInput } from "src/types/models/case-files/file-review-input";
import { CreateWildlifeInput } from "src/types/models/case-files/wildlife/create-wildlife-input";
import { DeleteWildlifeInput } from "src/types/models/case-files/wildlife/delete-wildlife-outcome";
import { UpdateWildlifeInput } from "src/types/models/case-files/wildlife/update-wildlife-input";

@UseGuards(JwtRoleGuard)
@ApiTags("case")
@Controller({
  path: "case",
  version: "1",
})
export class CaseFileController {
  constructor(private readonly service: CaseFileService) {}

  @Post("/equipment")
  @Roles(Role.COS_OFFICER)
  async createEquipment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createEquipment(token, model);
  }

  @Patch("/equipment")
  @Roles(Role.COS_OFFICER)
  async updateEquipment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updateEquipment(token, model);
  }

  @Delete("/equipment")
  @Roles(Role.COS_OFFICER)
  async deleteEquipment(
    @Token() token,
    @Query("id") id: string,
    @Query("updateUserId") userId: string,
  ): Promise<boolean> {
    const deleteEquipment = {
      id: id,
      updateUserId: userId,
    };
    return await this.service.deleteEquipment(token, deleteEquipment);
  }

  @Post("/createAssessment")
  @Roles(Role.COS_OFFICER)
  async createAssessment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createAssessment(token, model);
  }

  @Patch("/updateAssessment")
  @Roles(Role.COS_OFFICER)
  async updateAssessment(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updateAssessment(token, model);
  }

  @Post("/createPrevention")
  @Roles(Role.COS_OFFICER)
  async createPrevention(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createPrevention(token, model);
  }

  @Patch("/updatePrevention")
  @Roles(Role.COS_OFFICER)
  async updatePrevention(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.updatePrevention(token, model);
  }

  @Post("/review")
  @Roles(Role.COS_OFFICER)
  async createReview(@Token() token, @Body() model: CaseFileDto): Promise<CaseFileDto> {
    return await this.service.createReview(token, model);
  }

  @Patch("/review")
  @Roles(Role.COS_OFFICER)
  async updateReview(@Token() token, @Body() model: FileReviewInput): Promise<CaseFileDto> {
    return await this.service.updateReview(token, model);
  }

  @Get("/:complaint_id")
  @Roles(Role.COS_OFFICER)
  find(@Param("complaint_id") complaint_id: string, @Token() token) {
    return this.service.find(complaint_id, token);
  }

  @Post("/note")
  @Roles(Role.COS_OFFICER)
  async createNote(@Token() token, @Body() model: CreateSupplementalNotesInput): Promise<CaseFileDto> {
    return await this.service.createNote(token, model);
  }

  @Patch("/note")
  @Roles(Role.COS_OFFICER)
  async UpdateNote(@Token() token, @Body() model: UpdateSupplementalNotesInput): Promise<CaseFileDto> {
    return await this.service.updateNote(token, model);
  }

  @Delete("/note")
  @Roles(Role.COS_OFFICER)
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
  @Roles(Role.COS_OFFICER)
  async createWildlife(@Token() token, @Body() model: CreateWildlifeInput): Promise<CaseFileDto> {
    return await this.service.createWildlife(token, model);
  }

  @Patch("/wildlife")
  @Roles(Role.COS_OFFICER)
  async updateWildlife(@Token() token, @Body() model: UpdateWildlifeInput): Promise<CaseFileDto> {
    return await this.service.updateWildlife(token, model);
  }

  @Delete("/wildlife")
  @Roles(Role.COS_OFFICER)
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
}
