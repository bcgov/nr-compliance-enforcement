import { Injectable } from "@nestjs/common";
import { CreateFeatureCodeDto } from "./dto/create-feature_code.dto";
import { UpdateFeatureCodeDto } from "./dto/update-feature_code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FeatureCode } from "./entities/feature_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class FeatureCodeService {
  constructor(
    @InjectRepository(FeatureCode)
    private featureCodeRepository: Repository<FeatureCode>,
  ) {}

  async create(feature_code: CreateFeatureCodeDto): Promise<FeatureCode> {
    const newFeatureCode = this.featureCodeRepository.create(feature_code);
    await this.featureCodeRepository.save(newFeatureCode);
    return newFeatureCode;
  }

  async findAll(): Promise<FeatureCode[]> {
    return this.featureCodeRepository.find();
  }

  async findOne(id: string): Promise<FeatureCode> {
    return this.featureCodeRepository.findOneByOrFail({ feature_code: id });
  }

  async update(feature_code: string, updateFeatureCodeDto: UpdateFeatureCodeDto): Promise<FeatureCode> {
    await this.featureCodeRepository.update({ feature_code }, updateFeatureCodeDto);
    return this.findOne(feature_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.featureCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
