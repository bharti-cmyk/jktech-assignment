"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckPermissions = void 0;
const common_1 = require("@nestjs/common");
const casl_types_1 = require("../../casl/casl.types");
const CheckPermissions = (...handlers) => (0, common_1.SetMetadata)(casl_types_1.CHECK_PERMISSIONS_KEY, handlers);
exports.CheckPermissions = CheckPermissions;
//# sourceMappingURL=check-permission.decorator.js.map