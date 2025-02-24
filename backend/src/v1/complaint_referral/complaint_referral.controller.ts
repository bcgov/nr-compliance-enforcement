import { Body, Controller, Get, Logger, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ComplaintReferralService } from "./complaint_referral.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { CreateComplaintReferralDto } from "../complaint_referral/dto/create-complaint_referral.dto";

@UseGuards(JwtRoleGuard)
@ApiTags("complaint-referral")
@Controller({
  path: "complaint-referral",
  version: "1",
})
export class ComplaintReferralController {
  constructor(private readonly complaintReferralService: ComplaintReferralService) {}
  private readonly logger = new Logger(ComplaintReferralController.name);

  @Get("/:complaintId")
  @Roles(coreRoles)
  async findByComplaintId(@Param("complaintId") id: string) {
    return await this.complaintReferralService.findByComplaintId(id);
  }

  @Post()
  @Roles(coreRoles)
  create(@Body() createComplaintReferralDto: CreateComplaintReferralDto) {
    return this.complaintReferralService.create(createComplaintReferralDto);
  }
}
