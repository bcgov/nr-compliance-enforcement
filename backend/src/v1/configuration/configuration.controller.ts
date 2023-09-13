import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';

@ApiTags("configuration")
@UseGuards(JwtRoleGuard)
@Controller({
  path: 'configuration',
  version: '1'})
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  @Roles(Role.COS_OFFICER)
  findAll() {
    return this.configurationService.findAll();
  }

  @Get(':configurationCode')
  @Roles(Role.COS_OFFICER)
  findOne(@Param('configurationCode') configurationCode: string) {
    return this.configurationService.findOne(configurationCode);
  }

  @Patch(':id')
  @Roles(Role.COS_OFFICER)
  update(@Param('id') id: string, @Body() updateConfigurationDto: UpdateConfigurationDto) {
    return this.configurationService.update(+id, updateConfigurationDto);
  }
}
