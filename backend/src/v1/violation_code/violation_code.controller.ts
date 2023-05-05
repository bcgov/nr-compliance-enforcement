import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViolationCodeService } from './violation_code.service';
import { CreateViolationCodeDto } from './dto/create-violation_code.dto';
import { UpdateViolationCodeDto } from './dto/update-violation_code.dto';

@Controller('violation-code')
export class ViolationCodeController {
  constructor(private readonly violationCodeService: ViolationCodeService) {}

  @Post()
  create(@Body() createViolationCodeDto: CreateViolationCodeDto) {
    return this.violationCodeService.create(createViolationCodeDto);
  }

  @Get()
  findAll() {
    return this.violationCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.violationCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViolationCodeDto: UpdateViolationCodeDto) {
    return this.violationCodeService.update(+id, updateViolationCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.violationCodeService.remove(+id);
  }
}
