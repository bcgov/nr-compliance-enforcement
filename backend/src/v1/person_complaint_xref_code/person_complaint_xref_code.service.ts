import { Injectable } from '@nestjs/common';
import { CreatePersonComplaintXrefCodeDto } from './dto/create-person_complaint_xref_code.dto';
import { UpdatePersonComplaintXrefCodeDto } from './dto/update-person_complaint_xref_code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonComplaintXrefCode } from './entities/person_complaint_xref_code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonComplaintXrefCodeService {
  constructor(
    @InjectRepository(PersonComplaintXrefCode)
    private personComplaintXrefCodeRepository: Repository<PersonComplaintXrefCode>
  ) {}

  async create(createPersonComplaintXrefCode: CreatePersonComplaintXrefCodeDto) {
    const newPersonComplaintXrefCodeDto= this.personComplaintXrefCodeRepository.create(createPersonComplaintXrefCode);
    await this.personComplaintXrefCodeRepository.save(newPersonComplaintXrefCodeDto);
    return newPersonComplaintXrefCodeDto;
  }

  async findAll(): Promise<PersonComplaintXrefCode[]> {
    return this.personComplaintXrefCodeRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} personComplaintXrefCode`;
  }

  async update(id: number, updatePersonComplaintXrefCodeDto: UpdatePersonComplaintXrefCodeDto) {
    return `This action updates a #${id} personComplaintXrefCode`;
  }

  async remove(id: number) {
    return `This action removes a #${id} personComplaintXrefCode`;
  }
}
