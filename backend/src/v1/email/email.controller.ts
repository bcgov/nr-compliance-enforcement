import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmailService } from "./email.service";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Token } from "../../auth/decorators/token.decorator";
import { User } from "../../auth/decorators/user.decorator";
import { SendInvestigationCollaboratorEmailDto } from "./dto/send_investigation_collaborator_email.dto";

@UseGuards(JwtRoleGuard)
@ApiTags("email")
@Controller({
  path: "email",
  version: "1",
})
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("/investigation-collaborator")
  @Roles(coreRoles)
  async sendInvestigationCollaboratorEmail(
    @Body() sendInvestigationCollaboratorEmailDto: SendInvestigationCollaboratorEmailDto,
    @User() user,
    @Token() token,
  ) {
    return await this.emailService.sendInvestigationCollaboratorEmail(
      sendInvestigationCollaboratorEmailDto,
      user,
      token,
    );
  }
}
