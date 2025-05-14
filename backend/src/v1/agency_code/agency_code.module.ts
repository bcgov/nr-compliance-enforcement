import { Module } from "@nestjs/common";
import { AgencyCodeService } from "./agency_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyCode } from "./entities/agency_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AgencyCode])],
  providers: [AgencyCodeService],
  exports: [AgencyCodeService],
})
export class AgencyCodeModule {}
