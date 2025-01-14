import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from "@nestjs/common";
import { OfficeService } from "./office.service";
import { CreateOfficeDto } from "./dto/create-office.dto";
import { UpdateOfficeDto } from "./dto/update-office.dto";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UUID } from "crypto";
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
  @Roles(Role.COS, Role.CEEB)
  async findOffices(): Promise<Array<OfficeAssignmentDto>> {
    const result = await this.officeService.findOffices();
    return result;
  }

  @Get(":id")
  @Roles(Role.COS)
  findOne(@Param("id") id: UUID) {
    return this.officeService.findOne(id);
  }

  @Get("/by-zone/:zone_code")
  @Roles(Role.COS)
  findOfficesByZone(@Param("zone_code") zone_code: string) {
    return this.officeService.findOfficesByZone(zone_code);
  }

  @Get("/by-geo-code/:code")
  @Roles(Role.COS)
  findByGeoOrgCode(@Param("code") code: string) {
    return this.officeService.findByGeoOrgCode(code);
  }

  @Post()
  @Roles(Role.COS)
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officeService.create(createOfficeDto);
  }

  @HttpCode(501)
  @Patch(":id")
  @Roles(Role.COS)
  update(@Param("id") id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officeService.update(+id, updateOfficeDto);
  }

  @HttpCode(501)
  @Delete(":id")
  @Roles(Role.COS)
  remove(@Param("id") id: string) {
    return this.officeService.remove(+id);
  }
}
