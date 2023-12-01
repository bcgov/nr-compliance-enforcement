import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateOfficerDto } from "./dto/create-officer.dto";
import { CreatePersonDto } from "../person/dto/create-person.dto";
import { UpdateOfficerDto } from "./dto/update-officer.dto";
import { Officer } from "./entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { AgencyCode } from "../agency_code/entities/agency_code.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { UUID } from "crypto";

@Injectable()
export class OfficerService {
  private readonly logger = new Logger(OfficerService.name);

  constructor(private dataSource: DataSource) {}
  @InjectRepository(Officer)
  private officerRepository: Repository<Officer>;
  @Inject(PersonService)
  protected readonly personService: PersonService;
  @Inject(OfficeService)
  protected readonly officeService: OfficeService;

  async findAll(): Promise<Officer[]> {
    return this.officerRepository
      .createQueryBuilder("officer")
      .leftJoinAndSelect("officer.office_guid", "office")
      .leftJoinAndSelect("officer.person_guid", "person")
      .leftJoinAndSelect("office.agency_code", "agency")
      .leftJoinAndSelect("office.cos_geo_org_unit", "cos_geo_org_unit")
      .leftJoinAndSelect("office.agency_code", "agency_code")
      .orderBy("person.last_name", "ASC")
      .getMany();
  }

  async findByOffice(office_guid: any): Promise<Officer[]> {
    return this.officerRepository.find({
      where: { office_guid: office_guid },
      relations: {
        office_guid: {
          cos_geo_org_unit: true,
        },
        person_guid: {},
      },
    });
  }

  async findByAuthUserGuid(auth_user_guid: any): Promise<Officer> {
    return this.officerRepository.findOne({
      where: { auth_user_guid: auth_user_guid },
      relations: {
        person_guid: {},
      },
    });
  }

  async findByUserId(userid: string): Promise<Officer> {
    userid = userid.toUpperCase();
    return this.officerRepository.findOne({
      where: { user_id: userid },
      relations: {
        person_guid: {},
        office_guid: {
          cos_geo_org_unit: true,
          agency_code: true
        },
      },
    });
  }
  async findOne(officer_guid: any): Promise<Officer> {
    return await this.officerRepository.findOneOrFail({
      where: { officer_guid: officer_guid },
      relations: {
        person_guid: true,
        office_guid: {
          cos_geo_org_unit: true,
          agency_code: true
        },
      },
    });
  }

  async create(officer: any): Promise<Officer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newOfficerString;
    let officeObject;
    let personObject;

    try {
      //Look for the Office
      officeObject = await this.officeService.findByGeoOrgCode(
        officer.geo_organization_unit_code
      );
      if (officeObject.length === 0) {
        // insertOffice

        let agencyObject = new AgencyCode("COS");
        let officeObject = new Office();

        officeObject.agency_code = agencyObject;
        officeObject.cos_geo_org_unit = officer.geo_organization_unit_code;
        officeObject.create_user_id = officer.create_user_id;
        officeObject.create_utc_timestamp = officer.create_utc_timestamp;
        officeObject.update_user_id = officer.update_user_id;
        officeObject.update_utc_timestamp = officer.update_utc_timestamp;

        officeObject = await this.officeService.create(officeObject);
        officer.office_guid = officeObject.office_guid;
      } else {
        // use the existing one
        officer.office_guid = officeObject[0].office_guid;
      }

      //Will always insert the person
      personObject = await this.personService.createInTransaction(
        <CreatePersonDto>officer,
        queryRunner
      );
      officer.person_guid = personObject.person_guid;

      newOfficerString = await this.officerRepository.create(
        <CreateOfficerDto>officer
      );
      await queryRunner.manager.save(newOfficerString);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      newOfficerString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newOfficerString;
  }

  async update(
    officer_guid: UUID,
    updateOfficerDto: UpdateOfficerDto
  ): Promise<Officer> {
    await this.officerRepository.update({ officer_guid }, updateOfficerDto);
    return this.findOne(officer_guid);
  }

  remove(id: number) {
    return `This action removes a #${id} officer`;
  }
}
