import { Module } from "@nestjs/common";
import { ChefsService } from "./chefs.service";

@Module({
  providers: [ChefsService],
  exports: [ChefsService],
})
export class ChefsModule {}
