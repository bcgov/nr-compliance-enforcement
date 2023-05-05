import { Injectable } from '@nestjs/common';
import { CreateGeoOrgUnitStructureDto } from './dto/create-geo_org_unit_structure.dto';
import { UpdateGeoOrgUnitStructureDto } from './dto/update-geo_org_unit_structure.dto';

@Injectable()
export class GeoOrgUnitStructureService {
  create(createGeoOrgUnitStructureDto: CreateGeoOrgUnitStructureDto) {
    return 'This action adds a new geoOrgUnitStructure';
  }

  findAll() {
    return `This action returns all geoOrgUnitStructure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoOrgUnitStructure`;
  }

  update(id: number, updateGeoOrgUnitStructureDto: UpdateGeoOrgUnitStructureDto) {
    return `This action updates a #${id} geoOrgUnitStructure`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoOrgUnitStructure`;
  }
}
