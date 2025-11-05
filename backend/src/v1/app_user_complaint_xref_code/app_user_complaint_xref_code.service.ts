import { Injectable } from "@nestjs/common";
import { CreateAppUserComplaintXrefCodeDto } from "./dto/create-app_user_complaint_xref_code.dto";
import { UpdateAppUserComplaintXrefCodeDto } from "./dto/update-app_user_complaint_xref_code.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AppUserComplaintXrefCode } from "./entities/app_user_complaint_xref_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class AppUserComplaintXrefCodeService {
  constructor(
    @InjectRepository(AppUserComplaintXrefCode)
    private readonly appUserComplaintXrefCodeRepository: Repository<AppUserComplaintXrefCode>,
  ) {}

  async create(createAppUserComplaintXrefCode: CreateAppUserComplaintXrefCodeDto) {
    const newAppUserComplaintXrefCodeDto =
      this.appUserComplaintXrefCodeRepository.create(createAppUserComplaintXrefCode);
    await this.appUserComplaintXrefCodeRepository.save(newAppUserComplaintXrefCodeDto);
    return newAppUserComplaintXrefCodeDto;
  }

  async findAll(): Promise<AppUserComplaintXrefCode[]> {
    return this.appUserComplaintXrefCodeRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} personComplaintXrefCode`;
  }

  async update(id: number, updateAppUserComplaintXrefCodeDto: UpdateAppUserComplaintXrefCodeDto) {
    return `This action updates a #${id} personComplaintXrefCode`;
  }

  async remove(id: number) {
    return `This action removes a #${id} personComplaintXrefCode`;
  }
}
