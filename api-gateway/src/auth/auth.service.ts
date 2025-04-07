import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../users/roles/roles.entity';
import { RegisterDto } from './dto/register.dto';
import { UserData } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
  ) {}

  private async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.email, role: user.roleId };
    const access_token = this.jwtService.sign(payload);
    return { message: 'Successfully loggedin', access_token };
  }

  async create(createUserDto: CreateUserDto): Promise<RegisterDto> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Fetch role entity using roleId
    const role = await this.rolesRepository.findOne({
      where: { name: createUserDto.role },
    });
    if (!role) {
      throw new NotFoundException('Invalid role ID'); // Handle error properly (e.g., using AppError)
    }

    const user = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
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

  async findAllUser(): Promise<UserData[]> {
    const users = await this.usersRepository.find();

    if (!users || users.length === 0) {
      return [];
    }

    const userDetails = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
    }));

    return userDetails;
  }

  async findOne(id: number): Promise<UserData | null> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    const userDetails: UserData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
    };

    return userDetails;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async remove(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userDeleted = await this.usersRepository.delete(id);

    return { affected: userDeleted.affected };
  }
}
