"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentEntity = void 0;
const typeorm_1 = require("typeorm");
let DocumentEntity = class DocumentEntity {
};
exports.DocumentEntity = DocumentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DocumentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_name', length: 255 }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 100 }),
    __metadata("design:type", String)
], DocumentEntity.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'uploaded_at' }),
    __metadata("design:type", Date)
], DocumentEntity.prototype, "uploadedAt", void 0);
exports.DocumentEntity = DocumentEntity = __decorate([
    (0, typeorm_1.Entity)('documents')
], DocumentEntity);
//# sourceMappingURL=document.entity.js.map