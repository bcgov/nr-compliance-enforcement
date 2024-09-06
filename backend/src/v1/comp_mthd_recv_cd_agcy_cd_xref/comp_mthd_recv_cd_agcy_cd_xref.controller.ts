import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CompMthdRecvCdAgcyCdXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/enum/role.enum";
import { JwtRoleGuard } from "src/auth/jwtrole.guard";

@UseGuards(JwtRoleGuard)
@ApiTags("complaint-method-received-by")
@Controller({
  path: "complaint-method-received-by",
  version: "1",
})
export class CompMthdRecvCdAgcyCdXrefController {
  constructor(private readonly compMthdRecvCdAgcyCdXrefService: CompMthdRecvCdAgcyCdXrefService) {}

  @Get()
  findAll() {
    return this.compMthdRecvCdAgcyCdXrefService.findAll();
  }

  @Get("/by-agency/:agencyCode")
  @Roles(Role.COS_OFFICER, Role.CEEB)
  findByAgency(@Param("agencyCode") agencyCode: string) {
    return this.compMthdRecvCdAgcyCdXrefService.findBy(agencyCode);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.compMthdRecvCdAgcyCdXrefService.findOne(+id);
  }
}
