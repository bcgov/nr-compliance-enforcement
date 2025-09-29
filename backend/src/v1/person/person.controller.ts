import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PersonService } from "./person.service";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { JwtRoleGuard } from "../../auth/jwtrole.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../enum/role.enum";
import { UUID } from "crypto";

@ApiTags("person")
@UseGuards(JwtRoleGuard)
@Controller({
  path: "person",
  version: "1",
})
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @Roles(Role.COS)
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  @Roles(Role.COS)
  findAll() {
    return this.personService.findAll();
  }

  @Get(":id")
  @Roles(Role.COS)
  findOne(@Param("id") id: string) {
    return this.personService.findOne(id as UUID);
  }

  @Get("/find-by-zone/:zone_code")
  @Roles(Role.COS)
  findByZone(@Param("zone_code") zone_code: string) {
    return this.personService.findByZone(zone_code);
  }

  @Get("/find-by-office/:office_guid")
  @Roles(Role.COS)
  findByOffice(@Param("office_guid") office_guid: string) {
    return this.personService.findByOffice(office_guid);
  }

  @Patch(":id")
  @Roles(Role.COS)
  update(@Param("id") id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(id as UUID, updatePersonDto);
  }

  @Delete(":id")
  @Roles(Role.COS)
  remove(@Param("id") id: string) {
    return this.personService.remove(+id);
  }
}
