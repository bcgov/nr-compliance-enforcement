import { Injectable } from '@nestjs/common';
import { CreateAttractantHwcrXrefDto } from './dto/create-attractant_hwcr_xref.dto';
import { UpdateAttractantHwcrXrefDto } from './dto/update-attractant_hwcr_xref.dto';
import { AttractantHwcrXref } from './entities/attractant_hwcr_xref.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';
import { CreateHwcrComplaintDto } from '../hwcr_complaint/dto/create-hwcr_complaint.dto';

@Injectable()
export class AttractantHwcrXrefService {
    constructor(
    ) {
    }
    @InjectRepository(AttractantHwcrXref)
    private hwcrComplaintsRepository: Repository<AttractantHwcrXref>;

  async create(createAttractantHwcrXrefDto: CreateAttractantHwcrXrefDto) {
      await this.hwcrComplaintsRepository.create(<CreateComplaintDto>createAttractantHwcrXrefDto);
      const newAttratantHwcrXref = this.hwcrComplaintsRepository.create(<CreateHwcrComplaintDto>createAttractantHwcrXrefDto);
      await this.hwcrComplaintsRepository.save(newAttratantHwcrXref);
      return newAttratantHwcrXref;
  }

  async findAll(): Promise<AttractantHwcrXref[]> {
    return this.hwcrComplaintsRepository.find({
      relations: { 
        attractant_code: true,
        hwcr_complaint: true
      },
    });
  }

  async findOne(id: any): Promise<AttractantHwcrXref> {
    return this.hwcrComplaintsRepository.findOneOrFail({
      where: {attractant_hwcr_xref_guid: id},
      relations: { 
        attractant_code: true,
        hwcr_complaint: true
      },
    });
  }

  update(id: number, updateAttractantHwcrXrefDto: UpdateAttractantHwcrXrefDto) {
    return `This action updates a #${id} attractantHwcrXref`;
  }

  remove(id: number) {
    return `This action removes a #${id} attractantHwcrXref`;
  }
}
