import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlController } from './graphql.controller';
import { GraphqlService } from './graphql.service';

describe('GraphqlController', () => {
  let controller: GraphqlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphqlController],
      providers: [GraphqlService],
    }).compile();

    controller = module.get<GraphqlController>(GraphqlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
