import { PartialType } from '@nestjs/mapped-types';
import { CreateTimezoneCodeDto } from './create-timezone_code.dto';

export class UpdateTimezoneCodeDto extends PartialType(CreateTimezoneCodeDto) {}
