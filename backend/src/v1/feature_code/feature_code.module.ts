import { Module } from "@nestjs/common";
import { FeatureCodeService } from "./feature_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureCode } from "./entities/feature_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FeatureCode])],
  controllers: [],
  providers: [FeatureCodeService],
})
export class FeatureCodeModule {}
