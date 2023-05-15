import { PartialType } from '@nestjs/swagger';
import { CreateAgencyCodeDto } from './create-agency_code.dto';

export class UpdateAgencyCodeDto extends PartialType(CreateAgencyCodeDto) {}
