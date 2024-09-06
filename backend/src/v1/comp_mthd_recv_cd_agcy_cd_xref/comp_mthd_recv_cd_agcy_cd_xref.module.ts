import { Module } from "@nestjs/common";
import { AttractantHwcrXrefService } from "./comp_mthd_recv_cd_agcy_cd_xref.service";
import { AttractantHwcrXrefController } from "./comp_mthd_recv_cd_agcy_cd_xref.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttractantHwcrXref } from "./entities/attractant_hwcr_xref.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AttractantHwcrXref])],
  controllers: [AttractantHwcrXrefController],
  providers: [AttractantHwcrXrefService],
  exports: [AttractantHwcrXrefService],
})
export class AttractantHwcrXrefModule {}
