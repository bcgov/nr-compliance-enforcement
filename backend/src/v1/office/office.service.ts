import { Injectable, Logger } from "@nestjs/common";
import { UUID } from "node:crypto";
import { CreateOfficeDto } from "./dto/create-office.dto";
import { UpdateOfficeDto } from "./dto/update-office.dto";
import { OfficeAssignmentDto } from "../../types/models/office/office-assignment-dto";
import {
  getOffices,
  getCosGeoOrgUnits,
  createOffice,
  updateOffice,
  getOfficesByZone,
} from "../../external_api/shared_data";

@Injectable()
export class OfficeService {
  private readonly logger = new Logger(OfficeService.name);

  async create(office: CreateOfficeDto, token: string): Promise<any> {
    const input = {
      geoOrganizationUnitCode: office.geo_organization_unit_code,
      agencyCode: office.agency_code_ref,
    };

    const newOffice = await createOffice(token, input);

    return {
      office_guid: newOffice.officeGuid,
      geo_organization_unit_code: newOffice.geoOrganizationUnitCode,
      agency_code_ref: newOffice.agencyCode,
    };
  }

  findByGeoOrgCode = async (geo_org_code: any, token: string) => {
    const offices = await getOffices(token);
    return offices.filter((office) => office.geoOrganizationUnitCode === geo_org_code);
  };

  findOne = async (id: UUID, token: string): Promise<any> => {
    const offices = await getOffices(token);
    const office = offices.find((o) => o.officeGuid === id);

    if (!office) {
      throw new Error("Office not found");
    }

    return office;
  };

  findOfficesByZone = async (zone_code: string, token: string) => {
    return await getOfficesByZone(token, zone_code);
  };

  async update(id: UUID, updateOfficeDto: UpdateOfficeDto, token: string) {
    const input: any = {};
    if (updateOfficeDto.geo_organization_unit_code)
      input.geoOrganizationUnitCode = updateOfficeDto.geo_organization_unit_code;
    if (updateOfficeDto.agency_code_ref) input.agencyCode = updateOfficeDto.agency_code_ref;

    const updatedOffice = await updateOffice(token, id, input);

    return {
      office_guid: updatedOffice.officeGuid,
      geo_organization_unit_code: updatedOffice.geoOrganizationUnitCode,
      agency_code_ref: updatedOffice.agencyCode,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} office`;
  }

  findOffices = async (token: string): Promise<Array<OfficeAssignmentDto>> => {
    const offices = await getOffices(token);
    const cosGeoOrgUnits = await getCosGeoOrgUnits(token);

    const results = offices.map((office) => {
      const geoUnit = cosGeoOrgUnits.find((unit) => unit.officeLocationCode === office.geoOrganizationUnitCode);
      const record: OfficeAssignmentDto = {
        id: office.officeGuid,
        name: geoUnit?.officeLocationName || "",
        agency: office.agencyCode,
      };
      return record;
    });

    return results;
  };
}
