import { PartialType } from '@nestjs/swagger';
import { CreateOfficeDto } from './create-office.dto';

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {}
