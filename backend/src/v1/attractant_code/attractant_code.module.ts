import { Module } from '@nestjs/common';
import { AttractantCodeService } from './attractant_code.service';
import { AttractantCodeController } from './attractant_code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttractantCode } from './entities/attractant_code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttractantCode])],
  controllers: [AttractantCodeController],
  providers: [AttractantCodeService]
})
export class AttractantCodeModule {}
