import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonService {
  constructor(private dataSource: DataSource) {
  }
  @InjectRepository(Person)
  private personRepository: Repository<Person>;

  async create(person: any): Promise<Person> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    var newPersonString;
    try
    {
      newPersonString = await this.personRepository.create(<CreatePersonDto>person);
      var newPerson : Person;
      newPerson = <Person>await queryRunner.manager.save(newPersonString);
      await queryRunner.commitTransaction();
    }
    catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      newPersonString = "Error Occured";
    } finally {
      await queryRunner.release();
    }
    return newPersonString;
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
