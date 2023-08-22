import { Module } from '@nestjs/common';
import { BcGeoCoderService } from './bc_geo_coder.service';
import { HttpModule } from '@nestjs/axios';
import { BcGeoCoderController } from './bc_geo_coder.controller';

@Module({
  imports: [HttpModule],
  controllers: [BcGeoCoderController],
  providers: [BcGeoCoderService]
})
export class BcGeoCoderModule {}
