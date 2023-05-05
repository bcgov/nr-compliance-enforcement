import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AllegationComplaintService } from './allegation_complaint.service';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';

@Controller('allegation-complaint')
export class AllegationComplaintController {
  constructor(private readonly allegationComplaintService: AllegationComplaintService) {}

  @Post()
  create(@Body() createAllegationComplaintDto: CreateAllegationComplaintDto) {
    return this.allegationComplaintService.create(createAllegationComplaintDto);
  }

  @Get()
  findAll() {
    return this.allegationComplaintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allegationComplaintService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAllegationComplaintDto: UpdateAllegationComplaintDto) {
    return this.allegationComplaintService.update(+id, updateAllegationComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allegationComplaintService.remove(+id);
  }
}
