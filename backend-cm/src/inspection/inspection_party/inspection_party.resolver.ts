import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateInspectionPartyInput } from "../inspection_party/dto/inspection_party";
import { InspectionPartyService } from "../inspection_party/inspection_party_service";

@Resolver("InspectionParty")
export class InspectionPartyResolver {
  constructor(private readonly inspectionPartyService: InspectionPartyService) {}
  private readonly logger = new Logger(InspectionPartyResolver.name);

  @Mutation("addPartyToInspection")
  @Roles(coreRoles)
  async create(@Args("inspectionGuid") inspectionGuid: string, @Args("input") input: CreateInspectionPartyInput[]) {
    try {
      return await this.inspectionPartyService.create(inspectionGuid, input);
    } catch (error) {
      this.logger.error("Update inspection error:", error);
      throw new GraphQLError("Error adding parties to inspection", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Mutation("removePartyFromInspection")
  @Roles(coreRoles)
  async remove(@Args("inspectionGuid") inspectionGuid: string, @Args("partyIdentifier") partyIdentifier: string) {
    try {
      return await this.inspectionPartyService.remove(inspectionGuid, partyIdentifier);
    } catch (error) {
      this.logger.error("Remove inspection party error:", error);
      throw new GraphQLError("Error removing party from inspection", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          originalError: error.message,
        },
      });
    }
  }

  @Query("getInspectionPartiesByRef")
  @Roles(coreRoles)
  async findManyByParty(@Args("partyRefId") partyRefId: string) {
    try {
      return await this.inspectionPartyService.findManyByRef(partyRefId);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching inspection parties by Party Ref IDs from investigation schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }
}
