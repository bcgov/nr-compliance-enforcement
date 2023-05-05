import { Injectable } from '@nestjs/common';
import { CreateAllegationComplaintDto } from './dto/create-allegation_complaint.dto';
import { UpdateAllegationComplaintDto } from './dto/update-allegation_complaint.dto';

@Injectable()
export class AllegationComplaintService {
  create(createAllegationComplaintDto: CreateAllegationComplaintDto) {
    return 'This action adds a new allegationComplaint';
  }

  findAll() {
    return `This action returns all allegationComplaint`;
  }

  findOne(id: number) {
    return `This action returns a #${id} allegationComplaint`;
  }

  update(id: number, updateAllegationComplaintDto: UpdateAllegationComplaintDto) {
    return `This action updates a #${id} allegationComplaint`;
  }

  remove(id: number) {
    return `This action removes a #${id} allegationComplaint`;
  }
}
