import { Injectable } from "@nestjs/common";
import { CreateAgencyCodeDto } from "./dto/create-agency_code.dto";
import { UpdateAgencyCodeDto } from "./dto/update-agency_code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AgencyCode } from "./entities/agency_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class AgencyCodeService {
  constructor(
    @InjectRepository(AgencyCode)
    private agencyCodeRepository: Repository<AgencyCode>,
  ) {}

  async create(agencyCode: CreateAgencyCodeDto): Promise<AgencyCode> {
    const newAgencyCode = this.agencyCodeRepository.create(agencyCode);
    await this.agencyCodeRepository.save(newAgencyCode);
    return newAgencyCode;
  }

  async findAll(): Promise<AgencyCode[]> {
    return this.agencyCodeRepository.find();
  }

  async findOne(id: any): Promise<AgencyCode> {
    return this.agencyCodeRepository.findOneOrFail(id);
  }

  async findById(id: any): Promise<AgencyCode> {
    return this.agencyCodeRepository.findOneByOrFail({ agency_code: id });
  }

  async update(agency_code: string, updateAgencyCodeDto: UpdateAgencyCodeDto): Promise<AgencyCode> {
    await this.agencyCodeRepository.update({ agency_code }, updateAgencyCodeDto);
    return this.findOne(agency_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.agencyCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
