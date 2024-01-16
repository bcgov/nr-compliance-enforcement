import { Test, TestingModule } from '@nestjs/testing';
import { ComplaintsSubscriberService } from './complaints-subscriber.service';

describe('ComplaintsSubscriberService', () => {
  let service: ComplaintsSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplaintsSubscriberService],
    }).compile();

    service = module.get<ComplaintsSubscriberService>(
      ComplaintsSubscriberService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
