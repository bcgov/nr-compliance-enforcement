import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MetabaseService } from "./metabase.service";
import { MetabaseController } from "./metabase.controller";
import { AppUserModule } from "../app_user/app_user.module";

@Module({
  imports: [JwtModule.register({}), AppUserModule],
  controllers: [MetabaseController],
  providers: [MetabaseService],
})
export class MetabaseModule {}
