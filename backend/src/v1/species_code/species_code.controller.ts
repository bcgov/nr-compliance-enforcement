import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpeciesCodeService } from './species_code.service';
import { CreateSpeciesCodeDto } from './dto/create-species_code.dto';
import { UpdateSpeciesCodeDto } from './dto/update-species_code.dto';
import { JwtRoleGuard } from '../../auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../../enum/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags("species-code")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'species-code',
  version: '1'})
export class SpeciesCodeController {
  constructor(private readonly speciesCodeService: SpeciesCodeService) {}

  @Post()
  @Roles(Role.COS_OFFICER)
  create(@Body() createSpeciesCodeDto: CreateSpeciesCodeDto) {
    return this.speciesCodeService.create(createSpeciesCodeDto);
  }

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.speciesCodeService.findAll();
  }

  @Get(':id')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('id') id: string) {
    return this.speciesCodeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateSpeciesCodeDto: UpdateSpeciesCodeDto) {
    return this.speciesCodeService.update(id, updateSpeciesCodeDto);
  }

  @Delete(':id')
  @Roles(Role.COS_OFFICER)
  remove(@Param('id') id: string) {
    return this.speciesCodeService.remove(id);
  }
}
