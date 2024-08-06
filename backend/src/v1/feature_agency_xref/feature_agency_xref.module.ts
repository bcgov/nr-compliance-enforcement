import { Module } from "@nestjs/common";
import { FeatureAgencyXrefService } from "./feature_agency_xref.service";
import { FeatureAgencyXrefController } from "./feature_agency_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureAgencyXref } from "./entities/feature_agency_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FeatureAgencyXref])],
  controllers: [FeatureAgencyXrefController],
  providers: [FeatureAgencyXrefService],
  exports: [FeatureAgencyXrefService],
})
export class FeatureAgencyXrefModule {}
