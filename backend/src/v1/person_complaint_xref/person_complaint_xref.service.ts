import { Injectable } from '@nestjs/common';
import { CreatePersonComplaintXrefDto } from './dto/create-person_complaint_xref.dto';
import { PersonComplaintXref } from './entities/person_complaint_xref.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PersonComplaintXrefService {

  constructor(
    @InjectRepository(PersonComplaintXref)
    private personComplaintXrefRepository: Repository<PersonComplaintXref>
  ) {}


  async create(createPersonComplaintXrefDto: CreatePersonComplaintXrefDto): Promise<PersonComplaintXref> {
    const newPersonComplaintXref = this.personComplaintXrefRepository.create(createPersonComplaintXrefDto);
    await this.personComplaintXrefRepository.save(createPersonComplaintXrefDto);
    return newPersonComplaintXref;

  }

  async findAll(): Promise<PersonComplaintXref[]> {
    return this.personComplaintXrefRepository.find({
      relations: { 
        person_guid: true,
        complaint_identifier: true
      }
    });
  }

  async findOne(person_complaint_xref_guid: any): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.findOne({
      where: {personComplaintXrefGuid:person_complaint_xref_guid},
      relations: {
        person_guid: true,
        complaint_identifier: true
      }    
    });
  }

  async findByComplaint(complaint_identifier: any) : Promise<PersonComplaintXref[]> {
    return this.personComplaintXrefRepository.find({
      where: { complaint_identifier: complaint_identifier,
      active_ind: true },
      relations: {
        person_guid: true,
        complaint_identifier: true
      } ,

    });
  }


  async update(person_complaint_xref_guid: any, updatePersonComplaintXrefDto) : Promise<PersonComplaintXref> {
    await this.personComplaintXrefRepository.update(person_complaint_xref_guid, updatePersonComplaintXrefDto);
    return this.findOne(person_complaint_xref_guid);
  }

  remove(id: string) {
    return `This action removes a #${id} personComplaintXref`;
  }
}
