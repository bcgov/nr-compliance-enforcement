import { Controller, Param, UseGuards, Post, Body, Get } from "@nestjs/common";
import { AppUserComplaintXrefService } from "./app_user_complaint_xref.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { CreateAppUserComplaintXrefDto } from "./dto/create-app_user_complaint_xref.dto";
import { DataSource } from "typeorm";
import { Token } from "src/auth/decorators/token.decorator";

@UseGuards(JwtRoleGuard)
@ApiTags("app-user-complaint-xref")
@Controller({
  path: "app-user-complaint-xref",
  version: "1",
})
export class AppUserComplaintXrefController {
  constructor(
    private readonly appUserComplaintXrefService: AppUserComplaintXrefService,
    private readonly dataSource: DataSource,
  ) {}

  @Post(":complaint_id")
  @Roles(coreRoles)
  assignAppUser(
    @Param("complaint_id") complaintId: string,
    @Body() createPersonComplaintXrefDto: CreateAppUserComplaintXrefDto,
    @Token() token: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    return this.appUserComplaintXrefService.assignAppUser(
      queryRunner,
      complaintId,
      createPersonComplaintXrefDto,
      true,
      token,
    );
  }

  @Get("/:app_user_guid/:complaint_id")
  @Roles(coreRoles)
  findAssigned(@Param("app_user_guid") appUserGuid: string, @Param("complaint_id") complaintId: string) {
    return this.appUserComplaintXrefService.findAssigned(appUserGuid, complaintId);
  }
}
