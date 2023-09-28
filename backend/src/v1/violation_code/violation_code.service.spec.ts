import { Test, TestingModule } from '@nestjs/testing';
import { ViolationCodeService } from './violation_code.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ViolationCode } from './entities/violation_code.entity';
import { Repository } from 'typeorm';
import { ViolationCodeRepositoryMockFactory } from '../../../test/mocks/violationCodeRepositoryMockFactory';

describe('ViolationCodeService', () => {
  let service: ViolationCodeService;
  let repository: Repository<ViolationCode>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViolationCodeService,
        {
          provide: getRepositoryToken(ViolationCode),
          useFactory: ViolationCodeRepositoryMockFactory,
        },],
    }).compile();

    service = module.get<ViolationCodeService>(ViolationCodeService);
    repository = module.get<Repository<ViolationCode>>(getRepositoryToken(ViolationCode));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a single value', async () => {
    const violationCode = "AINVSPC";

    let response = (await service.findOne(violationCode));

    expect(response.violation_code).toBe('AINVSPC');
    expect(response.short_description).toBe('Aquatic: Invasive Species');
  });

  it('should return all the values', async () => {
    let response = await service.findAll();

    expect(response).toHaveLength(3);
  });

  it('should be able to create a value', async () => {
    const violationCodeDto = { 
                              violation_code: "NEWCODE",
                              short_description: "New description",
                              long_description: "New long description",
                              display_order: "10",
                              active_ind: "Y"
                            };
    
    let response = await service.create(violationCodeDto);
    expect(response.violation_code).toBe('NEWCODE');
    expect(response.short_description).toBe('New description');
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should be able to update a value', async () => {
    const violationCode = "AINVSPC"; 
    const violationCodeDto = { 
                              violation_code: "AINVSPC",
                              short_description: "Updated Value",
                              long_description: "Aquatic: Invasive Species",
                              display_order: "1",
                              active_ind: "Y"
                            };
    
    await service.update(violationCode, violationCodeDto);
    expect(repository.update).toHaveBeenCalled();
  });

  it('should be able to remove a value if it exists', async () => {
    const goodViolationCode = "AINVSPC"; 
    const badViolationCode = "BADVALUE"; 

    let response = await service.remove(goodViolationCode);

    expect(response.deleted).toBe(true);
    expect(repository.delete).toHaveBeenCalled();

    response = await service.remove(badViolationCode);

    expect(response.deleted).toBe(false);
    expect(repository.delete).toHaveBeenCalled();
  });

});
