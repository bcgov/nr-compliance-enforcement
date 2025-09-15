import { Logger, UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Args, Query, Resolver, Mutation } from "@nestjs/graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { GraphQLError } from "graphql";
import { PartyService } from "./party.service";
import { PartyCreateInput, PartyUpdateInput } from "./dto/party";

@UseGuards(JwtRoleGuard)
@Resolver("Party")
export class PartyResolver {
  constructor(private readonly partyService: PartyService) {}
  private readonly logger = new Logger(PartyResolver.name);

  @Query("party")
  @Roles(coreRoles)
  async findOne(@Args("partyIdentifier") id: string) {
    try {
      return await this.partyService.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation("createParty")
  @Roles(coreRoles)
  async create(@Args("input") input: PartyCreateInput) {
    try {
      return await this.partyService.create(input);
    } catch (error) {
      this.logger.error("Create party error:", error);
      throw new GraphQLError("Error creating party", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation("updateParty")
  @Roles(coreRoles)
  async update(@Args("partyIdentifier") partyIdentifier: string, @Args("input") input: PartyUpdateInput) {
    try {
      return await this.partyService.update(partyIdentifier, input);
    } catch (error) {
      this.logger.error("Update party error:", error);
      throw new GraphQLError("Error updating party", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
