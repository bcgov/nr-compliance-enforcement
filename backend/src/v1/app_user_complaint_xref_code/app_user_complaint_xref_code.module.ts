import { Module } from "@nestjs/common";
import { AppUserComplaintXrefCodeService } from "./app_user_complaint_xref_code.service";
import { AppUserComplaintXrefCode } from "./entities/app_user_complaint_xref_code.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([AppUserComplaintXrefCode])],
  controllers: [],
  providers: [AppUserComplaintXrefCodeService],
  exports: [AppUserComplaintXrefCodeService],
})
export class AppUserComplaintXrefCodeModule {}
