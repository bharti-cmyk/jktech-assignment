"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const PORT = process.env.API_GATEWAY_PORT || 3000;
    app.enableCors();
    await app.listen(PORT);
    common_1.Logger.log(`API Gateway is running on http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map