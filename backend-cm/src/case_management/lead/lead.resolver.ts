import { Resolver, Query, Args } from "@nestjs/graphql";
import { LeadService } from "./lead.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { UseGuards } from "@nestjs/common";
import { Role } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";

@UseGuards(JwtRoleGuard)
@Resolver("Lead")
export class LeadResolver {
  constructor(private readonly leadService: LeadService) {}

  @Query("getLeadsByActionTaken")
  @Roles(Role.CEEB)
  findOne(@Args("actionCode") actionCode: string) {
    return this.leadService.getLeadsByActionTaken(actionCode);
  }

  @Query("getLeadsByOutcomeAnimal")
  @Roles(Role.COS, Role.PARKS)
  findLeadsByOutcomeAnimal(
    @Args("outcomeAnimalCode") outcomeAnimalCode: string,
    @Args("outcomeActionedByCode") outcomeActionedByCode: string,
    @Args("startDate") startDate: string,
    @Args("endDate") endDate: string,
  ) {
    return this.leadService.getLeadsByOutcomeAnimal(outcomeAnimalCode, outcomeActionedByCode, startDate, endDate);
  }

  @Query("getLeadsByEquipment")
  @Roles(Role.COS, Role.PARKS)
  findLeadsByEquipment(
    @Args("equipmentStatus") equipmentStatus: string,
    @Args("equipmentCodes") equipmentCodes: string[] | undefined,
  ) {
    return this.leadService.getLeadsByEquipment(equipmentStatus, equipmentCodes);
  }
}
