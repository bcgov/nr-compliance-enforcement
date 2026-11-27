import { Injectable } from "@nestjs/common";
import { getWithApiKey } from "../../external_api/shared_data";

@Injectable()
export class PublicService {
  async getCommunities() {
    const { data, errors } = await getWithApiKey({
      query: "{cosGeoOrgUnits{areaCode areaName zoneCode regionCode}}",
    });

    if (errors) {
      throw new Error(`GraphQL errors occurred while fetching COS geo org units: ${JSON.stringify(errors)}`);
    }

    const communityMap = new Map();

    for (const unit of data.cosGeoOrgUnits) {
      if (unit.areaCode && !communityMap.has(unit.areaCode)) {
        communityMap.set(unit.areaCode, {
          code: unit.areaCode,
          name: unit.areaName,
          zone: unit.zoneCode,
          region: unit.regionCode,
        });
      }
    }

    return Array.from(communityMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getParks() {
    const { data, errors } = await getWithApiKey({
      query: "{parks{parkGuid externalId name legalName parkAreas{parkAreaGuid name regionName}}}",
    });

    if (errors) {
      throw new Error(`GraphQL errors occurred while fetching parks: ${JSON.stringify(errors)}`);
    }

    return data.parks;
  }
}
