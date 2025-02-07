import { Controller, Get, Query } from "@nestjs/common";
import { BcGeoCoderService } from "./bc_geo_coder.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";

@Controller("bc-geo-coder")
export class BcGeoCoderController {
  constructor(private readonly bcGeoCoderService: BcGeoCoderService) {}

  @Get("/address")
  @Roles(coreRoles)
  findAll(@Query("localityName") localityName?: string, @Query("addressString") addressString?: string) {
    return this.bcGeoCoderService.findAll(localityName, addressString);
  }
}
