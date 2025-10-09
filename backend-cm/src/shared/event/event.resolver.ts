import { Logger, UseGuards } from "@nestjs/common";
import { JwtOrApiKeyGuard } from "../../auth/jwt-or-apikey.guard";
import { Args, Query, Mutation, Resolver } from "@nestjs/graphql";
import { Roles } from "../../auth/decorators/roles.decorator";
import { coreRoles } from "../../enum/role.enum";
import { GraphQLError } from "graphql";
import { EventService } from "./event.service";
import { EventCreateInput, EventFilters } from "./dto/event";

@UseGuards(JwtOrApiKeyGuard)
@Resolver("Event")
export class EventResolver {
  constructor(private readonly eventService: EventService) {}
  private readonly logger = new Logger(EventResolver.name);

  // This currently has no roles check since it is called by the event
  // worker using an api key (rather than a user token) which means
  // it has no roles to check against.
  @Mutation("createEvent")
  async create(@Args("input") input: EventCreateInput) {
    try {
      return await this.eventService.create(input);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error creating event", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("searchEvents")
  @Roles(coreRoles)
  async search(
    @Args("page") page?: number,
    @Args("pageSize") pageSize?: number,
    @Args("filters") filters?: EventFilters,
  ) {
    try {
      return await this.eventService.search(page, pageSize, filters);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error searching events", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }
}
