import { Body, Controller, Logger, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ComplaintReferralService } from "./complaint_referral.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { CreateComplaintReferralDto } from "../complaint_referral/dto/create-complaint_referral.dto";
import { Token } from "../../auth/decorators/token.decorator";
import { User } from "src/auth/decorators/user.decorator";

@UseGuards(JwtRoleGuard)
@ApiTags("complaint-referral")
@Controller({
  path: "complaint-referral",
  version: "1",
})
export class ComplaintReferralController {
  constructor(private readonly complaintReferralService: ComplaintReferralService) {}
  private readonly logger = new Logger(ComplaintReferralController.name);

  @Post()
  @Roles(coreRoles)
  create(@Body() createComplaintReferralDto: CreateComplaintReferralDto, @Token() token, @User() user) {
    return this.complaintReferralService.create(createComplaintReferralDto, token, user);
  }
}
