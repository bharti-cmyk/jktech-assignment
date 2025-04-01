"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBytes = convertBytes;
function convertBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) {
        return 'File size is 0 Bytes.';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) {
        return `${bytes} ${sizes[i]}`;
    }
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}
//# sourceMappingURL=file.js.map