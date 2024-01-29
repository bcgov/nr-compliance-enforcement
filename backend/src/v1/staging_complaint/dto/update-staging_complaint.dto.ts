import { PartialType } from '@nestjs/swagger';
import { CreateStagingComplaintDto } from './create-staging_complaint.dto';

export class UpdateStagingComplaintDto extends PartialType(CreateStagingComplaintDto) {}
