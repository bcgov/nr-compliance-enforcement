import { PartialType } from "@nestjs/swagger";
import { CreateGeoOrgUnitTypeCodeDto } from "./create-geo_org_unit_type_code.dto";

export class UpdateGeoOrgUnitTypeCodeDto extends PartialType(CreateGeoOrgUnitTypeCodeDto) {}
