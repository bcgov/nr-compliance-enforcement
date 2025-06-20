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

  async findAll() {
    const prismaPeople = await this.prisma.person.findMany({
      select: {
        person_guid: true,
        first_name: true,
        middle_name: true,
        middle_name_2: true,
        last_name: true,
        contact_method: {
          select: {
            contact_value: true,
            contact_method_type_code: true,
            contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code: {
              select: {
                short_description: true,
                long_description: true,
              },
            },
          },
        },
      },
    });

    return this.mapper.mapArray<person, Person>(prismaPeople as Array<person>, "person", "Person");
  }

  async findOne(id: string) {
    const prismaPerson = await this.prisma.person.findUnique({
      where: {
        person_guid: id,
      },
      include: {
        contact_method: {
          include: {
            contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code: true,
          },
        },
      },
    });

    try {
      return this.mapper.map<person, Person>(prismaPerson as person, "person", "Person");
    } catch (error) {
      this.logger.error("Error mapping person", error);
    }
  }

  async create(input: PersonInput): Promise<Person> {
    const prismaPerson = await this.prisma.person.create({
      data: {
        first_name: input.firstName,
        middle_name: input.middleName,
        middle_name_2: input.middleName2,
        last_name: input.lastName,
        create_user_id: "system",
        contact_method: input.contactMethods
          ? {
              create: input.contactMethods.map(
                (cm) =>
                  ({
                    contact_value: cm.value,
                    contact_method_type_code: cm.typeCode,
                    create_user_id: "system",
                  }) as any,
              ),
            }
          : undefined,
      },
      include: {
        contact_method: {
          include: {
            contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code: true,
          },
        },
      },
    });
    return this.mapper.map<person, Person>(prismaPerson as person, "person", "Person");
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
        middle_name: input.middleName,
        middle_name_2: input.middleName2,
        last_name: input.lastName,
        // contact_method: input.contactMethods
        //   ? ({
        //       deleteMany: {}, // Remove old contacts
        //       create: input.contactMethods.map((cm) => ({
        //         contact_value: cm.value,
        //         contact_method_type_code: cm.typeCode,
        //         create_user_id: "system",
        //       })),
        //     } as any)
        //   : undefined,
      },
      include: {
        contact_method: {
          include: {
            contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code: true,
          },
        },
      },
    });
    return this.mapper.map<person, Person>(prismaPerson as person, "person", "Person");
  }

  async delete(personGuid: string): Promise<Person> {
    const existingPerson = await this.prisma.person.findUnique({
      where: { person_guid: personGuid },
      include: { contact_method: true },
    });
    if (!existingPerson) throw new Error("Person not found");

    const prismaPerson = await this.prisma.person.delete({
      where: { person_guid: personGuid },
      include: {
        contact_method: {
          include: {
            contact_method_type_code_contact_method_contact_method_type_codeTocontact_method_type_code: true,
          },
        },
      },
    });
    return this.mapper.map<person, Person>(prismaPerson as person, "person", "Person");
  }
}
