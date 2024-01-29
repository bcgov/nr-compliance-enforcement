import { PartialType } from '@nestjs/swagger';
import { CreateStagingActivityCodeDto } from './create-staging_activity_code.dto';

export class UpdateStagingActivityCodeDto extends PartialType(CreateStagingActivityCodeDto) {}
