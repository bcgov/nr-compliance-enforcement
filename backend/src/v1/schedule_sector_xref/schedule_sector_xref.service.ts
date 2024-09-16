import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ScheduleSectorXref } from "./entities/schedule_sector_xref.entity";

@Injectable()
export class ScheduleSectorXrefService {
  constructor(
    @InjectRepository(ScheduleSectorXref)
    private scheduleSectorXrefRepository: Repository<ScheduleSectorXref>,
  ) {}

  async findAll(): Promise<ScheduleSectorXref[]> {
    return this.scheduleSectorXrefRepository.find();
  }
}
