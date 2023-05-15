import { PartialType } from '@nestjs/swagger';
import { CreateHwcrComplaintDto } from './create-hwcr_complaint.dto';

export class UpdateHwcrComplaintDto extends PartialType(CreateHwcrComplaintDto) {}
