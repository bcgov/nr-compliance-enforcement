import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  
  const server = app.getHttpAdapter().getInstance();
  server.get("/health", (req, res) => res.status(200).send("ok"));
  
  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
