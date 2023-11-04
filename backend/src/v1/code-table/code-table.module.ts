import { Module } from '@nestjs/common';
import { CodeTableService } from './code-table.service';
import { CodeTableController } from './code-table.controller';

@Module({
  controllers: [CodeTableController],
  providers: [CodeTableService]
})
export class CodeTableModule {}
