import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { DataSource } from "typeorm";

@Injectable()
export class ComplaintSequenceResetScheduler {
  private cronJob: CronJob;
  private readonly logger = new Logger(ComplaintSequenceResetScheduler.name);

  constructor(private schedulerRegistry: SchedulerRegistry, private dataSource: DataSource) {}

  onModuleInit() {
    this.cronJob = new CronJob(this.getCronExpression(), async () => {
      await this.resetComplaintSequence();
    });

    this.schedulerRegistry.addCronJob("complaint-reset-sequence", this.cronJob);
    this.cronJob.start();
  }

  private async resetComplaintSequence() {
    try {
      const defaultSequence = "900000";
      const sequence = process.env.SEQ_RESET_VALUE || defaultSequence;

      this.logger.debug(`Resetting Complaint Sequence to ${sequence} as per cron schedule`);
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.query(`ALTER SEQUENCE complaint_sequence RESTART WITH ${sequence};`);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (Exception) {
      this.logger.error("Error resetting complaint sequence");
    }
  }

  private getCronExpression(): string {
    // Note nest CronExpression.EVERY_YEAR is bugged! See https://github.com/nestjs/schedule/issues/1159
    const defaultCron = "0 0 1 1 *";
    const envCronExpression = process.env.SEQ_RESET_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Setting Complaint Sequence reset job as per cron schedule ${envCronExpression}`);
    return envCronExpression;
  }
}
