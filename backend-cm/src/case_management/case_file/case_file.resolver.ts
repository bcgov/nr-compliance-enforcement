import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CaseFileService } from "./case_file.service";
import { CreateAssessmentInput, CreateEquipmentInput, CreatePreventionInput } from "./dto/create-case_file.input";
import { UpdateAssessmentInput, UpdateEquipmentInput, UpdatePreventionInput } from "./dto/update-case_file.input";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role, coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ReviewInput } from "./dto/review-input";
import { CreateNoteInput } from "./dto/note/create-note.input";
import { UpdateNoteInput } from "./dto/note/update-note.input";
import { DeleteNoteInput } from "./dto/note/delete-note.input";
import { DeleteEquipmentInput } from "./dto/equipment/delete-equipment.input";
import { CreateWildlifeInput } from "./dto/wildlife/create-wildlife-input";
import { DeleteWildlifeInput } from "./dto/wildlife/delete-wildlife-input";
import { UpdateWildlifeInput } from "./dto/wildlife/update-wildlife-input";
import { CreateDecisionInput } from "./dto/ceeb/decision/create-decsion-input";
import { UpdateDecisionInput } from "./dto/ceeb/decision/update-decsion-input";
import { CreateAuthorizationOutcomeInput } from "./dto/ceeb/authorization-outcome/create-authorization-outcome-input";
import { UpdateAuthorizationOutcomeInput } from "./dto/ceeb/authorization-outcome/update-authorization-outcome-input";
import { DeleteAuthorizationOutcomeInput } from "./dto/ceeb/authorization-outcome/delete-authorization-outcome-input";
import { DeletePreventionInput } from "./dto/delete-prevention.input";

@UseGuards(JwtRoleGuard)
@Resolver("CaseFile")
export class CaseFileResolver {
  constructor(private readonly caseFileService: CaseFileService) {}

  @Mutation("createAssessment")
  @Roles(Role.COS, Role.PARKS)
  createAssessment(@Args("input") input: CreateAssessmentInput) {
    return this.caseFileService.createAssessment(input);
  }

  @Mutation("createPrevention")
  @Roles(Role.COS, Role.PARKS)
  createPrevention(@Args("input") createPreventionInput: CreatePreventionInput) {
    return this.caseFileService.createPrevention(createPreventionInput);
  }

  @Mutation("createReview")
  @Roles(Role.COS, Role.PARKS)
  createReview(@Args("reviewInput") reviewInput: ReviewInput) {
    return this.caseFileService.createReview(reviewInput);
  }

  @Query("getCaseFile")
  @Roles(coreRoles)
  findOne(@Args("caseIdentifier") caseIdentifier: string) {
    return this.caseFileService.findOne(caseIdentifier);
  }

  @Query("getCaseFileByLeadId")
  @Roles(coreRoles)
  findOneByLeadId(@Args("leadIdentifier") leadIdentifier: string) {
    return this.caseFileService.findOneByLeadId(leadIdentifier);
  }

  @Query("getCaseFilesByLeadId")
  @Roles(coreRoles)
  findManyByLeadId(@Args("leadIdentifiers") leadIdentifiers: string[]) {
    return this.caseFileService.findManyByLeadId(leadIdentifiers);
  }

  @Query("getCasesFilesBySearchString")
  @Roles(coreRoles)
  findManyBySearchString(@Args("searchString") searchString: string) {
    return this.caseFileService.findManyBySearchString(searchString);
  }

  @Mutation("updateAssessment")
  @Roles(Role.COS, Role.PARKS)
  updateAssessment(@Args("input") input: UpdateAssessmentInput) {
    return this.caseFileService.updateAssessment(input);
  }

  @Mutation("updatePrevention")
  @Roles(Role.COS, Role.PARKS)
  updatePrevention(@Args("input") updatePreventionInput: UpdatePreventionInput) {
    return this.caseFileService.updatePrevention(updatePreventionInput);
  }

  @Mutation("deletePrevention")
  @Roles(Role.COS, Role.PARKS)
  deletePrevention(@Args("input") deletePreventionInput: DeletePreventionInput) {
    return this.caseFileService.deletePrevention(deletePreventionInput);
  }

  @Mutation("createEquipment")
  @Roles(Role.COS, Role.PARKS)
  createEquipment(@Args("createEquipmentInput") createEquipmentInput: CreateEquipmentInput) {
    return this.caseFileService.createEquipment(createEquipmentInput);
  }

  @Mutation("updateEquipment")
  @Roles(Role.COS, Role.PARKS)
  updateEquipment(@Args("updateEquipmentInput") updateEquipmentInput: UpdateEquipmentInput) {
    return this.caseFileService.updateEquipment(updateEquipmentInput);
  }

  @Mutation("deleteEquipment")
  @Roles(Role.COS, Role.PARKS)
  deleteEquipment(@Args("deleteEquipmentInput") deleteEquipmentInput: DeleteEquipmentInput) {
    return this.caseFileService.deleteEquipment(deleteEquipmentInput);
  }

  @Mutation("updateReview")
  @Roles(Role.COS, Role.PARKS)
  updateReview(@Args("reviewInput") reviewInput: ReviewInput) {
    return this.caseFileService.updateReview(reviewInput);
  }

  @Mutation("createNote")
  @Roles(coreRoles)
  createNote(@Args("input") input: CreateNoteInput) {
    return this.caseFileService.createNote(input);
  }

  @Mutation("updateNote")
  @Roles(coreRoles)
  updateNote(@Args("input") input: UpdateNoteInput) {
    return this.caseFileService.updateNote(input);
  }

  @Mutation("deleteNote")
  @Roles(coreRoles)
  deleteNote(@Args("input") input: DeleteNoteInput) {
    return this.caseFileService.deleteNote(input);
  }

  @Mutation("createWildlife")
  @Roles(Role.COS, Role.PARKS)
  createWildlife(@Args("input") input: CreateWildlifeInput) {
    return this.caseFileService.createWildlife(input);
  }

  @Mutation("updateWildlife")
  @Roles(Role.COS, Role.PARKS)
  updateWildlife(@Args("input") input: UpdateWildlifeInput) {
    return this.caseFileService.updateWildlife(input);
  }

  @Mutation("deleteWildlife")
  @Roles(Role.COS, Role.PARKS)
  deleteWildlife(@Args("input") input: DeleteWildlifeInput) {
    return this.caseFileService.deleteWildlife(input);
  }

  @Mutation("createDecision")
  @Roles(Role.CEEB)
  createDecision(@Args("input") input: CreateDecisionInput) {
    return this.caseFileService.createDecision(input);
  }

  @Mutation("updateDecision")
  @Roles(Role.CEEB)
  updateDecision(@Args("input") input: UpdateDecisionInput) {
    return this.caseFileService.updateDecision(input);
  }

  @Mutation("createAuthorizationOutcome")
  @Roles(Role.CEEB)
  createAuthorizationOutcome(@Args("input") input: CreateAuthorizationOutcomeInput) {
    return this.caseFileService.createAuthorizationOutcome(input);
  }

  @Mutation("updateAuthorizationOutcome")
  @Roles(Role.CEEB)
  updateAuthorizationOutcome(@Args("input") input: UpdateAuthorizationOutcomeInput) {
    return this.caseFileService.updateAuthorizationOutcome(input);
  }

  @Mutation("deleteAuthorizationOutcome")
  @Roles(Role.CEEB)
  deleteAuthorizationOutcome(@Args("input") input: DeleteAuthorizationOutcomeInput) {
    return this.caseFileService.deleteAuthorizationOutcome(input);
  }
}
