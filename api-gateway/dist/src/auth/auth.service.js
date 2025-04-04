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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
const users_entity_1 = require("../users/users.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const roles_entity_1 = require("../users/roles/roles.entity");
let AuthService = class AuthService {
    jwtService;
    usersService;
    usersRepository;
    rolesRepository;
    constructor(jwtService, usersService, usersRepository, rolesRepository) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
    }
    async validateUser(username, password) {
        const user = await this.usersService.findByEmail(username);
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            return user;
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, username: user.email, role: user.roleId };
        const access_token = this.jwtService.sign(payload);
        return { message: 'Successfully loggedin', access_token };
    }
    async create(createUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const role = await this.rolesRepository.findOne({
            where: { name: createUserDto.role },
        });
        if (!role) {
            throw new common_1.NotFoundException('Invalid role ID');
        }
        const user = this.usersRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            passwordHash: hashedPassword,
            roleId: role.id,
        });
        const userDetails = await this.usersRepository.save(user);
        return {
            message: 'User created successfully',
            data: {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
            },
        };
    }
    async findAllUser() {
        const users = this.usersRepository.find();
        if (!users) {
            return [];
        }
        return users;
    }
    async findOne(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async remove(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userDeleted = await this.usersRepository.delete(id);
        return userDeleted;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(users_entity_1.UserEntity)),
    __param(3, (0, typeorm_2.InjectRepository)(roles_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        typeorm_1.Repository,
        typeorm_1.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map