import { PartialType } from '@nestjs/swagger';
import { CreateGeographicOrganizationUnitDto } from './create-geographic-organization-unit.dto';

export class UpdateGeographicOrganizationUnitDto extends PartialType(CreateGeographicOrganizationUnitDto) {}
