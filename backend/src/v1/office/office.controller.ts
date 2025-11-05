import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from "@nestjs/common";
import { OfficeService } from "./office.service";
import { CreateOfficeDto } from "./dto/create-office.dto";
import { UpdateOfficeDto } from "./dto/update-office.dto";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Token } from "../../auth/decorators/token.decorator";
import { UUID } from "node:crypto";
import { OfficeAssignmentDto } from "../../types/models/office/office-assignment-dto";

@ApiTags("office")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "office",
  version: "1",
})
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get("/offices-by-agency")
  @Roles(coreRoles)
  async findOffices(@Token() token: string): Promise<Array<OfficeAssignmentDto>> {
    const result = await this.officeService.findOffices(token);
    return result;
  }

  @Get(":id")
  @Roles(coreRoles)
  findOne(@Param("id") id: UUID, @Token() token: string) {
    return this.officeService.findOne(id, token);
  }

  @Get("/by-zone/:zone_code")
  @Roles(coreRoles)
  findOfficesByZone(@Param("zone_code") zone_code: string, @Token() token: string) {
    return this.officeService.findOfficesByZone(zone_code, token);
  }

  @Get("/by-geo-code/:code")
  @Roles(coreRoles)
  findByGeoOrgCode(@Param("code") code: string, @Token() token: string) {
    return this.officeService.findByGeoOrgCode(code, token);
  }

  @Post()
  @Roles(coreRoles)
  create(@Body() createOfficeDto: CreateOfficeDto, @Token() token: string) {
    return this.officeService.create(createOfficeDto, token);
  }

  @Patch(":id")
  @Roles(coreRoles)
  update(@Param("id") id: UUID, @Body() updateOfficeDto: UpdateOfficeDto, @Token() token: string) {
    return this.officeService.update(id, updateOfficeDto, token);
  }

  @HttpCode(501)
  @Delete(":id")
  @Roles(coreRoles)
  remove(@Param("id") id: string) {
    return this.officeService.remove(+id);
  }
}
