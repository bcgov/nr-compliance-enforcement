import { Injectable } from '@nestjs/common';
import { CreateGeoOrgUnitTypeCodeDto } from './dto/create-geo_org_unit_type_code.dto';
import { UpdateGeoOrgUnitTypeCodeDto } from './dto/update-geo_org_unit_type_code.dto';

@Injectable()
export class GeoOrgUnitTypeCodeService {
  create(createGeoOrgUnitTypeCodeDto: CreateGeoOrgUnitTypeCodeDto) {
    return 'This action adds a new geoOrgUnitTypeCode';
  }

  findAll() {
    return `This action returns all geoOrgUnitTypeCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoOrgUnitTypeCode`;
  }

  update(id: number, updateGeoOrgUnitTypeCodeDto: UpdateGeoOrgUnitTypeCodeDto) {
    return `This action updates a #${id} geoOrgUnitTypeCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoOrgUnitTypeCode`;
  }
}
