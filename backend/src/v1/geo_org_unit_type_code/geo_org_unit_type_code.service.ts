import { Injectable } from '@nestjs/common';
import { CreateGeoOrgUnitTypeCodeDto } from './dto/create-geo_org_unit_type_code.dto';
import { UpdateGeoOrgUnitTypeCodeDto } from './dto/update-geo_org_unit_type_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GeoOrgUnitTypeCode } from './entities/geo_org_unit_type_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeoOrgUnitTypeCodeService {
  constructor(
    @InjectRepository(GeoOrgUnitTypeCode)
    private geoOrgUnitTypeCodeRepository: Repository<GeoOrgUnitTypeCode>
  ) {}

  async create(user: CreateGeoOrgUnitTypeCodeDto): Promise<GeoOrgUnitTypeCode> {
    const newGeoOrgUniteTypeCode = this.geoOrgUnitTypeCodeRepository.create(user);
    await this.geoOrgUnitTypeCodeRepository.save(newGeoOrgUniteTypeCode);
    return newGeoOrgUniteTypeCode;
  }

  async findAll(): Promise<GeoOrgUnitTypeCode[]> {
    return this.geoOrgUnitTypeCodeRepository.find();
  }

  async findOne(id: any): Promise<GeoOrgUnitTypeCode> {
    return this.geoOrgUnitTypeCodeRepository.findOneOrFail(id);
  }

  async update(geo_org_unit_type_code: string, updateGeoOrgUnitTypeCodeDto: UpdateGeoOrgUnitTypeCodeDto): Promise<GeoOrgUnitTypeCode> {
    await this.geoOrgUnitTypeCodeRepository.update({ geo_org_unit_type_code }, updateGeoOrgUnitTypeCodeDto);
    return this.findOne(geo_org_unit_type_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.geoOrgUnitTypeCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
