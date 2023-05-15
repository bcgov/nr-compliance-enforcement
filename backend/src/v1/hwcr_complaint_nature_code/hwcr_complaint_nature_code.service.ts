import { Injectable } from '@nestjs/common';
import { CreateHwcrComplaintNatureCodeDto } from './dto/create-hwcr_complaint_nature_code.dto';
import { UpdateHwcrComplaintNatureCodeDto } from './dto/update-hwcr_complaint_nature_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HwcrComplaintNatureCode } from './entities/hwcr_complaint_nature_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HwcrComplaintNatureCodeService {
  constructor(
    @InjectRepository(HwcrComplaintNatureCode)
    private hwcrComplaintNatureCodeRepository: Repository<HwcrComplaintNatureCode>
  ) {}

  async create(createHwcrComplaintNatureCodeDto: CreateHwcrComplaintNatureCodeDto): Promise<HwcrComplaintNatureCode> {
    const newHwcrComplaintNatureCode = this.hwcrComplaintNatureCodeRepository.create(createHwcrComplaintNatureCodeDto);
    await this.hwcrComplaintNatureCodeRepository.save(newHwcrComplaintNatureCode);
    return newHwcrComplaintNatureCode;
  }

  async findAll(): Promise<HwcrComplaintNatureCode[]> {
    return this.hwcrComplaintNatureCodeRepository.find();
  }

  async findOne(id: any): Promise<HwcrComplaintNatureCode> {
    return this.hwcrComplaintNatureCodeRepository.findOneOrFail(id);
  }

  async update(hwcr_complaint_nature_code: string, updateHwcrComplaintNatureCodeDto: UpdateHwcrComplaintNatureCodeDto): Promise<HwcrComplaintNatureCode> {
    await this.hwcrComplaintNatureCodeRepository.update({ hwcr_complaint_nature_code }, updateHwcrComplaintNatureCodeDto);
    return this.findOne(hwcr_complaint_nature_code);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.hwcrComplaintNatureCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
