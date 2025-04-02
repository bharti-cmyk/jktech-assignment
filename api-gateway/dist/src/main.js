"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const global_exception_filter_1 = require("./global/error-handler/global-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const PORT = process.env.API_GATEWAY_PORT || 3000;
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('API for authentication and user management')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(PORT);
    common_1.Logger.log(`API Gateway is running on http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map