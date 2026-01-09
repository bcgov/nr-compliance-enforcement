import { Logger } from "@nestjs/common";
import { ParkService } from "../../shared/park/park.service";
import { ParkAreaMappingService } from "../../shared/park/parkAreaMapping.service";
import { getAllParks } from "../../external_api/bc-parks-service";
import { ParkArea } from "../../shared/park/dto/park_area";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Imports parks from BC Parks API into the database
 */
export async function runParksImport(
  parkService: ParkService,
  parkAreaMappingService: ParkAreaMappingService,
  logger: Logger,
): Promise<void> {
  logger.log("Importing parks...");
  const parks = await getAllParks();

  for (const park of parks) {
    try {
      logger.log(`Importing park: ${park.displayId}`);
      await sleep(100);

      const existingPark = await parkService.findOneByExternalId(park.displayId);
      const parkAreaMapping = await parkAreaMappingService.findByExternalId(park.displayId);
      const parkAreas = parkAreaMapping
        ? parkAreaMapping.map((pam) => {
            return {
              parkAreaGuid: pam.parkAreaGuid,
            } as ParkArea;
          })
        : [];

      if (existingPark) {
        logger.log(`Updating existing park.`);
        await parkService.update(existingPark.parkGuid, {
          ...existingPark,
          name: park.displayName.slice(0, 255),
          legalName: park.legalName.slice(0, 255),
          parkAreas: parkAreas,
        });
      } else {
        logger.log(`Creating new park.`);
        await parkService.create({
          externalId: park.displayId,
          name: park.displayName.slice(0, 255),
          legalName: park.legalName.slice(0, 255),
          parkAreas: parkAreas,
        });
      }
      logger.log(`Success!`);
    } catch (error) {
      logger.error(`ERROR IMPORTING PARK: ${park.displayName}`, error);
    }
  }
}
