import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ComplaintOutcomeService } from "./complaint_outcome.service";
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
@Resolver("ComplaintOutcome")
export class ComplaintOutcomeResolver {
  constructor(private readonly complaintOutcomeService: ComplaintOutcomeService) {}

  @Mutation("createAssessment")
  @Roles(Role.COS, Role.PARKS)
  createAssessment(@Args("input") input: CreateAssessmentInput) {
    return this.complaintOutcomeService.createAssessment(input);
  }

  @Mutation("createPrevention")
  @Roles(Role.COS, Role.PARKS)
  createPrevention(@Args("input") createPreventionInput: CreatePreventionInput) {
    return this.complaintOutcomeService.createPrevention(createPreventionInput);
  }

  @Mutation("createReview")
  @Roles(Role.COS, Role.PARKS)
  createReview(@Args("reviewInput") reviewInput: ReviewInput) {
    return this.complaintOutcomeService.createReview(reviewInput);
  }

  @Query("getComplaintOutcome")
  @Roles(coreRoles)
  findOne(@Args("complaintOutcomeGuid") complaintOutcomeGuid: string) {
    return this.complaintOutcomeService.findOne(complaintOutcomeGuid);
  }

  @Query("getComplaintOutcomeByComplaintId")
  @Roles(coreRoles)
  findOneByLeadId(@Args("complaintId") complaintId: string) {
    return this.complaintOutcomeService.findOneByLeadId(complaintId);
  }

  @Query("getComplaintOutcomesByComplaintId")
  @Roles(coreRoles)
  findManyByLeadId(@Args("complaintIds") complaintIds: string[]) {
    return this.complaintOutcomeService.findManyByLeadId(complaintIds);
  }

  @Query("getComplaintOutcomesBySearchString")
  @Roles(coreRoles)
  findManyBySearchString(@Args("complaintType") complaintType: string, @Args("searchString") searchString: string) {
    return this.complaintOutcomeService.findManyBySearchString(complaintType, searchString);
  }

  @Mutation("updateAssessment")
  @Roles(Role.COS, Role.PARKS)
  updateAssessment(@Args("input") input: UpdateAssessmentInput) {
    return this.complaintOutcomeService.updateAssessment(input);
  }

  @Mutation("updatePrevention")
  @Roles(Role.COS, Role.PARKS)
  updatePrevention(@Args("input") updatePreventionInput: UpdatePreventionInput) {
    return this.complaintOutcomeService.updatePrevention(updatePreventionInput);
  }

  @Mutation("deletePrevention")
  @Roles(Role.COS, Role.PARKS)
  deletePrevention(@Args("input") deletePreventionInput: DeletePreventionInput) {
    return this.complaintOutcomeService.deletePrevention(deletePreventionInput);
  }

  @Mutation("createEquipment")
  @Roles(Role.COS, Role.PARKS)
  createEquipment(@Args("createEquipmentInput") createEquipmentInput: CreateEquipmentInput) {
    return this.complaintOutcomeService.createEquipment(createEquipmentInput);
  }

  @Mutation("updateEquipment")
  @Roles(Role.COS, Role.PARKS)
  updateEquipment(@Args("updateEquipmentInput") updateEquipmentInput: UpdateEquipmentInput) {
    return this.complaintOutcomeService.updateEquipment(updateEquipmentInput);
  }

  @Mutation("deleteEquipment")
  @Roles(Role.COS, Role.PARKS)
  deleteEquipment(@Args("deleteEquipmentInput") deleteEquipmentInput: DeleteEquipmentInput) {
    return this.complaintOutcomeService.deleteEquipment(deleteEquipmentInput);
  }

  @Mutation("updateReview")
  @Roles(Role.COS, Role.PARKS)
  updateReview(@Args("reviewInput") reviewInput: ReviewInput) {
    return this.complaintOutcomeService.updateReview(reviewInput);
  }

  @Mutation("createNote")
  @Roles(coreRoles)
  createNote(@Args("input") input: CreateNoteInput) {
    return this.complaintOutcomeService.createNote(input);
  }

  @Mutation("updateNote")
  @Roles(coreRoles)
  updateNote(@Args("input") input: UpdateNoteInput) {
    return this.complaintOutcomeService.updateNote(input);
  }

  @Mutation("deleteNote")
  @Roles(coreRoles)
  deleteNote(@Args("input") input: DeleteNoteInput) {
    return this.complaintOutcomeService.deleteNote(input);
  }

  @Mutation("createWildlife")
  @Roles(Role.COS, Role.PARKS)
  createWildlife(@Args("input") input: CreateWildlifeInput) {
    return this.complaintOutcomeService.createWildlife(input);
  }

  @Mutation("updateWildlife")
  @Roles(Role.COS, Role.PARKS)
  updateWildlife(@Args("input") input: UpdateWildlifeInput) {
    return this.complaintOutcomeService.updateWildlife(input);
  }

  @Mutation("deleteWildlife")
  @Roles(Role.COS, Role.PARKS)
  deleteWildlife(@Args("input") input: DeleteWildlifeInput) {
    return this.complaintOutcomeService.deleteWildlife(input);
  }

  @Mutation("createDecision")
  @Roles(Role.CEEB)
  createDecision(@Args("input") input: CreateDecisionInput) {
    return this.complaintOutcomeService.createDecision(input);
  }

  @Mutation("updateDecision")
  @Roles(Role.CEEB)
  updateDecision(@Args("input") input: UpdateDecisionInput) {
    return this.complaintOutcomeService.updateDecision(input);
  }

  @Mutation("createAuthorizationOutcome")
  @Roles(Role.CEEB)
  createAuthorizationOutcome(@Args("input") input: CreateAuthorizationOutcomeInput) {
    return this.complaintOutcomeService.createAuthorizationOutcome(input);
  }

  @Mutation("updateAuthorizationOutcome")
  @Roles(Role.CEEB)
  updateAuthorizationOutcome(@Args("input") input: UpdateAuthorizationOutcomeInput) {
    return this.complaintOutcomeService.updateAuthorizationOutcome(input);
  }

  @Mutation("deleteAuthorizationOutcome")
  @Roles(Role.CEEB)
  deleteAuthorizationOutcome(@Args("input") input: DeleteAuthorizationOutcomeInput) {
    return this.complaintOutcomeService.deleteAuthorizationOutcome(input);
  }
}
