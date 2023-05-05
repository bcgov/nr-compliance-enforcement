import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgencyCodeService } from './agency_code.service';
import { CreateAgencyCodeDto } from './dto/create-agency_code.dto';
import { UpdateAgencyCodeDto } from './dto/update-agency_code.dto';

@Controller('agency-code')
export class AgencyCodeController {
  constructor(private readonly agencyCodeService: AgencyCodeService) {}

  @Post()
  create(@Body() createAgencyCodeDto: CreateAgencyCodeDto) {
    return this.agencyCodeService.create(createAgencyCodeDto);
  }

  @Get()
  findAll() {
    return this.agencyCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agencyCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgencyCodeDto: UpdateAgencyCodeDto) {
    return this.agencyCodeService.update(+id, updateAgencyCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agencyCodeService.remove(+id);
  }
}
