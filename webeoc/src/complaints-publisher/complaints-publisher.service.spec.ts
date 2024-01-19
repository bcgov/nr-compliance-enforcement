import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintsPublisherService } from './complaints-publisher.service';

describe('ComplaintsPublisherService', () => {
  let service: ComplaintsPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintsPublisherService],
    }).compile();

    service = module.get<ComplaintsPublisherService>(
      ComplaintsPublisherService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
