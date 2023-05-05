import { Injectable } from '@nestjs/common';
import { CreateComplaintStatusCodeDto } from './dto/create-complaint_status_code.dto';
import { UpdateComplaintStatusCodeDto } from './dto/update-complaint_status_code.dto';

@Injectable()
export class ComplaintStatusCodeService {
  create(createComplaintStatusCodeDto: CreateComplaintStatusCodeDto) {
    return 'This action adds a new complaintStatusCode';
  }

  findAll() {
    return `This action returns all complaintStatusCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} complaintStatusCode`;
  }

  update(id: number, updateComplaintStatusCodeDto: UpdateComplaintStatusCodeDto) {
    return `This action updates a #${id} complaintStatusCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} complaintStatusCode`;
  }
}
