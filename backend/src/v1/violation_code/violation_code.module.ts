import { Module } from '@nestjs/common';
import { ViolationCodeService } from './violation_code.service';
import { ViolationCodeController } from './violation_code.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ViolationCode } from './entities/violation_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViolationCode])],
  controllers: [ViolationCodeController],
  providers: [ViolationCodeService]
})
export class ViolationCodeModule {}
