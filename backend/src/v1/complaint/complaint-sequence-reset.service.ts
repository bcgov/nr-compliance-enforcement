import { Injectable, Logger } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
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

  private resetComplaintSequence() {
    try {
      this.logger.debug("Resetting Complaint Sequence as per cron schedule");
      const queryRunner = this.dataSource.createQueryRunner();
      queryRunner.connect();
      queryRunner.startTransaction();

      queryRunner.query("ALTER SEQUENCE complaint_sequence RESTART WITH 900000;");

      queryRunner.release();
    } catch (Exception) {
      this.logger.error("Error resetting complaint sequence");
    }
  }

  private getCronExpression(): string {
    const defaultCron = CronExpression.EVERY_YEAR;
    const envCronExpression = process.env.SEQ_RESET_CRON_EXPRESSION || defaultCron;
    this.logger.debug(`Setting Complaint Sequence reset job as per cron schedule ${envCronExpression}`);
    return envCronExpression;
  }
}
