import { Module } from "@nestjs/common";
import { CaseManangementService } from "./case_management.service";
import { HttpModule } from "@nestjs/axios";
import { CaseManangementController } from "./case_management.controller";

@Module({
  imports: [HttpModule],
  controllers: [CaseManangementController],
  providers: [CaseManangementService],
  exports: [CaseManangementService]
})
export class CaseManangementModule {}
