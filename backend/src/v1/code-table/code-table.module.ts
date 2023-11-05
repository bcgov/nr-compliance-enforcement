import { Module } from '@nestjs/common';
import { CodeTableService } from './code-table.service';
import { CodeTableController } from './code-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyCode } from '../agency_code/entities/agency_code.entity';
import { AttractantCode } from '../attractant_code/entities/attractant_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgencyCode]), TypeOrmModule.forFeature([AttractantCode])],
  controllers: [CodeTableController],
  providers: [CodeTableService]
})
export class CodeTableModule {}
