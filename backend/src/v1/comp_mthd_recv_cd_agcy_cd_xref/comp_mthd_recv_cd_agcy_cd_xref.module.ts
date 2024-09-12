import { Module } from "@nestjs/common";
import { CompMthdRecvCdAgcyCdXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { CompMthdRecvCdAgcyCdXrefController } from "./comp_mthd_recv_cd_agcy_cd_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompMthdRecvCdAgcyCdXref } from "./entities/comp_mthd_recv_cd_agcy_cd_xref";

@Module({
  imports: [TypeOrmModule.forFeature([CompMthdRecvCdAgcyCdXref])],
  controllers: [CompMthdRecvCdAgcyCdXrefController],
  providers: [CompMthdRecvCdAgcyCdXrefService],
  exports: [CompMthdRecvCdAgcyCdXrefService],
})
export class CompMthdRecvCdAgcyCdXrefModule {}
