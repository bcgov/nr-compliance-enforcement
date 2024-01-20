import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HwcrComplaint } from "./entities/hwcr_complaint.entity";

@Module({
  imports: [TypeOrmModule.forFeature([HwcrComplaint])],
  controllers: [],
  providers: [],
})
export class HwcrComplaintModule {}
