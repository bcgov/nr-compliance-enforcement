import { Roles } from "@/app/types/app/roles";

export default interface MenuItem {
  id?: string;
  name: string;
  icon: string;
  route?: string;
  excludedRoles?: Array<Roles>;
  requiredRoles?: Array<Roles>;
  featureFlag?: string;
}
