import { PartialType } from '@nestjs/swagger';
import { CreateSpeciesCodeDto } from './create-species_code.dto';

export class UpdateSpeciesCodeDto extends PartialType(CreateSpeciesCodeDto) {}
