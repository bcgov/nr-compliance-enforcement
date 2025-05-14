import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GirTypeCode } from "./entities/gir_type_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class GirTypeCodeService {
  constructor(
    @InjectRepository(GirTypeCode)
    private girTypeCodeRepository: Repository<GirTypeCode>,
  ) {}

  async findOne(code: string): Promise<GirTypeCode> {
    return this.girTypeCodeRepository.findOneBy({ gir_type_code: code });
  }

  async findAll(): Promise<GirTypeCode[]> {
    return this.girTypeCodeRepository.find();
  }
}
