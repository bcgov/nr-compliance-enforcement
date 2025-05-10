import { Module } from "@nestjs/common";
import { ViolationCodeService } from "./violation_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ViolationCode } from "./entities/violation_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ViolationCode])],
  controllers: [],
  providers: [ViolationCodeService],
  exports: [ViolationCodeService],
})
export class ViolationCodeModule {}
