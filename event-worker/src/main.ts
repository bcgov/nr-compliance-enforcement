import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dotenv from "dotenv";

async function bootstrap() {
  dotenv.config();

  try {
    const app = await NestFactory.create(AppModule);
    app.getHttpAdapter().getInstance().get("/health", (req, res) => res.status(200).send("ok"));
    await app.listen(process.env.PORT ?? 3006);
    console.log(`Server started on port ${process.env.PORT ?? 3006}`);
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1); // Exit with failure
  }
}
bootstrap();
