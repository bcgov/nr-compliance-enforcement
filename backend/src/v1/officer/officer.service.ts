import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateOfficerDto } from "./dto/create-officer.dto";
import { CreatePersonDto } from "../person/dto/create-person.dto";
import { UpdateOfficerDto } from "./dto/update-officer.dto";
import { Officer } from "./entities/officer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PersonService } from "../person/person.service";
import { OfficeService } from "../office/office.service";
import { UUID } from "crypto";
import { CssService } from "../../external_api/css/css.service";
import { Role } from "../../enum/role.enum";
import { put } from "../../helpers/axios-api";
import { CssUser } from "../../types/css/cssUser";
import { CreateOfficerTeamXrefDto } from "../officer_team_xref/dto/create-officer_team_xref.dto";
import { TeamService } from "../team/team.service";
import { OfficerTeamXrefService } from "../officer_team_xref/officer_team_xref.service";
import { NewOfficer } from "../../types/models/people/officer";

@Injectable()
export class OfficerService {
  private readonly logger = new Logger(OfficerService.name);

  constructor(private readonly dataSource: DataSource) {}
  @InjectRepository(Officer)
  private readonly officerRepository: Repository<Officer>;

  @Inject(PersonService)
  protected readonly personService: PersonService;
  @Inject(OfficeService)
  protected readonly officeService: OfficeService;
  @Inject(TeamService)
  protected readonly teamService: TeamService;
  @Inject(OfficerTeamXrefService)
  protected readonly officerTeamXrefService: OfficerTeamXrefService;
  @Inject(CssService)
  private readonly cssService: CssService;

  async findAll(): Promise<Officer[]> {
    let officers = await this.officerRepository
      .createQueryBuilder("officer")
      .leftJoinAndSelect("officer.office_guid", "office")
      .leftJoinAndSelect("officer.person_guid", "person")
      // This view is slow :(
      .leftJoinAndSelect("office.cos_geo_org_unit", "cos_geo_org_unit")
      .leftJoinAndSelect("office.agency_code", "agency_code")
      .orderBy("person.last_name", "ASC")
      .getMany();

    const roleMapping = await this.cssService.getUserRoleMapping();
    if (roleMapping) {
      let useGuid: string;
      officers = officers.map((officer) => {
        useGuid = Object.keys(roleMapping).find((key) => key === officer.auth_user_guid);
        return {
          officer_guid: officer.officer_guid,
          person_guid: officer.person_guid,
          office_guid: officer.office_guid,
          user_id: officer.user_id,
          agency_code_ref: officer.agency_code_ref,
          create_user_id: officer.create_user_id,
          create_utc_timestamp: officer.create_utc_timestamp,
          update_user_id: officer.update_user_id,
          update_utc_timestamp: officer.update_utc_timestamp,
          auth_user_guid: officer.auth_user_guid,
          coms_enrolled_ind: officer.coms_enrolled_ind,
          deactivate_ind: officer.deactivate_ind,
          user_roles: roleMapping[useGuid] ?? [],
          park_area_guid: officer.park_area_guid,
        } as Officer;
      });
    }

    return officers;
  }

  async findByOffice(office_guid: any): Promise<Officer[]> {
    return this.officerRepository.find({
      where: { office_guid: office_guid },
      relations: {
        office_guid: {
          cos_geo_org_unit: true,
        },
        person_guid: {},
      },
    });
  }

  async findByAuthUserGuid(auth_user_guid: any): Promise<Officer> {
    return this.officerRepository.findOne({
      where: { auth_user_guid: auth_user_guid },
      relations: {
        person_guid: {},
      },
    });
  }

  async findByPersonGuid(person_guid: any): Promise<Officer> {
    return this.officerRepository.findOne({
      where: { person_guid: person_guid },
      relations: {
        person_guid: {},
      },
    });
  }

  async findByCssEmail(email: string): Promise<CssUser | Officer | null> {
    const cssUser = await this.cssService.getUserIdirByEmail(email);
    if (cssUser.length === 0) return null;
    if (cssUser.length > 0) {
      //assume email is unique and return only 1 result
      const officer = await this.findByAuthUserGuid(cssUser[0].attributes.idir_user_guid[0]);
      //if user already exists in officer table, then return officer data
      if (officer) {
        return officer;
      }
    }
    return cssUser[0];
  }

  async findByUserId(userid: string): Promise<Officer> {
    userid = userid.toUpperCase();
    return this.officerRepository.findOne({
      where: { user_id: userid },
      relations: {
        person_guid: {},
        office_guid: {
          cos_geo_org_unit: true,
        },
      },
    });
  }
  async findOne(officer_guid: any): Promise<Officer> {
    return await this.officerRepository.findOneOrFail({
      where: { officer_guid: officer_guid },
      relations: {
        person_guid: true,
        office_guid: {
          cos_geo_org_unit: true,
          agency_code: true,
        },
      },
    });
  }

  async create(officer: NewOfficer): Promise<Officer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newOfficerObject;
    let personObject;

    try {
      //Will always insert the person
      personObject = await this.personService.createInTransaction(
        <CreatePersonDto>(<unknown>officer.person_guid),
        queryRunner,
      );
      officer.person_guid = personObject.person_guid;

      newOfficerObject = this.officerRepository.create(<CreateOfficerDto>(<unknown>officer));
      await queryRunner.manager.save(newOfficerObject);

      //Create team
      if (officer.team_code) {
        const teamGuid = await this.teamService.findByTeamCodeAndAgencyCode(officer.team_code, "EPO");
        const teamEntity = {
          officer_guid: newOfficerObject.officer_guid,
          team_guid: teamGuid,
          active_ind: true,
          create_user_id: officer.create_user_id,
          update_user_id: officer.update_user_id,
        };
        await this.officerTeamXrefService.createInTransaction(<CreateOfficerTeamXrefDto>teamEntity, queryRunner);
      }
      await queryRunner.commitTransaction();

      //Create roles
      await this.cssService.updateUserRole(officer.roles.user_idir, officer.roles.user_roles);
    } catch (err) {
      this.logger.error(err);
      //rollback all transactions
      await queryRunner.rollbackTransaction();
      newOfficerObject = null;
      //remove all css roles
      for await (const roleItem of officer.roles.user_roles) {
        await this.cssService.deleteUserRole(officer.roles.user_idir, roleItem.name);
      }
    } finally {
      await queryRunner.release();
    }
    return newOfficerObject;
  }

  async update(officer_guid: UUID, updateOfficerDto: UpdateOfficerDto): Promise<Officer> {
    const userRoles = updateOfficerDto.user_roles;
    //exclude roles field populated from keycloak from update
    delete (updateOfficerDto as any).user_roles;

    try {
      await this.officerRepository.update({ officer_guid }, updateOfficerDto);

      //remove all roles if deactivate_ind is true
      if (updateOfficerDto.deactivate_ind === true) {
        const officerIdirUsername = `${updateOfficerDto.auth_user_guid.split("-").join("")}@idir`;
        for await (const roleItem of userRoles) {
          await this.cssService.deleteUserRole(officerIdirUsername, roleItem);
        }
      }
      return this.findOne(officer_guid);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * This function requests the appropriate level of access to the storage bucket in COMS.
   * If successful, the officer's record in the officer table has its `coms_enrolled_ind` indicator set to true.
   * @param requestComsAccessDto An object containing the officer guid
   * @returns the updated record of the officer who was granted access to COMS
   */
  async requestComsAccess(token: string, officer_guid: UUID, user: any): Promise<Officer> {
    try {
      const currentRoles = user.client_roles;
      const permissions = currentRoles.includes(Role.READ_ONLY) ? ["READ"] : ["READ", "CREATE", "UPDATE", "DELETE"];
      const comsPayload = {
        accessKeyId: process.env.OBJECTSTORE_ACCESS_KEY,
        bucket: process.env.OBJECTSTORE_BUCKET,
        bucketName: process.env.OBJECTSTORE_BUCKET_NAME,
        key: process.env.OBJECTSTORE_KEY,
        endpoint: process.env.OBJECTSTORE_HTTPS_URL,
        secretAccessKey: process.env.OBJECTSTORE_SECRET_KEY,
        permCodes: permissions,
      };
      const comsUrl = `${process.env.OBJECTSTORE_API_URL}/bucket`;
      await put(token, comsUrl, comsPayload);
      const officerRes = await this.officerRepository
        .createQueryBuilder("officer")
        .update()
        .set({ coms_enrolled_ind: true })
        .where({ officer_guid: officer_guid })
        .returning("*")
        .execute();
      return officerRes.raw[0];
    } catch (error) {
      this.logger.error("An error occurred while requesting COMS access.", error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} officer`;
  }
}
