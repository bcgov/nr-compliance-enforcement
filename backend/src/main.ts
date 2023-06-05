import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import {customLogger} from "./common/logger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{logger: customLogger,});
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Compliance and Enforcement API")
    .setDescription("The Complicance and Enforcement API")
    .setVersion("1.0")
    .addTag("Compliance and Enforcement")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3001);
}
bootstrap();