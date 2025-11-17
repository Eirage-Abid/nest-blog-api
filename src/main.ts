import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
bootstrap();
