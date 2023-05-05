import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';

@Controller('officer')
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Post()
  create(@Body() createOfficerDto: CreateOfficerDto) {
    return this.officerService.create(createOfficerDto);
  }

  @Get()
  findAll() {
    return this.officerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfficerDto: UpdateOfficerDto) {
    return this.officerService.update(+id, updateOfficerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.officerService.remove(+id);
  }
}
