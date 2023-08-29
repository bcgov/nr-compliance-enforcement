import { PickType } from '@nestjs/swagger';
import { AttractantHwcrXrefDto } from './attractant_hwcr_xref.dto';

export class CreateAttractantHwcrXrefDto extends PickType(AttractantHwcrXrefDto, [
    "hwcr_complaint_guid",
    "attractant_code",
    "create_user_id",
    "create_timestamp",
    "update_user_id",
    "update_timestamp",
          ] as const) {}
