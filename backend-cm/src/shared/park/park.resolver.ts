import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { ParkService } from "./park.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Logger, UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { GraphQLError } from "graphql";
import { Park } from "src/shared/park/dto/park";
import { ParkArgs, ParkInput } from "src/shared/park/dto/park.input";

@UseGuards(JwtRoleGuard)
@Resolver("Park")
export class ParkResolver {
  constructor(private readonly ParkService: ParkService) {}
  private readonly logger = new Logger(ParkResolver.name);

  @Query("parks")
  @Roles(coreRoles)
  async find(@Args() args: ParkArgs) {
    try {
      return await this.ParkService.find(args);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("park")
  @Roles(coreRoles)
  async findOne(@Args("parkGuid") id: string) {
    try {
      return await this.ParkService.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("getParksByArea")
  @Roles(coreRoles)
  async findByArea(@Args("parkAreaGuid") id: string) {
    try {
      return await this.ParkService.findByArea(id);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation(() => Park, { name: "createPark" })
  @Roles(coreRoles)
  async create(@Args("input") input: ParkInput) {
    try {
      return await this.ParkService.create(input);
    } catch (error) {
      this.logger.error("Create park error:", error);
      throw new GraphQLError("Error creating park", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation(() => Park, { name: "updatePark" })
  @Roles(coreRoles)
  async update(@Args("parkGuid") parkGuid: string, @Args("input") input: ParkInput) {
    try {
      return await this.ParkService.update(parkGuid, input);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error updating park", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation(() => Park, { name: "deletePark" })
  @Roles(coreRoles)
  async delete(@Args("parkGuid") parkGuid: string) {
    try {
      return await this.ParkService.delete(parkGuid);
    } catch (error) {
      this.logger.error("Delete park error:", error);
      throw new GraphQLError("Error deleting park", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
