import { Module } from '@nestjs/common';
import { TimezoneCodeService } from './timezone_code.service';
import { TimezoneCodeController } from './timezone_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimezoneCode } from './entities/timezone_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimezoneCode])],
  controllers: [TimezoneCodeController],
  providers: [TimezoneCodeService]
})
export class TimezoneCodeModule {}
