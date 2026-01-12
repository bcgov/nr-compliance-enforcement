import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { customLogger } from "./common/logger.config";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: customLogger });
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

  process.env.TZ = "UTC";
  const config = new DocumentBuilder()
    .setTitle("NatComplaints - Complaint Management API")
    .setDescription("NatComplaints - Complaint Management API")
    .setVersion("1.0.0")
    .addTag("NatComplaints - Complaint Management API")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
} // sigh x3
bootstrap();
