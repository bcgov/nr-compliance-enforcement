import { Injectable } from "@nestjs/common";
import { CreateGeoOrgUnitStructureDto } from "./dto/create-geo_org_unit_structure.dto";
import { UpdateGeoOrgUnitStructureDto } from "./dto/update-geo_org_unit_structure.dto";
import { GeoOrgUnitStructure } from "./entities/geo_org_unit_structure.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class GeoOrgUnitStructureService {
  @InjectRepository(GeoOrgUnitStructure)
  private geoOrgUnitStructureRepository: Repository<GeoOrgUnitStructure>;

  async create(createGeoOrgUnitStructureDto: CreateGeoOrgUnitStructureDto) {
    return "This action adds a new geoOrgUnitStructure";
  }

  findAll() {
    return this.geoOrgUnitStructureRepository.find({
      relations: {
        parent_geo_org_unit_code: {},
        child_geo_org_unit_code: {},
      },
    });
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
