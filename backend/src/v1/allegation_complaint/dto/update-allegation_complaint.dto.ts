import { PartialType } from '@nestjs/swagger';
import { CreateAllegationComplaintDto } from './create-allegation_complaint.dto';

export class UpdateAllegationComplaintDto extends PartialType(CreateAllegationComplaintDto) {}
