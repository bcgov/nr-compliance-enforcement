import { Body, Controller, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { AllegationComplaintDto } from 'src/types/models/complaints/allegation-complaint';
import { COMPLAINT_TYPE } from 'src/types/models/complaints/complaint-type';
import { WildlifeComplaintDto } from 'src/types/models/complaints/wildlife-complaint';
import { ComplaintService } from '../complaint/complaint.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("complaint-internal")
@Controller({
  path: "complaint-internal",
  version: "1",
})
export class ComplaintInternalController {

    constructor(private readonly service: ComplaintService) {}

    @Post("/create/:complaintType")
    @Public()
    async create(
      @Param("complaintType") complaintType: COMPLAINT_TYPE,
      @Body() model: WildlifeComplaintDto | AllegationComplaintDto
    ): Promise<WildlifeComplaintDto | AllegationComplaintDto> {
      return await this.service.create(complaintType, model, true);
    }
}
