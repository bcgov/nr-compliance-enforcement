import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateOfficerTeamXrefDto } from "./dto/create-officer_team_xref.dto";
import { UpdateOfficerTeamXrefDto } from "./dto/update-officer_team_xref.dto";
import { OfficerTeamXref } from "./entities/officer_team_xref.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class OfficerTeamXrefService {
  private readonly logger = new Logger(OfficerTeamXrefService.name);
  @InjectRepository(OfficerTeamXref)
  private officerTeamXrefRepository: Repository<OfficerTeamXref>;

  constructor(@Inject(REQUEST) private request: Request, private dataSource: DataSource) {}

  async create(queryRunner: QueryRunner, createOfficerTeamXrefDto: CreateOfficerTeamXrefDto) {
    const createdValue = await this.officerTeamXrefRepository.create(createOfficerTeamXrefDto);
    queryRunner.manager.save(createdValue);
    return createdValue;
  }

  async findAll(): Promise<OfficerTeamXref[]> {
    return this.officerTeamXrefRepository.find({
      relations: {
        officer_guid: true,
        team_guid: true,
      },
      order: {
        officer_guid: "ASC",
        team_guid: "ASC",
      },
    });
  }

  async findOne(id: any): Promise<OfficerTeamXref> {
    return this.officerTeamXrefRepository.findOneOrFail({
      where: { officer_guid: id },
      relations: {
        officer_guid: true,
        team_guid: true,
      },
    });
  }

  async findByOfficer(officerGuid: any): Promise<OfficerTeamXref> {
    return this.officerTeamXrefRepository.findOne({
      where: { officer_guid: officerGuid },
    });
  }

  async update(id, updateOfficerTeamXrefDto: UpdateOfficerTeamXrefDto) {
    await this.officerTeamXrefRepository.update({ officer_team_xref_guid: id }, updateOfficerTeamXrefDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} OfficerTeamXref`;
  }
}
