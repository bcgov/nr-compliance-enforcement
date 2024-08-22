import { Module } from "@nestjs/common";
import { FeatureFlagService } from "./feature_flag.service";
import { FeatureFlagController } from "./feature_flag.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FeatureAgencyXref])],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
