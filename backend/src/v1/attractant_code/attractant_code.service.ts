import { Injectable } from "@nestjs/common";
import { CreateAttractantCodeDto } from "./dto/create-attractant_code.dto";
import { UpdateAttractantCodeDto } from "./dto/update-attractant_code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AttractantCode } from "./entities/attractant_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class AttractantCodeService {
  constructor(
    @InjectRepository(AttractantCode)
    private attractantCodeRepository: Repository<AttractantCode>,
  ) {}

  async create(attractantCode: CreateAttractantCodeDto): Promise<AttractantCode> {
    const newAttractantCode = this.attractantCodeRepository.create(attractantCode);
    await this.attractantCodeRepository.save(newAttractantCode);
    return newAttractantCode;
  }

  async findAll(): Promise<AttractantCode[]> {
    return this.attractantCodeRepository.find({
      order: {
        display_order: "ASC",
      },
    });
  }

  async findOne(id: any): Promise<AttractantCode> {
    return this.attractantCodeRepository.findOneOrFail(id);
  }

  async update(attractant_code: string, updateAttractantCodeDto: UpdateAttractantCodeDto): Promise<AttractantCode> {
    await this.attractantCodeRepository.update({ attractant_code }, updateAttractantCodeDto);
    return this.findOne(attractant_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.attractantCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
