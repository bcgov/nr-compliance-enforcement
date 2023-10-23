import { Module } from '@nestjs/common';
import { ComplaintTypeCodeService } from './complaint_type_code.service';
import { ComplaintTypeCodeController } from './complaint_type_code.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintTypeCode } from './entities/complaint_type_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintTypeCode])],
  controllers: [ComplaintTypeCodeController],
  providers: [ComplaintTypeCodeService]
})
export class ComplaintTypeCodeModule {}
