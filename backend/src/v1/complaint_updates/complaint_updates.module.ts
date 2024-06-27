import { Module } from "@nestjs/common";
import { ComplaintUpdatesService } from "./complaint_updates.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintUpdatesController } from "./complaint_updates.controller";
import { ComplaintUpdate } from "./entities/complaint_updates.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintUpdate])],
  controllers: [ComplaintUpdatesController],
  providers: [ComplaintUpdatesService],
  exports: [ComplaintUpdate, ComplaintUpdatesService, ComplaintUpdatesModule],
})
export class ComplaintUpdatesModule {}
