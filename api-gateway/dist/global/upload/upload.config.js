"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    upload: {
        path: process.env.UPLOAD_PATH || './uploads',
        maxFileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE) || 10 * 1024 * 1024,
    },
});
//# sourceMappingURL=upload.config.js.map