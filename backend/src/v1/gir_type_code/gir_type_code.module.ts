import { Module } from "@nestjs/common";
import { GirTypeCodeService } from "./gir_type_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GirTypeCode } from "./entities/gir_type_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GirTypeCode])],
  providers: [GirTypeCodeService],
})
export class GirTypeCodeModule {}
