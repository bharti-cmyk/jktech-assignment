import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './global/error-handler/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.API_GATEWAY_PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API for authentication and user management')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT Authentication in Swagger
    .build();
  app.enableCors(); // Enable CORS if needed
  app.useGlobalPipes(new ValidationPipe()); // Validation globally
  app.useGlobalFilters(new GlobalExceptionFilter()); // Catch all errors

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  await app.listen(PORT);
  Logger.log(`API Gateway is running on http://localhost:${PORT}`);
}
bootstrap();
