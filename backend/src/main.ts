import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{logger: ['debug'],});
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Users example")
    .setDescription("The user API description")
    .setVersion("1.0")
    .addTag("users")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
