import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { ParkAreaService } from "./parkArea.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Logger, UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { GraphQLError } from "graphql";
import { ParkArea } from "src/shared/park/dto/park_area";
import { ParkAreaInput } from "src/shared/park/dto/park_area.input";

@UseGuards(JwtRoleGuard)
@Resolver("ParkArea")
export class ParkAreaResolver {
  constructor(private readonly ParkAreaService: ParkAreaService) {}
  private readonly logger = new Logger(ParkAreaResolver.name);

  @Query("parkArea")
  @Roles(coreRoles)
  async findOne(@Args("park_areaGuid") id: string) {
    try {
      return await this.ParkAreaService.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("parkAreas")
  @Roles(coreRoles)
  async findAll() {
    try {
      return await this.ParkAreaService.findAll();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation(() => ParkArea, { name: "createParkArea" })
  @Roles(coreRoles)
  async create(@Args("input") input: ParkAreaInput) {
    try {
      return await this.ParkAreaService.create(input);
    } catch (error) {
      this.logger.error("Create park_area error:", error);
      throw new GraphQLError("Error creating park_area", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation(() => ParkArea, { name: "updateParkArea" })
  @Roles(coreRoles)
  async update(@Args("park_areaGuid") park_areaGuid: string, @Args("input") input: ParkAreaInput) {
    try {
      return await this.ParkAreaService.update(park_areaGuid, input);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error updating park_area", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation(() => ParkArea, { name: "deleteParkArea" })
  @Roles(coreRoles)
  async delete(@Args("park_areaGuid") park_areaGuid: string) {
    try {
      return await this.ParkAreaService.delete(park_areaGuid);
    } catch (error) {
      this.logger.error("Delete park_area error:", error);
      throw new GraphQLError("Error deleting park_area", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
