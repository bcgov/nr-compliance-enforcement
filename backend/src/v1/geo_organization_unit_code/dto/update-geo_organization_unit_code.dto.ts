import { PartialType } from "@nestjs/swagger";
import { CreateGeoOrganizationUnitCodeDto } from "./create-geo_organization_unit_code.dto";

export class UpdateGeoOrganizationUnitCodeDto extends PartialType(CreateGeoOrganizationUnitCodeDto) {}
