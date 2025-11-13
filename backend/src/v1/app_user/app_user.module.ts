import { Module } from "@nestjs/common";
import { AppUserService } from "./app_user.service";
import { AppUserController } from "./app_user.controller";
import { CssModule } from "../../external_api/css/css.module";

@Module({
  imports: [CssModule],
  controllers: [AppUserController],
  providers: [AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
