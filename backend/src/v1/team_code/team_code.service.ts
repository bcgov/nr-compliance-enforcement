import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TeamCode } from "./entities/team_code.entity";
import { Repository } from "typeorm";

@Injectable()
export class TeamCodeService {
  constructor(
    @InjectRepository(TeamCode)
    private teamCodeRepository: Repository<TeamCode>,
  ) {}

  async findAll(): Promise<TeamCode[]> {
    return this.teamCodeRepository.find();
  }

  async findOne(id: any): Promise<TeamCode> {
    return this.teamCodeRepository.findOneOrFail(id);
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.teamCodeRepository.delete(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
