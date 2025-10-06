import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
