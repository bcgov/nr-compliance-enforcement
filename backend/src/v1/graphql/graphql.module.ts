import { Module } from '@nestjs/common';
import { GraphqlService } from './graphql.service';
import { GraphqlController } from './graphql.controller';

@Module({
  controllers: [GraphqlController],
  providers: [GraphqlService]
})
export class GraphqlModule {}
