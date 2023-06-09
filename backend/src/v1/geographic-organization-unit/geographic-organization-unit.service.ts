import { Injectable } from '@nestjs/common';
import { CreateGeographicOrganizationUnitDto } from './dto/create-geographic-organization-unit.dto';
import { UpdateGeographicOrganizationUnitDto } from './dto/update-geographic-organization-unit.dto';

@Injectable()
export class GeographicOrganizationUnitService {
  create(createGeographicOrganizationUnitDto: CreateGeographicOrganizationUnitDto) {
    return 'This action adds a new geographicOrganizationUnit';
  }

  findAll() {
    return `This action returns all geographicOrganizationUnit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geographicOrganizationUnit`;
  }

  update(id: number, updateGeographicOrganizationUnitDto: UpdateGeographicOrganizationUnitDto) {
    return `This action updates a #${id} geographicOrganizationUnit`;
  }

  remove(id: number) {
    return `This action removes a #${id} geographicOrganizationUnit`;
  }
}
