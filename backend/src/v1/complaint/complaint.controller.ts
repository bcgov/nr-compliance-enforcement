import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintService.create(createComplaintDto);
  }

  @Get()
  findAll() {
    return this.complaintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.complaintService.update(+id, updateComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintService.remove(+id);
  }
}
