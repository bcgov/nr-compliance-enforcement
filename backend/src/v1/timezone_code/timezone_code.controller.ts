import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimezoneCodeService } from './timezone_code.service';
import { CreateTimezoneCodeDto } from './dto/create-timezone_code.dto';
import { UpdateTimezoneCodeDto } from './dto/update-timezone_code.dto';

@Controller('timezone-code')
export class TimezoneCodeController {
  constructor(private readonly timezoneCodeService: TimezoneCodeService) {}

  @Post()
  create(@Body() createTimezoneCodeDto: CreateTimezoneCodeDto) {
    return this.timezoneCodeService.create(createTimezoneCodeDto);
  }

  @Get()
  findAll() {
    return this.timezoneCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timezoneCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimezoneCodeDto: UpdateTimezoneCodeDto) {
    return this.timezoneCodeService.update(+id, updateTimezoneCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timezoneCodeService.remove(+id);
  }
}
