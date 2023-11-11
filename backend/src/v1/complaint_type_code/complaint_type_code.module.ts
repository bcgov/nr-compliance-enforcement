import { Module } from '@nestjs/common';
import { ComplaintTypeCodeService } from './complaint_type_code.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplaintTypeCode } from './entities/complaint_type_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComplaintTypeCode])],
  controllers: [],
  providers: [ComplaintTypeCodeService]
})
export class ComplaintTypeCodeModule {}
