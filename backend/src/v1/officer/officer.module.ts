import { Module } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { OfficerController } from './officer.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Officer } from './entities/officer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Officer])],
  controllers: [OfficerController],
  providers: [OfficerService]
})
export class OfficerModule {}
