import { PartialType } from '@nestjs/swagger';
import { CreateViolationCodeDto } from './create-violation_code.dto';

export class UpdateViolationCodeDto extends PartialType(CreateViolationCodeDto) {}
