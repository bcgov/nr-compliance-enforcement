import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ViolationCodeService } from './violation_code.service';
import { CreateViolationCodeDto } from './dto/create-violation_code.dto';
import { UpdateViolationCodeDto } from './dto/update-violation_code.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags("violation-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'violation-code',
  version: '1'})
export class ViolationCodeController {
  constructor(private readonly violationCodeService: ViolationCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createViolationCodeDto: CreateViolationCodeDto) {
    return this.violationCodeService.create(createViolationCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.violationCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.violationCodeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateViolationCodeDto: UpdateViolationCodeDto) {
    return this.violationCodeService.update(id, updateViolationCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.violationCodeService.remove(id);
  }
}
