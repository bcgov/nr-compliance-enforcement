import { Module } from "@nestjs/common";
import { AttractantCodeService } from "./attractant_code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttractantCode } from "./entities/attractant_code.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AttractantCode])],
  controllers: [],
  providers: [AttractantCodeService],
})
export class AttractantCodeModule {}
