import { Module } from "@nestjs/common";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { ViolationCodeModule } from "../violation_code/violation_code.module";

@Module({
  imports: [ViolationCodeModule],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
