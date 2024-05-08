import { Module } from "@nestjs/common";
import { ReportedByCodeService } from "./reported_by_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportedByCode } from "./entities/reported_by_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReportedByCode])],
  providers: [ReportedByCodeService],
})
export class ReportedByCodeModule {}
