import { PartialType } from '@nestjs/swagger';
import { CreateStagingStatusCodeDto } from './create-staging_status_code.dto';

export class UpdateStagingStatusCodeDto extends PartialType(CreateStagingStatusCodeDto) {}
