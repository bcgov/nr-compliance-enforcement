import { Module } from '@nestjs/common';
import { CodeTableService } from './code-table.service';
import { CodeTableController } from './code-table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyCode } from '../agency_code/entities/agency_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgencyCode])],
  controllers: [CodeTableController],
  providers: [CodeTableService]
})
export class CodeTableModule {}
