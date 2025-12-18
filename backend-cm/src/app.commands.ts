import { Command, CommandRunner, Option } from "nest-commander";
import { Inject, Logger } from "@nestjs/common";
import { ParkService } from "./shared/park/park.service";
import { ParkAreaMappingService } from "./shared/park/parkAreaMapping.service";
import { getAllParks } from "./external_api/bc-parks-service";
import { ParkArea } from "./shared/park/dto/park_area";

interface ImportCommandOptions {
  job?: string;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Command({ name: "import", description: "Import functions" })
export class ImportCommand extends CommandRunner {
  constructor(
    @Inject(ParkService) private readonly _parkService: ParkService,
    @Inject(ParkAreaMappingService) private readonly _parkAreaMappingService: ParkAreaMappingService,
  ) {
    super();
  }

  private readonly logger = new Logger(ImportCommand.name);

  async run(params: string[], options?: ImportCommandOptions): Promise<void> {
    if (options?.job === "parks") {
      this.runParksImport();
    } else {
      return;
    }
  }

  @Option({
    flags: "-j, --job <jobName>",
    description: "Job name to run",
  })
  parseString(val: string): string {
    return val;
  }

  async runParksImport(): Promise<void> {
    this.logger.log("Importing parks..."); // test
    const parks = await getAllParks();
    for (const park of parks) {
      try {
        this.logger.log(`Importing park: ${park.displayId}`);
        await sleep(100);
        const existingPark = await this._parkService.findOneByExternalId(park.displayId);
        const parkAreaMapping = await this._parkAreaMappingService.findByExternalId(park.displayId);
        const parkAreas = parkAreaMapping
          ? parkAreaMapping.map((pam) => {
              return {
                parkAreaGuid: pam.parkAreaGuid,
              } as ParkArea;
            })
          : [];
        if (existingPark) {
          this.logger.log(`Updating existing park.`);
          await this._parkService.update(existingPark.parkGuid, {
            ...existingPark,
            name: park.displayName.slice(0, 255),
            legalName: park.legalName.slice(0, 255),
            parkAreas: parkAreas,
          });
        } else {
          this.logger.log(`Creating new park.`);
          await this._parkService.create({
            externalId: park.displayId,
            name: park.displayName.slice(0, 255),
            legalName: park.legalName.slice(0, 255),
            parkAreas: parkAreas,
          });
        }
        this.logger.log(`Success!`);
      } catch (error) {
        this.logger.error(`ERROR IMPORTING PARK: ${park.displayName}`, error);
      }
    }
  }
}
