import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  create(createGeoOrgUnitStructureDto: CreateComplaintDto) {
    return 'This action adds a new geoOrgUnitStructure';
  }

  findAll() {
    return `This action returns all geoOrgUnitStructure`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoOrgUnitStructure`;
  }

  update(id: number, updateGeoOrgUnitStructureDto: UpdateComplaintDto) {
    return `This action updates a #${id} geoOrgUnitStructure`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoOrgUnitStructure`;
  }
}
