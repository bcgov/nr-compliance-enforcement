import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { PersonService } from "./person.service";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { Logger, UseGuards } from "@nestjs/common";
import { coreRoles } from "../../enum/role.enum";
import { Roles } from "../../auth/decorators/roles.decorator";
import { GraphQLError } from "graphql";
import { Person } from "src/shared/person/dto/person";
import { PersonInput } from "src/shared/person/dto/person.input";

@UseGuards(JwtRoleGuard)
@Resolver("Person")
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}
  private readonly logger = new Logger(PersonResolver.name);

  @Query("people")
  @Roles(coreRoles)
  async findAll() {
    try {
      return await this.personService.findAll();
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Query("person")
  @Roles(coreRoles)
  async findOne(@Args("personGuid") id: string) {
    try {
      return await this.personService.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error fetching data from Shared schema", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation(() => Person, { name: "createPerson" })
  @Roles(coreRoles)
  async create(@Args("input") input: PersonInput) {
    try {
      return await this.personService.create(input);
    } catch (error) {
      this.logger.error("Create person error:", error);
      throw new GraphQLError("Error creating person", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation(() => Person, { name: "updatePerson" })
  @Roles(coreRoles)
  async update(@Args("personGuid") personGuid: string, @Args("input") input: PersonInput) {
    try {
      return await this.personService.update(personGuid, input);
    } catch (error) {
      this.logger.error(error);
      throw new GraphQLError("Error updating person", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }

  @Mutation(() => Person, { name: "deletePerson" })
  @Roles(coreRoles)
  async delete(@Args("personGuid") personGuid: string) {
    try {
      return await this.personService.delete(personGuid);
    } catch (error) {
      this.logger.error("Delete person error:", error);
      throw new GraphQLError("Error deleting person", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
  }
}
