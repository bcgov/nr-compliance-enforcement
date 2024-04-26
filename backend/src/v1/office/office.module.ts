import { Module } from "@nestjs/common";
import { OfficeService } from "./office.service";
import { OfficeController } from "./office.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "./entities/office.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Office])],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
