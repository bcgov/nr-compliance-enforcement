import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComplaintStatusCodeService } from './complaint_status_code.service';
import { CreateComplaintStatusCodeDto } from './dto/create-complaint_status_code.dto';
import { UpdateComplaintStatusCodeDto } from './dto/update-complaint_status_code.dto';

@Controller('complaint-status-code')
export class ComplaintStatusCodeController {
  constructor(private readonly complaintStatusCodeService: ComplaintStatusCodeService) {}

  @Post()
  create(@Body() createComplaintStatusCodeDto: CreateComplaintStatusCodeDto) {
    return this.complaintStatusCodeService.create(createComplaintStatusCodeDto);
  }

  @Get()
  findAll() {
    return this.complaintStatusCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintStatusCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplaintStatusCodeDto: UpdateComplaintStatusCodeDto) {
    return this.complaintStatusCodeService.update(+id, updateComplaintStatusCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintStatusCodeService.remove(+id);
  }
}
