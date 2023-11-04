import { PartialType } from '@nestjs/swagger';
import { CreateCodeTableDto } from './create-code-table.dto';

export class UpdateCodeTableDto extends PartialType(CreateCodeTableDto) {}
