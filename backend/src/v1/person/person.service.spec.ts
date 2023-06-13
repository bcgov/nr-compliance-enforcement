import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { dataSourceMockFactory } from '../../../test/mocks/datasource';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: {

          },
        },
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory
        }
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
