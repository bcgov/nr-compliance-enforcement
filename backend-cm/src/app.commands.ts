import { Command, CommandRunner, Option } from "nest-commander";
import { Inject, Logger } from "@nestjs/common";
import { ParkService } from "./shared/park/park.service";
import { ParkAreaMappingService } from "./shared/park/parkAreaMapping.service";
import { LegislationService } from "./shared/legislation/legislation.service";
import { LegislationSourceService } from "./shared/legislation_source/legislation_source.service";
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
    @Inject(LegislationSourceService) private readonly _legislationSourceService: LegislationSourceService,
  ) {
    super();
  }

  private readonly logger = new Logger(ImportCommand.name);

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  private formatTimestamp(date: Date): string {
    return date.toISOString().replace("T", " ").substring(0, 19);
  }

  async run(params: string[], options?: ImportCommandOptions): Promise<void> {
    if (!options?.job) {
      this.logger.log("No job specified. Use --job <name> (e.g., --job parks or --job parks,bclaws)");
      return;
    }

    const jobs = options.job.split(",");

    for (const job of jobs) {
      const startTime = new Date();
      this.logger.log(`=== Starting job: ${job} at ${this.formatTimestamp(startTime)}`);
      try {
        await this.runJob(job);
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        this.logger.log(
          `=== Job ${job} completed successfully` +
            `  Started:  ${this.formatTimestamp(startTime)}` +
            `  Ended:    ${this.formatTimestamp(endTime)}` +
            `  Duration: ${this.formatDuration(duration)}`,
        );
      } catch (error) {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        const errorMsg = error instanceof Error ? error.message : String(error);
        this.logger.error(
          `=== Job ${job} failed: ${errorMsg}` +
            `  Started:  ${this.formatTimestamp(startTime)}` +
            `  Ended:    ${this.formatTimestamp(endTime)}` +
            `  Duration: ${this.formatDuration(duration)}`,
        );
      }
    }
  }

  private async runJob(job: string): Promise<void> {
    switch (job) {
      case "parks":
        await runParksImport(this._parkService, this._parkAreaMappingService, this.logger);
        break;
      case "bclaws":
        await runBcLawsImport(this._legislationService, this._legislationSourceService, this.logger);
        break;
      default:
        throw new Error(`Unknown job: ${job}. Valid jobs: parks, bclaws`);
    }
  }

  @Option({
    flags: "-j, --job <jobNames>",
    description: "Job name(s) to run, comma-delimited (e.g., parks,bclaws)",
  })
  parseJob(val: string): string {
    return val;
  }
}
