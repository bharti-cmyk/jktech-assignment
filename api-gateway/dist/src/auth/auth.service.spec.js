"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../users/users.entity");
const roles_entity_1 = require("../users/roles/roles.entity");
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
describe('AuthService', () => {
    let authService;
    let usersRepository;
    let rolesRepository;
    let usersService;
    let jwtService;
    const mockUserRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    };
    const mockRoleRepository = {
        findOne: jest.fn(),
    };
    const mockUsersService = {
        findByEmail: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(users_entity_1.UserEntity),
                    useValue: mockUserRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(roles_entity_1.RoleEntity),
                    useValue: mockRoleRepository,
                },
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        usersRepository = module.get((0, typeorm_1.getRepositoryToken)(users_entity_1.UserEntity));
        rolesRepository = module.get((0, typeorm_1.getRepositoryToken)(roles_entity_1.RoleEntity));
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('login', () => {
        it('should return a JWT token when valid credentials are provided', async () => {
            const loginDto = { username: 'test@user.com', password: 'password' };
            const mockUser = {
                id: 1,
                role: 'admin',
                passwordHash: await bcrypt.hash('password', 10),
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue('mock-jwt-token');
            const result = await authService.login(loginDto);
            expect(result).toEqual({
                message: 'Successfully loggedin',
                access_token: 'mock-jwt-token',
            });
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@user.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.passwordHash);
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: mockUser.id,
                role: mockUser.role,
            });
        });
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto = {
                username: 'test@user.com',
                password: 'wrong-password',
            };
            const mockUser = {
                id: 1,
                role: 'admin',
                passwordHash: await bcrypt.hash('password', 10),
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await expect(authService.login(loginDto)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@user.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', mockUser.passwordHash);
        });
    });
    describe('create', () => {
        it('should create a new user', async () => {
            jest.setTimeout(10000);
            const createUserDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password',
                role: 'admin',
            };
            const mockRole = { id: 1, name: 'admin' };
            const mockUser = {
                id: 1,
                ...createUserDto,
                passwordHash: 'hashed-password',
            };
            mockRoleRepository.findOne.mockResolvedValue(mockRole);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
            mockUserRepository.create.mockReturnValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);
            const result = await authService.create(createUserDto);
            expect(result).toEqual(mockUser);
            expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
                where: { name: 'admin' },
            });
            expect(bcrypt.hash).toHaveBeenCalledWith('password', expect.any(String));
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                email: createUserDto.email,
                passwordHash: 'hashed-password',
                roleId: mockRole.id,
            });
            expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });
    describe('validateUser', () => {
        it('should return the user if valid credentials are provided', async () => {
            const username = 'test@user.com';
            const password = 'password';
            const mockUser = {
                id: 1,
                role: 'admin',
                passwordHash: await bcrypt.hash(password, 10),
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const result = await authService['validateUser'](username, password);
            expect(result).toEqual(mockUser);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(username);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
        });
        it('should throw UnauthorizedException for invalid credentials', async () => {
            const username = 'test@user.com';
            const password = 'wrong-password';
            const mockUser = {
                id: 1,
                role: 'admin',
                passwordHash: await bcrypt.hash('password', 10),
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await expect(authService['validateUser'](username, password)).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(username);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.passwordHash);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map