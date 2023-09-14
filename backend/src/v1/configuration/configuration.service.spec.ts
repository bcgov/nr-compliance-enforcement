import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigurationService,{
        provide: getRepositoryToken(Configuration),
        useValue: {

        },
      },],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
