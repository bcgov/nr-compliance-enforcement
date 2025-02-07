import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CompMthdRecvCdAgcyCdXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role, coreRoles } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";

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
  @Roles(coreRoles)
  findByAgency(@Param("agencyCode") agencyCode: string) {
    return this.compMthdRecvCdAgcyCdXrefService.findBy(agencyCode);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.compMthdRecvCdAgcyCdXrefService.findOne(+id);
  }
}
