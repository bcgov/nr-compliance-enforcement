import { Controller, Get, Param } from '@nestjs/common';
import { BcGeoCoderService } from './bc_geo_coder.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../enum/role.enum';

@Controller('bc-geo-coder')
export class BcGeoCoderController {
  constructor(private readonly bcGeoCoderService: BcGeoCoderService) {}

  @Get('/address/:query')
  @Roles(Role.COS_OFFICER)
  findAll(@Param('query') query: string) {
    return this.bcGeoCoderService.findAll(query);
  }

}
