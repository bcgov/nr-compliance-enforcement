import { Injectable } from '@nestjs/common';
import { CreateViolationCodeDto } from './dto/create-violation_code.dto';
import { UpdateViolationCodeDto } from './dto/update-violation_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ViolationCode } from './entities/violation_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViolationCodeService {
  constructor(
    @InjectRepository(ViolationCode)
    private violationCodeRepository: Repository<ViolationCode>
  ) {}

  async create(violation_code: CreateViolationCodeDto): Promise<ViolationCode> {
    const newViolationCode = this.violationCodeRepository.create(violation_code);
    await this.violationCodeRepository.save(newViolationCode);
    return newViolationCode;
  }

  async findAll(): Promise<ViolationCode[]> {
    return this.violationCodeRepository.find();
  }

  async findOne(id: string): Promise<ViolationCode> {
    return this.violationCodeRepository.findOneByOrFail({violation_code: id});
  }

  async update(violation_code: string, updateViolationCodeDto: UpdateViolationCodeDto): Promise<ViolationCode> {
    await this.violationCodeRepository.update({ violation_code }, updateViolationCodeDto);
    return this.findOne(violation_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.violationCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
