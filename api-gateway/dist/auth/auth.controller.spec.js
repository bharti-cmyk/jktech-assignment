"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const roles_guard_1 = require("../../src/users/roles.guard");
const ability_factory_1 = require("../casl/ability.factory");
const jwt_1 = require("@nestjs/jwt");
const mockAuthService = {
    login: jest.fn().mockResolvedValue({ accessToken: 'test-token' }),
    create: jest.fn().mockResolvedValue({ id: 1, username: 'testUser' }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, username: 'testUser' }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testUser' }),
    remove: jest.fn().mockResolvedValue({ success: true }),
};
describe('AuthController', () => {
    let authController;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                { provide: auth_service_1.AuthService, useValue: mockAuthService },
                { provide: roles_guard_1.RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
                { provide: ability_factory_1.AbilityFactory, useValue: { createForUser: jest.fn() } },
                { provide: jwt_1.JwtService, useValue: {} },
            ],
        }).compile();
        authController = module.get(auth_controller_1.AuthController);
    });
    it('should be defined', () => {
        expect(authController).toBeDefined();
    });
    it('should login a user', async () => {
        const result = await authController.login({
            username: 'test',
            password: 'test',
        });
        expect(result).toEqual({ accessToken: 'test-token' });
    });
    it('should create a user', async () => {
        const result = await authController.create({
            username: 'testUser',
            password: 'testPass',
        });
        expect(result).toEqual({ id: 1, username: 'testUser' });
    });
    it('should find all users', async () => {
        const result = await authController.findAll();
        expect(result).toEqual([{ id: 1, username: 'testUser' }]);
    });
    it('should find one user', async () => {
        const result = await authController.findOne(1);
        expect(result).toEqual({ id: 1, username: 'testUser' });
    });
    it('should remove a user', async () => {
        const result = await authController.remove(1);
        expect(result).toEqual({ success: true });
    });
});
//# sourceMappingURL=auth.controller.spec.js.map