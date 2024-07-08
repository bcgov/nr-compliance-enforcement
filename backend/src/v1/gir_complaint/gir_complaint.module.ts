import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GirComplaint } from "./entities/gir_complaint.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GirComplaint])],
})
export class GeneralInformationComplaintModule {}
