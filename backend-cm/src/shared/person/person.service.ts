import { Injectable, Logger } from "@nestjs/common";
import { Person } from "./dto/person";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { person } from "prisma/shared/generated/person";
import { PersonInput } from "src/shared/person/dto/person.input";

@Injectable()
export class PersonService {
  constructor(
    private readonly prisma: SharedPrismaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(PersonService.name);

  // todo: is any thing in here actually used?

  async findAll() {
    const prismaPeople = await this.prisma.person.findMany({
      select: {
        person_guid: true,
        first_name: true,
        middle_names: true,
        last_name: true,
        date_of_birth: true,
        drivers_license_number: true,
        drivers_license_class: true,
        drivers_license_country_code: true,
        drivers_license_country_subdivision_code: true,
        gender_code: true,
        approximate_age_code: true,
      },
    });

    return this.mapper.mapArray<person, Person>(prismaPeople as Array<person>, "person", "Person");
  }

  async findOne(id: string) {
    const prismaPerson = await this.prisma.person.findUnique({
      where: {
        person_guid: id,
      },
    });

    try {
      return this.mapper.map<person, Person>(prismaPerson as unknown as person, "person", "Person");
    } catch (error) {
      this.logger.error("Error mapping person", error);
    }
  }

  async create(input: PersonInput): Promise<Person> {
    const prismaPerson = await this.prisma.person.create({
      data: {
        first_name: input.firstName,
        middle_names: input.middleNames,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        drivers_license_number: input.driversLicenseNumber,
        drivers_license_class: input.driversLicenseClass,
        drivers_license_country_code: input.driversLicenseCountryCode,
        drivers_license_country_subdivision_code: input.driversLicenseCountrySubdivisionCode,
        gender_code: input.genderCode,
        create_user_id: "system",
      },
    });
    return this.mapper.map<person, Person>(prismaPerson as unknown as person, "person", "Person");
  }

  async update(personGuid: string, input: PersonInput): Promise<Person> {
    const existingPerson = await this.prisma.person.findUnique({
      where: { person_guid: personGuid },
    });
    if (!existingPerson) throw new Error("Person not found");

    const prismaPerson = await this.prisma.person.update({
      where: { person_guid: personGuid },
      data: {
        first_name: input.firstName,
        middle_names: input.middleNames,
        last_name: input.lastName,
        date_of_birth: input.dateOfBirth,
        drivers_license_number: input.driversLicenseNumber,
        drivers_license_class: input.driversLicenseClass,
        drivers_license_country_code: input.driversLicenseCountryCode,
        drivers_license_country_subdivision_code: input.driversLicenseCountrySubdivisionCode,
        gender_code: input.genderCode,
      },
    });
    return this.mapper.map<person, Person>(prismaPerson as unknown as person, "person", "Person");
  }

  async delete(personGuid: string): Promise<Person> {
    const existingPerson = await this.prisma.person.findUnique({
      where: { person_guid: personGuid },
    });
    if (!existingPerson) throw new Error("Person not found");

    const prismaPerson = await this.prisma.person.delete({
      where: { person_guid: personGuid },
    });
    return this.mapper.map<person, Person>(prismaPerson as unknown as person, "person", "Person");
  }
}
