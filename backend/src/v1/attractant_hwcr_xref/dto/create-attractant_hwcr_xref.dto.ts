import { PickType } from '@nestjs/swagger';
import { AttractantHwcrXrefDto } from './attractant_hwcr_xref.dto';

export class CreateAttractantHwcrXrefDto extends PickType(AttractantHwcrXrefDto, [
    "attractant_hwcr_xref_guid",
    "hwcr_complaint_guid",
    "attractant_code",
    "create_user_id",
    "create_timestamp",
    "update_user_id",
    "update_timestamp",
    "active_ind",
          ] as const) {}
