import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import {
  CreateInvestigationPartyInput,
  UpdateInvestigationPartyInput,
} from "../investigation_party/dto/investigation_party";
import { CreateInvestigationAttachmentReferenceInput } from "../investigation_attachment_reference/dto/investigation_attachment_reference";
import { InvestigationPartyService } from "../investigation_party/investigation_party_service";

@Resolver("InvestigationParty")
export class InvestigationPartyResolver {
  constructor(private readonly investigationPartyService: InvestigationPartyService) {}
  private readonly logger = new Logger(InvestigationPartyResolver.name);

  @Mutation("addPartyToInvestigation")
  @Roles(coreRoles)
  async create(
    @Args("investigationGuid") investigationGuid: string,
    @Args("input") input: CreateInvestigationPartyInput[],
  ) {
    try {
      return await this.investigationPartyService.create(investigationGuid, input);
    } catch (error) {
      this.logger.error("Update investigation error:", error);
      throw new GraphQLError("Error adding parties to investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("addPartyToInvestigationFromSharedParty")
  @Roles(coreRoles)
  async addFromSharedParty(
    @Args("investigationGuid") investigationGuid: string,
    @Args("partyReference") partyReference: string,
    @Args("partyAssociationRole") partyAssociationRole: string,
    @Args("attachmentReferences") attachmentReferences: CreateInvestigationAttachmentReferenceInput[],
  ) {
    try {
      return await this.investigationPartyService.addFromSharedParty(
        investigationGuid,
        partyReference,
        partyAssociationRole,
        attachmentReferences,
      );
    } catch (error) {
      this.logger.error("Add party to investigation from shared party error:", error.stack ?? error);
      throw new GraphQLError("Error adding party to investigation from shared party", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("removePartyFromInvestigation")
  @Roles(coreRoles)
  async remove(@Args("investigationGuid") investigationGuid: string, @Args("partyIdentifier") partyIdentifier: string) {
    try {
      return await this.investigationPartyService.remove(investigationGuid, partyIdentifier);
    } catch (error) {
      this.logger.error("Remove investigation party error:", error);
      throw new GraphQLError("Error removing party from investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Query("InvestigationParties")
  @Roles(coreRoles)
  async findManyByParty(@Args("partyRefId") partyRefId: string) {
    try {
      return await this.investigationPartyService.findManyByRef(partyRefId);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching investigation parties by Party Ref IDs from investigation schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("editPartyRoleInInvestigation")
  @Roles(coreRoles)
  async editPartyRole(
    @Args("investigationGuid") investigationGuid: string,
    @Args("partyIdentifier") partyIdentifier: string,
    @Args("partyAssociationRole") partyAssociationRole: string,
  ) {
    try {
      return await this.investigationPartyService.editPartyRole(
        investigationGuid,
        partyIdentifier,
        partyAssociationRole,
      );
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error editing party role in investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("updateInvestigationParty")
  @Roles(coreRoles)
  async update(
    @Args("investigationGuid") investigationGuid: string,
    @Args("input") input: UpdateInvestigationPartyInput,
  ) {
    try {
      return await this.investigationPartyService.update(investigationGuid, input);
    } catch (error) {
      this.logger.error("Update investigation party error:", error.stack ?? error);
      throw new GraphQLError("Error updating investigation party", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("updateInvestigationPartyFromSharedParty")
  @Roles(coreRoles)
  async updateFromSharedParty(
    @Args("investigationGuid") investigationGuid: string,
    @Args("partyIdentifier") partyIdentifier: string,
    @Args("attachmentReferences") attachmentReferences: CreateInvestigationAttachmentReferenceInput[],
  ) {
    try {
      return await this.investigationPartyService.updateFromSharedParty(
        investigationGuid,
        partyIdentifier,
        attachmentReferences,
      );
    } catch (error) {
      this.logger.error("Update investigation party from shared party error:", error.stack ?? error);
      throw new GraphQLError("Error updating investigation party from shared party", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("replacePartyOnInvestigation")
  @Roles(coreRoles)
  async replace(
    @Args("investigationGuid") investigationGuid: string,
    @Args("partyIdentifier") partyIdentifier: string,
    @Args("input") input: CreateInvestigationPartyInput,
  ) {
    try {
      return await this.investigationPartyService.replace(investigationGuid, partyIdentifier, input);
    } catch (error) {
      this.logger.error("Replace investigation party error:", error);
      throw new GraphQLError("Error replacing party on investigation", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("replacePartyOnInvestigationFromSharedParty")
  @Roles(coreRoles)
  async replaceFromSharedParty(
    @Args("investigationGuid") investigationGuid: string,
    @Args("partyIdentifier") partyIdentifier: string,
    @Args("partyReference") partyReference: string,
    @Args("partyAssociationRole") partyAssociationRole: string,
    @Args("attachmentReferences") attachmentReferences: CreateInvestigationAttachmentReferenceInput[],
  ) {
    try {
      return await this.investigationPartyService.replaceFromSharedParty(
        investigationGuid,
        partyIdentifier,
        partyReference,
        partyAssociationRole,
        attachmentReferences,
      );
    } catch (error) {
      this.logger.error("Replace investigation party from shared party error:", error.stack ?? error);
      throw new GraphQLError("Error replacing party on investigation from shared party", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }
}
