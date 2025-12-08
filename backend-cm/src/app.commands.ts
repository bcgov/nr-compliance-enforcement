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
    if (!options?.job) {
      this.logger.log("No job specified. Use --job <name> (e.g., --job parks or --job parks;bclaws)");
      return;
    }

    const jobs = options.job.split(";");

    for (const job of jobs) {
      this.logger.log(`Starting job: ${job}`);
      try {
        await this.runJob(job);
        this.logger.log(`========== Job ${job} completed successfully ==========`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        this.logger.error(`========== Job ${job} failed: ${errorMsg} ==========`);
      }
    }
  }

  private async runJob(job: string): Promise<void> {
    switch (job) {
      case "parks":
        await runParksImport(this._parkService, this._parkAreaMappingService, this.logger);
        break;
      case "bclaws":
        await runBcLawsImport(this._legislationService, this.logger);
        break;
      default:
        throw new Error(`Unknown job: ${job}. Valid jobs: parks, bclaws`);
    }
  }

  @Option({
    flags: "-j, --job <jobNames>",
    description: "Job name(s) to run, semicolon-delimited (e.g., parks;bclaws)",
  })
  parseJob(val: string): string {
    return val;
  }
}
