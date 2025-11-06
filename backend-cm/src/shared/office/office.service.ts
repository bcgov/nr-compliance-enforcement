import { Injectable, Logger } from "@nestjs/common";
import { SharedPrismaService } from "../../prisma/shared/prisma.shared.service";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { office } from "prisma/shared/generated/office";
import { Office, CreateOfficeInput, UpdateOfficeInput } from "./dto/office";
import { UserService } from "../../common/user.service";
import { CosGeoOrgUnitService } from "../cos_geo_org_unit/cos_geo_org_unit.service";
import { AppUserService } from "../app_user/app_user.service";

@Injectable()
export class OfficeService {
  constructor(
    private readonly user: UserService,
    private readonly prisma: SharedPrismaService,
    private readonly cosGeoOrgUnitService: CosGeoOrgUnitService,
    private readonly appUserService: AppUserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  private readonly logger = new Logger(OfficeService.name);

  async findAll(geoOrganizationUnitCodes?: string[], agencyCode?: string) {
    const whereClause: any = {};

    if (geoOrganizationUnitCodes && geoOrganizationUnitCodes.length > 0) {
      whereClause.geo_organization_unit_code = {
        in: geoOrganizationUnitCodes,
      };
    }

    if (agencyCode) {
      whereClause.agency_code_ref = agencyCode;
    }

    const prismaOffices = await this.prisma.office.findMany({
      where: whereClause,
      select: {
        office_guid: true,
        geo_organization_unit_code: true,
        agency_code_ref: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    return this.mapper.mapArray<office, Office>(prismaOffices as Array<office>, "office", "Office");
  }

  async findOne(officeGuid?: string, geoOrganizationUnitCode?: string, agencyCode?: string) {
    const whereClause: any = {};

    if (officeGuid) {
      whereClause.office_guid = officeGuid;
    }

    if (geoOrganizationUnitCode) {
      whereClause.geo_organization_unit_code = geoOrganizationUnitCode;
    }

    if (agencyCode) {
      whereClause.agency_code_ref = agencyCode;
    }

    if (!officeGuid && !geoOrganizationUnitCode && !agencyCode) {
      return null;
    }

    const prismaOffice = await this.prisma.office.findFirst({
      where: whereClause,
      select: {
        office_guid: true,
        geo_organization_unit_code: true,
        agency_code_ref: true,
        create_user_id: true,
        create_utc_timestamp: true,
        update_user_id: true,
        update_utc_timestamp: true,
      },
    });

    if (!prismaOffice) {
      return null;
    }

    return this.mapper.map<office, Office>(prismaOffice as office, "office", "Office");
  }

  async create(input: CreateOfficeInput) {
    const prismaOffice = await this.prisma.office.create({
      data: {
        geo_organization_unit_code: input.geoOrganizationUnitCode,
        agency_code_ref: input.agencyCode,
        create_user_id: this.user.getIdirUsername(),
        create_utc_timestamp: new Date(),
        update_user_id: this.user.getIdirUsername(),
        update_utc_timestamp: new Date(),
      },
    });

    return this.mapper.map<office, Office>(prismaOffice as office, "office", "Office");
  }

  async update(officeGuid: string, input: UpdateOfficeInput) {
    const updateData: any = {
      update_user_id: this.user.getIdirUsername(),
      update_utc_timestamp: new Date(),
    };

    if (input.geoOrganizationUnitCode !== undefined)
      updateData.geo_organization_unit_code = input.geoOrganizationUnitCode;
    if (input.agencyCode !== undefined) updateData.agency_code_ref = input.agencyCode;

    const prismaOffice = await this.prisma.office.update({
      where: { office_guid: officeGuid },
      data: updateData,
    });

    return this.mapper.map<office, Office>(prismaOffice as office, "office", "Office");
  }

  async findOfficesByZone(zoneCode: string): Promise<Office[]> {
    // Get geo org units for this zone (with distinct office locations)
    const cosGeoOrgUnits = await this.cosGeoOrgUnitService.findAll(zoneCode, undefined, true);

    // Get unique office location codes
    const officeLocationCodes = [...new Set(cosGeoOrgUnits.map((unit) => unit.officeLocationCode))];

    if (officeLocationCodes.length === 0) {
      return [];
    }

    // Get offices by location codes
    const offices = await this.findAll(officeLocationCodes);
    const officeGuids = offices.map((office) => office.officeGuid);

    // Get app users filtered for those offices
    const appUsers = officeGuids.length > 0 ? await this.appUserService.findAll(officeGuids) : [];

    // Return offices with their related data
    return offices.map((office) => {
      const cosGeoOrgUnit = cosGeoOrgUnits.find((unit) => unit.officeLocationCode === office.geoOrganizationUnitCode);
      const officeAppUsers = appUsers.filter((user) => user.officeGuid === office.officeGuid);

      return {
        ...office,
        cosGeoOrgUnit,
        appUsers: officeAppUsers,
      };
    });
  }
}
