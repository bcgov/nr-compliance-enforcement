import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllegationComplaint } from "./entities/allegation_complaint.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AllegationComplaint])],
  controllers: [],
  providers: [],
})
export class AllegationComplaintModule {}
