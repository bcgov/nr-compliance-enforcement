import { Query, Resolver } from "@nestjs/graphql";
import { IpmAuthCategoryCodeService } from "./ipm_auth_category_code.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";

@Resolver("IpmAuthCategoryCode")
export class IpmAuthCategoryCodeResolver {
  constructor(private readonly ipmAuthCategoryCodeService: IpmAuthCategoryCodeService) {}

  @Query("ipmAuthCategoryCodes")
  @Roles(Role.CEEB)
  findAll() {
    return this.ipmAuthCategoryCodeService.findAll();
  }
}
