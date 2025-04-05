import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/users.entity';
import { Repository } from 'typeorm';
import { RoleEntity } from '../users/roles/roles.entity';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private jwtService;
    private usersService;
    private usersRepository;
    private rolesRepository;
    constructor(jwtService: JwtService, usersService: UsersService, usersRepository: Repository<UserEntity>, rolesRepository: Repository<RoleEntity>);
    private validateUser;
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<RegisterDto>;
    findAllUser(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    remove(id: number): Promise<any>;
}
