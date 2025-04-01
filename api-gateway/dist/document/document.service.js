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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./document.entity");
const file_1 = require("./utils/file");
const ability_factory_1 = require("../casl/ability.factory");
const role_permission_entity_1 = require("../users/roles/role-permission.entity");
const auth_service_1 = require("../auth/auth.service");
let DocumentService = class DocumentService {
    constructor(documentRepository, configService, abilityFactory, authService) {
        this.documentRepository = documentRepository;
        this.configService = configService;
        this.abilityFactory = abilityFactory;
        this.authService = authService;
    }
    async create(file, user) {
        const ability = this.abilityFactory.defineAbility(user);
        if (!ability.can(role_permission_entity_1.Action.WRITE, 'Document')) {
            throw new common_1.ForbiddenException('You do not have permission to create documents');
        }
        const newDocument = new document_entity_1.DocumentEntity();
        newDocument.uploadedAt = new Date();
        newDocument.originalName = file.originalname;
        newDocument.name = file.filename;
        newDocument.mimeType = file.mimetype;
        try {
            return await this.documentRepository.save(newDocument);
        }
        catch (error) {
            await (0, promises_1.rm)(file.path);
            throw error;
        }
    }
    async getUserFromRequest(userId) {
        const user = await this.authService.findOne(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async getDocumentById(id, user) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        const ability = this.abilityFactory.defineAbility(user);
        if (!ability.can(role_permission_entity_1.Action.READ, 'Document')) {
            throw new common_1.ForbiddenException('You do not have permission to view this document');
        }
        return document;
    }
    async retrieveDocument(id, user) {
        const document = await this.getDocumentById(id, user);
        const readStream = (0, fs_1.createReadStream)((0, path_1.join)(this.configService.get('upload.path'), document.name));
        return readStream;
    }
    async updateDocument(id, document, user) {
        const oldDocument = await this.getDocumentById(id, user);
        const ability = this.abilityFactory.defineAbility(user);
        if (!ability.can(role_permission_entity_1.Action.UPDATE, 'Document')) {
            throw new common_1.ForbiddenException('You do not have permission to update documents');
        }
        const documentToDelete = oldDocument.name;
        oldDocument.originalName = document.originalname;
        oldDocument.name = document.filename;
        oldDocument.mimeType = document.mimetype;
        try {
            await this.documentRepository.save(oldDocument);
            await (0, promises_1.rm)((0, path_1.join)(this.configService.get('upload.path'), documentToDelete));
        }
        catch (error) {
            await (0, promises_1.rm)(document.path);
            throw error;
        }
    }
    async deleteDocument(id, user) {
        const document = await this.getDocumentById(id, user);
        const ability = this.abilityFactory.defineAbility(user);
        if (!ability.can(role_permission_entity_1.Action.DELETE, 'Document')) {
            throw new common_1.ForbiddenException('You do not have permission to delete documents');
        }
        await (0, promises_1.rm)((0, path_1.join)(this.configService.get('upload.path'), document.name));
        await this.documentRepository.remove(document);
    }
    async getSizeOfDocument(path) {
        const stats = await (0, promises_1.stat)(path);
        const size = stats.size;
        return (0, file_1.convertBytes)(size);
    }
    async listDocuments(user) {
        const ability = this.abilityFactory.defineAbility(user);
        if (!ability.can(role_permission_entity_1.Action.READ, 'Document')) {
            throw new common_1.ForbiddenException('You do not have permission to list documents');
        }
        const documents = await this.documentRepository.find();
        return Promise.all(documents.map(async (document) => {
            const humanSize = await this.getSizeOfDocument((0, path_1.join)(this.configService.get('upload.path'), document.name));
            return {
                id: document.id,
                name: document.originalName,
                size: humanSize,
                uploadedAt: document.uploadedAt,
            };
        }));
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.DocumentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        ability_factory_1.AbilityFactory,
        auth_service_1.AuthService])
], DocumentService);
//# sourceMappingURL=document.service.js.map