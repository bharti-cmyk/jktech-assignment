import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/users.entity';
import { RoleEntity } from '../users/roles/roles.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<UserEntity>;
  let rolesRepository: Repository<RoleEntity>;
  let usersService: UsersService;
  let jwtService: JwtService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRoleRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    rolesRepository = module.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity),
    );
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
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
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        message: 'Successfully loggedin',
        access_token: 'mock-jwt-token',
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@user.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.passwordHash,
      );
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
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@user.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong-password',
        mockUser.passwordHash,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
        jest.setTimeout(10000); // Set timeout to 10 seconds
      
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
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
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
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService['validateUser'](username, password);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.passwordHash,
      );
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
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService['validateUser'](username, password),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.passwordHash,
      );
    });
  });
});
