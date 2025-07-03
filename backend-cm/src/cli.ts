import { CommandFactory } from "nest-commander";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

const logger = new Logger("NestCLIApplication");

async function bootstrap() {
  await CommandFactory.run(AppModule, logger);
}

bootstrap();
