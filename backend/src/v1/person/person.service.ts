import { Injectable, Logger } from "@nestjs/common";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { Person } from "./entities/person.entity";
import { QueryRunner, DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);

  constructor(private readonly dataSource: DataSource) {}
  @InjectRepository(Person)
  private readonly personRepository: Repository<Person>;

  async create(person: any): Promise<Person> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newPersonString;
    try {
      newPersonString = this.personRepository.create(<CreatePersonDto>person);
      await queryRunner.manager.save(newPersonString);
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      newPersonString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newPersonString;
  }

  async createInTransaction(person: CreatePersonDto, queryRunner: QueryRunner): Promise<Person> {
    const newPerson = this.personRepository.create(person);
    await queryRunner.manager.save(newPerson);
    return newPerson;
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(person_guid: UUID) {
    return this.personRepository.findOneBy({ person_guid: person_guid });
  }

  async update(id: UUID, updatePersonDto: UpdatePersonDto) {
    await this.personRepository.update({ person_guid: id }, updatePersonDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }

  async findByZone(zone_code: any): Promise<Person[]> {
    const queryBuilder = this.personRepository
      .createQueryBuilder("person")
      .leftJoinAndSelect("person.officer", "officer")
      .leftJoinAndSelect("officer.office_guid", "office")
      .leftJoinAndSelect("office.cos_geo_org_unit", "cos_geo_org_unit_flat_mvw")
      .where("cos_geo_org_unit_flat_mvw.zone_code = :zone_code", { zone_code });
    return queryBuilder.getMany();
  }

  async findByOffice(office_guid: any): Promise<Person[]> {
    const queryBuilder = this.personRepository
      .createQueryBuilder("person")
      .leftJoinAndSelect("person.officer", "officer")
      .leftJoinAndSelect("officer.office_guid", "office")
      .leftJoinAndSelect("office.cos_geo_org_unit", "cos_geo_org_unit_flat_mvw")
      .where("office.office_guid = :office_guid", { office_guid });
    return queryBuilder.getMany();
  }
}
