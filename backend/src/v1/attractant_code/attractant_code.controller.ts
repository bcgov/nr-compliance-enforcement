import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AttractantCodeService } from './attractant_code.service';
import { CreateAttractantCodeDto } from './dto/create-attractant_code.dto';
import { UpdateAttractantCodeDto } from './dto/update-attractant_code.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags("attractant-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'attractant-code',
  version: '1'})
export class AttractantCodeController {
  constructor(private readonly attractantCodeService: AttractantCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createAttractantCodeDto: CreateAttractantCodeDto) {
    return this.attractantCodeService.create(createAttractantCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.attractantCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.attractantCodeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateAttractantCodeDto: UpdateAttractantCodeDto) {
    return this.attractantCodeService.update(id, updateAttractantCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.attractantCodeService.remove(id);
  }
}
