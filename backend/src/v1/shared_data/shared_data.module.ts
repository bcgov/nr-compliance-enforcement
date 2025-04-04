import { Module } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { SharedDataController } from "./shared_data.controller";
import { SharedDataService } from "./shared_data.service";

@Module({
  imports: [AutomapperModule],
  controllers: [SharedDataController],
  providers: [SharedDataService],
  exports: [SharedDataService],
})
export class SharedDataModule {}
