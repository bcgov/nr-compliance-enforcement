import { Logger, UseGuards } from "@nestjs/common";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Args, Query, Resolver, Mutation, Int } from "@nestjs/graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { GraphQLError } from "graphql";
import { PartyService } from "./party.service";
import { PartyCreateInput, PartyFilters, PartyUpdateInput } from "./dto/party";

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

  @Query("parties")
  @Roles(coreRoles)
  async findMany(@Args("partyIdentifiers", { type: () => [String] }) ids: string[]) {
    try {
      return await this.partyService.findMany(ids);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching parties by IDs from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("searchParties")
  @Roles(coreRoles)
  async search(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args("pageSize", { type: () => Int, nullable: true, defaultValue: 25 }) pageSize: number,
    @Args("filters", { nullable: true }) filters?: PartyFilters,
  ) {
    try {
      return await this.partyService.search(page, pageSize, filters);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error searching paginated data from Shared schema", {
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
