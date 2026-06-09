import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ConsoleLogger, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({ json: process.env.LOG_FORMAT === "json" }),
    });
    await app.listen(process.env.PORT ?? 3006);
    logger.log(`Server started on port ${process.env.PORT ?? 3006}`);
  } catch (error) {
    logger.error("Startup failed", error instanceof Error ? error.stack : String(error));
    process.exit(1); // Exit with failure
  }
}
bootstrap();
