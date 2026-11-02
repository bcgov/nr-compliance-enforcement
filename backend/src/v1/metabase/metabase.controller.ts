import { Controller, Get, UseGuards } from "@nestjs/common";
import { MetabaseService } from "./metabase.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { User } from "../../auth/decorators/user.decorator";
import { Token } from "../../auth/decorators/token.decorator";

@ApiTags("metabase")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "metabase",
  version: "1",
})
export class MetabaseController {
  constructor(private readonly metabaseService: MetabaseService) {}

  @Get("investigations-at-a-glance")
  @Roles(Role.COS)
  getInvestigationsAtAGlanceUrl(@User() user, @Token() token: string) {
    return this.metabaseService.getInvestigationsAtAGlanceUrl(user, token);
  }
}
