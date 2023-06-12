import { Injectable } from '@nestjs/common';
import { CreatePersonComplaintXrefDto } from './dto/create-person_complaint_xref.dto';
import { UpdatePersonComplaintXrefDto } from './dto/update-person_complaint_xref.dto';

@Injectable()
export class PersonComplaintXrefService {
  create(createPersonComplaintXrefDto: CreatePersonComplaintXrefDto) {
    return 'This action adds a new personComplaintXref';
  }

  findAll() {
    return `This action returns all personComplaintXref`;
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
