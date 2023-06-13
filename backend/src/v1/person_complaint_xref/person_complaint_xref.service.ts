import { Injectable } from '@nestjs/common';
import { CreatePersonComplaintXrefDto } from './dto/create-person_complaint_xref.dto';
import { UpdatePersonComplaintXrefDto } from './dto/update-person_complaint_xref.dto';
import { PersonComplaintXref } from './entities/person_complaint_xref.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PersonComplaintXrefService {

  constructor(
    @InjectRepository(PersonComplaintXref)
    private personComplaintXrefRepository: Repository<PersonComplaintXref>
  ) {}


  create(createPersonComplaintXrefDto: CreatePersonComplaintXrefDto) {
    return 'This action adds a new personComplaintXref';
  }

  findAll(): Promise<PersonComplaintXref[]> {
    return this.personComplaintXrefRepository.find({
      relations: { 

      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} personComplaintXref`;
  }

  update(id: number, updatePersonComplaintXrefDto: UpdatePersonComplaintXrefDto) {
    return `This action updates a #${id} personComplaintXref`;
  }

  remove(id: number) {
    return `This action removes a #${id} personComplaintXref`;
  }
}
