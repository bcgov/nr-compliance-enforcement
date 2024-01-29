import { PartialType } from '@nestjs/swagger';
import { CreateEntityCodeDto } from './create-entity_code.dto';

export class UpdateEntityCodeDto extends PartialType(CreateEntityCodeDto) {}
