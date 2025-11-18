import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // strip unknown properties
        transform: true, // automatically transform payloads to DTO instances
        forbidNonWhitelisted: false, // throw error if unknown fields exist (optional: set true if you want strict)
        transformOptions: { enableImplicitConversion: true }, // allow primitive conversion (e.g., id: number)
      }),
    );
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
bootstrap();
