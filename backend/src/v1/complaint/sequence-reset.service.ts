import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { DataSource } from "typeorm";

interface SequenceResetConfig {
  name: string;
  resetValue: string;
}

@Injectable()
export class SequenceResetScheduler {
  private cronJob: CronJob;
  private readonly logger = new Logger(SequenceResetScheduler.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry, private readonly dataSource: DataSource) {}

  private getSequenceConfigs(): SequenceResetConfig[] {
    const complaintResetValue = process.env.SEQ_RESET_VALUE || "900000";
    return [
      { name: "complaint.complaint_sequence", resetValue: complaintResetValue },
      { name: "shared.case_sequence", resetValue: "1" },
      { name: "investigation.investigation_sequence", resetValue: "1" },
      { name: "inspection.inspection_sequence", resetValue: "1" },
    ];
  }

  onModuleInit() {
    this.cronJob = new CronJob(
      this.getCronExpression(),
      async () => {
        await this.resetSequences();
      },
      null, // onComplete
      false, // start
      "UTC-8", // timezone
    );

    this.schedulerRegistry.addCronJob("sequence-reset", this.cronJob);
    this.cronJob.start();
  }

  private async resetSequences() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const { name, resetValue } of this.getSequenceConfigs()) {
        this.logger.debug(`Resetting ${name} to ${resetValue} as per cron schedule`);
        await queryRunner.query(`ALTER SEQUENCE ${name} RESTART WITH ${resetValue};`);
      }

      await queryRunner.commitTransaction();
    } catch (exception) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Error resetting sequences", exception);
    } finally {
      await queryRunner.release();
    }
  }

  private getCronExpression(): string {
    // Note nest CronExpression.EVERY_YEAR is bugged! See https://github.com/nestjs/schedule/issues/1159
    const defaultCron = "0 0 1 1 *";
    const envCronExpression = process.env.SEQ_RESET_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Setting sequence reset job as per cron schedule ${envCronExpression}`);
    return envCronExpression;
  }
}
