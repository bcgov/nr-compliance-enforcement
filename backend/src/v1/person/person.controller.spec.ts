import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity'
import { DataSource } from 'typeorm';
import { dataSourceMockFactory } from '../../../test/mocks/datasource';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: {

          }
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        }
      ],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
