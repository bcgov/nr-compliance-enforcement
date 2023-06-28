import { Injectable } from '@nestjs/common';
import { CreateGeoOrganizationUnitCodeDto } from './dto/create-geo_organization_unit_code.dto';
import { UpdateGeoOrganizationUnitCodeDto } from './dto/update-geo_organization_unit_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GeoOrganizationUnitCode } from './entities/geo_organization_unit_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeoOrganizationUnitCodeService {
  constructor(
    @InjectRepository(GeoOrganizationUnitCode)
    private geoOrganizationUnitCodeRepository: Repository<GeoOrganizationUnitCode>
  ) {}

  async create(geoOrganizationUnitCode: CreateGeoOrganizationUnitCodeDto): Promise<GeoOrganizationUnitCode> {
    const newGeoOrganizationUnitCode = this.geoOrganizationUnitCodeRepository.create(geoOrganizationUnitCode);
    await this.geoOrganizationUnitCodeRepository.save(newGeoOrganizationUnitCode);
    return newGeoOrganizationUnitCode;
  }

  async findAll(): Promise<GeoOrganizationUnitCode[]> {
    return this.geoOrganizationUnitCodeRepository.find();
  }

  async findDistinctGeoCodes(geo_org_unit_type_code: any): Promise<GeoOrganizationUnitCode[]> {
    return this.geoOrganizationUnitCodeRepository.find({
      where: {geo_org_unit_type_code: geo_org_unit_type_code},
    });
  }

  async findOne(id: any): Promise<GeoOrganizationUnitCode> {
    return this.geoOrganizationUnitCodeRepository.findOneOrFail(id);
  }

  async update(geo_organization_unit_code: string, updateGeoOrganizationUnitCodeDto: UpdateGeoOrganizationUnitCodeDto): Promise<GeoOrganizationUnitCode> {
    await this.geoOrganizationUnitCodeRepository.update({ geo_organization_unit_code }, updateGeoOrganizationUnitCodeDto);
    return this.findOne(geo_organization_unit_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.geoOrganizationUnitCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
