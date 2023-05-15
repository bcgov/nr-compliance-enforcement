import { PartialType } from '@nestjs/swagger';
import { CreateAttractantCodeDto } from './create-attractant_code.dto';

export class UpdateAttractantCodeDto extends PartialType(CreateAttractantCodeDto) {}
