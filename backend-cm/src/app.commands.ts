import { Command, CommandRunner, Option } from "nest-commander";
import { Inject, Logger } from "@nestjs/common";
import { ParkService } from "./shared/park/park.service";
import { ParkAreaMappingService } from "./shared/park/parkAreaMapping.service";
import { LegislationService } from "./shared/legislation/legislation.service";
import { runParksImport } from "./cli/parks/parks-import";
import { runBcLawsImport } from "./cli/bclaws/bclaws-import";

interface ImportCommandOptions {
  job?: string;
}

@Command({ name: "import", description: "Import functions" })
export class ImportCommand extends CommandRunner {
  constructor(
    @Inject(ParkService) private readonly _parkService: ParkService,
    @Inject(ParkAreaMappingService) private readonly _parkAreaMappingService: ParkAreaMappingService,
    @Inject(LegislationService) private readonly _legislationService: LegislationService,
  ) {
    super();
  }

  private readonly logger = new Logger(ImportCommand.name);

  async run(params: string[], options?: ImportCommandOptions): Promise<void> {
    if (options?.job === "parks") {
      await runParksImport(this._parkService, this._parkAreaMappingService, this.logger);
    } else if (options?.job === "bclaws") {
      await runBcLawsImport(this._legislationService, this.logger);
    } else {
      this.logger.log("No valid job specified. E.g. use --job parks or --job bclaws");
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
}
