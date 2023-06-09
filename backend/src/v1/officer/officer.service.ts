import { Inject, Injectable } from '@nestjs/common';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { CreatePersonDto } from '../person/dto/create-person.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';
import { Officer } from './entities/officer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PersonService } from '../person/person.service';
import { OfficeService } from '../office/office.service';

@Injectable()
export class OfficerService {
  constructor(private dataSource: DataSource) {
  }
  @InjectRepository(Officer)
  private officerRepository: Repository<Officer>;
  @Inject(PersonService)
  protected readonly personService: PersonService;
  @Inject(OfficeService)
  protected readonly officeService: OfficeService;

  async create(officer: any): Promise<Officer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newOfficerString;
    let officeObject;
    let personObject;

    try
    {

      //Look for the Office (or throw an error)
      officeObject = await this.officeService.findOne(officer.geo_organization_unit_code);
      officer.office_guid = officeObject.office_guid;
      
      //Will always insert the person
      personObject = await this.personService.createInTransaction(<CreatePersonDto>officer, queryRunner);
      officer.person_guid = personObject.person_guid;

      newOfficerString = await this.officerRepository.create(<CreateOfficerDto>officer);
      await queryRunner.manager.save(newOfficerString);
      await queryRunner.commitTransaction();
    }
    catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      newOfficerString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newOfficerString;
  }

  findAll() {
    return this.officerRepository.find({
      relations: {
        office_guid: {
          geo_organization_unit_code: true
        },
        person_guid: {

        }
      } ,
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} officer`;
  }

  update(id: number, updateOfficerDto: UpdateOfficerDto) {
    return `This action updates a #${id} officer`;
  }

  remove(id: number) {
    return `This action removes a #${id} officer`;
  }
}
