import { Query, Resolver } from "@nestjs/graphql";
import { IpmAuthCategoryCodeService } from "./ipm_auth_category_code.service";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";

@Resolver("IpmAuthCategoryCode")
export class IpmAuthCategoryCodeResolver {
  constructor(private readonly ipmAuthCategoryCodeService: IpmAuthCategoryCodeService) {}

  @Query("ipmAuthCategoryCodes")
  @Roles(coreRoles)
  findAll() {
    return this.ipmAuthCategoryCodeService.findAll();
  }
}
