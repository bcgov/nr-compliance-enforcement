import { Module } from '@nestjs/common';
import { AgencyCodeService } from './agency_code.service';
import { AgencyCodeController } from './agency_code.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgencyCode } from './entities/agency_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgencyCode])],
  controllers: [AgencyCodeController],
  providers: [AgencyCodeService]
})
export class AgencyCodeModule {}
