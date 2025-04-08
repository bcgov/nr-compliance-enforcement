import { Controller, Get, Param, UseGuards, Query, Logger } from "@nestjs/common";
import { SharedDataService } from "./shared_data.service";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Token } from "../../auth/decorators/token.decorator";

@UseGuards(JwtRoleGuard)
@ApiTags("shared-data")
@Controller({
  path: "shared-data",
  version: "1",
})
export class SharedDataController {
  constructor(private readonly service: SharedDataService) {}
  private readonly logger = new Logger(SharedDataController.name);

  @Get("/park")
  @Roles(coreRoles)
  findParks(
    @Token() token,
    @Query("search") search?: string,
    @Query("take") take?: number,
    @Query("skip") skip?: number,
  ) {
    return this.service.findParks(token, search, take, skip);
  }

  @Get("/park/:id")
  @Roles(coreRoles)
  findOnePark(@Param("id") id: string, @Token() token) {
    return this.service.findOnePark(token, id);
  }
}
