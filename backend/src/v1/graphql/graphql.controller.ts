import { Controller, Get } from '@nestjs/common';
import { GraphqlService } from './graphql.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags("graphql")
@Controller({
  path: "graphql",
  version: "1",
})
export class GraphqlController {
  constructor(private readonly graphqlService: GraphqlService) {}

  @Get()
  @Public()
  async getUsers() {
    return await this.graphqlService.fetchUsers();
  }
}
