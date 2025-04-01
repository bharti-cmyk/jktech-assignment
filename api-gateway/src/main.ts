import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './global/error-handler/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.API_GATEWAY_PORT || 3000;

  app.enableCors(); // Enable CORS if needed
  app.useGlobalPipes(new ValidationPipe()); // Validation globally
  app.useGlobalFilters(new GlobalExceptionFilter()); // Catch all errors

  await app.listen(PORT);
  Logger.log(`API Gateway is running on http://localhost:${PORT}`);
}
bootstrap();
