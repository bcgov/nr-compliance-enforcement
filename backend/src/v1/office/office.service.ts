import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UUID } from "crypto";

import { CreateOfficeDto } from "./dto/create-office.dto";
import { UpdateOfficeDto } from "./dto/update-office.dto";
import { Office } from "./entities/office.entity";
import { OfficeAssignmentDto } from "../../types/models/office/office-assignment-dto";

@Injectable()
export class OfficeService {
  private readonly logger = new Logger(OfficeService.name);

  constructor(private dataSource: DataSource) {}
  @InjectRepository(Office)
  private officeRepository: Repository<Office>;

  async create(office: any): Promise<Office> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newOfficeString;
    try {
      newOfficeString = await this.officeRepository.create(<CreateOfficeDto>office);
      await queryRunner.manager.save(newOfficeString);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      newOfficeString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newOfficeString;
  }

  findByGeoOrgCode = (geo_org_code: any) => {
    return this.officeRepository.find({
      where: { cos_geo_org_unit: geo_org_code },
      relations: {},
    });
  };

  findOne = async (id: UUID): Promise<Office> => {
    return this.officeRepository.findOneByOrFail({ office_guid: id });
  };

  findOfficesByZone = (zone_code: string) => {
    const queryBuilder = this.officeRepository
      .createQueryBuilder("office")
      .leftJoinAndSelect("office.cos_geo_org_unit", "cos_geo_org_unit")
      .leftJoinAndSelect("office.officers", "officer")
      .leftJoinAndSelect("officer.person_guid", "person")
      .where("cos_geo_org_unit.zone_code = :Zone", { Zone: zone_code })
      .distinctOn(["cos_geo_org_unit.offloc_code"]);

    return queryBuilder.getMany();
  };

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return `This action updates a #${id} office`;
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }

  findOffices = async (): Promise<Array<OfficeAssignmentDto>> => {
    const queryBuilder = this.officeRepository
      .createQueryBuilder("office")
      .select(["office.office_guid", "office.agency_code_ref"])
      .leftJoin("office.cos_geo_org_unit", "organization")
      .addSelect("organization.office_location_name");

    const data = await queryBuilder.getMany();

    const results = data.map((item) => {
      const {
        office_guid: id,
        cos_geo_org_unit: { office_location_name: name },
        agency_code_ref: agency,
      } = item;
      const record: OfficeAssignmentDto = { id, name, agency };
      return record;
    });

    return results;
  };
}
