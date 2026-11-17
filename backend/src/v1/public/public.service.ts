import { Injectable } from "@nestjs/common";
import { getWithApiKey } from "../../external_api/shared_data";
import { ViolationCodeService } from "../violation_code/violation_code.service";

@Injectable()
export class PublicService {
  constructor(private readonly violationCodeService: ViolationCodeService) {}

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

  async getViolations() {
    const data = await this.violationCodeService.findActive();

    return data.map(({ violation_code, short_description, long_description, display_order, active_ind }) => ({
      violation: violation_code,
      shortDescription: short_description,
      longDescription: long_description,
      displayOrder: display_order,
      isActive: active_ind,
    }));
  }

  async getSpecies() {
    const { data, errors } = await getWithApiKey({
      query:
        "{speciesCodes{speciesCode shortDescription longDescription displayOrder activeIndicator, largeCarnivoreIndicator, displayOnComplaintIndicator}}",
    });

    if (errors) {
      throw new Error(`GraphQL errors occurred while fetching species codes: ${JSON.stringify(errors)}`);
    }

    return data.speciesCodes
      .filter(({ activeIndicator }) => activeIndicator)
      .map(
        ({
          speciesCode,
          shortDescription,
          longDescription,
          displayOrder,
          activeIndicator,
          largeCarnivoreIndicator,
          displayOnComplaintIndicator,
        }) => ({
          species: speciesCode,
          shortDescription: shortDescription,
          longDescription: longDescription,
          displayOrder: displayOrder,
          isActive: activeIndicator,
          isLargeCarnivore: largeCarnivoreIndicator,
          isDisplayedOnComplaint: displayOnComplaintIndicator,
        }),
      );
  }
}
