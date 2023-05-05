import { Injectable } from '@nestjs/common';
import { CreateGeoOrganizationUnitCodeDto } from './dto/create-geo_organization_unit_code.dto';
import { UpdateGeoOrganizationUnitCodeDto } from './dto/update-geo_organization_unit_code.dto';

@Injectable()
export class GeoOrganizationUnitCodeService {
  create(createGeoOrganizationUnitCodeDto: CreateGeoOrganizationUnitCodeDto) {
    return 'This action adds a new geoOrganizationUnitCode';
  }

  findAll() {
    return `This action returns all geoOrganizationUnitCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoOrganizationUnitCode`;
  }

  update(id: number, updateGeoOrganizationUnitCodeDto: UpdateGeoOrganizationUnitCodeDto) {
    return `This action updates a #${id} geoOrganizationUnitCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoOrganizationUnitCode`;
  }
}
