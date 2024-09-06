import { Module } from "@nestjs/common";
import { ComplaintMethodReceivedCodeService } from "./complaint_method_received_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintMethodReceivedCode } from "./entities/complaint_method_received_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintMethodReceivedCode])],
  controllers: [],
  providers: [ComplaintMethodReceivedCodeService],
})
export class FeatureCodeModule {}
