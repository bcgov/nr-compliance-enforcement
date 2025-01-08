import { Injectable, Logger } from "@nestjs/common";
import { CreateOfficerTeamXrefDto } from "./dto/create-officer_team_xref.dto";
import { UpdateOfficerTeamXrefDto } from "./dto/update-officer_team_xref.dto";
import { OfficerTeamXref } from "./entities/officer_team_xref.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OfficerTeamXrefService {
  private readonly logger = new Logger(OfficerTeamXrefService.name);
  @InjectRepository(OfficerTeamXref)
  private readonly officerTeamXrefRepository: Repository<OfficerTeamXref>;

  constructor(private readonly dataSource: DataSource) {}

  async create(newOfficerTeamXref: CreateOfficerTeamXrefDto): Promise<OfficerTeamXref> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let result;
    try {
      result = this.officerTeamXrefRepository.create(newOfficerTeamXref);
      await queryRunner.manager.save(result);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      result = null;
    } finally {
      await queryRunner.release();
    }
    return result;
  }

  async createInTransaction(
    officerTeamXref: CreateOfficerTeamXrefDto,
    queryRunner: QueryRunner,
  ): Promise<OfficerTeamXref> {
    const newTeam = this.officerTeamXrefRepository.create(officerTeamXref);
    await queryRunner.manager.save(newTeam);
    return newTeam;
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
