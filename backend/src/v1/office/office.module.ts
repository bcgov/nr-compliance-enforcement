import { Module } from "@nestjs/common";
import { OfficeService } from "./office.service";
import { OfficeController } from "./office.controller";

@Module({
  imports: [],
  controllers: [OfficeController],
  providers: [OfficeService],
  exports: [OfficeService],
})
export class OfficeModule {}
