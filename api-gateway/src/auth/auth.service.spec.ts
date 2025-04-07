import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DeleteResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/users.entity';
import { RoleEntity } from '../users/roles/roles.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(), // Add genSalt to the mock
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let usersRepository: Repository<UserEntity>;
  let rolesRepository: Repository<RoleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(), // Add the find method here
          },
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    rolesRepository = module.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const loginDto: LoginDto = {
        username: 'test@example.com',
        password: 'password',
      };
      const mockRole = { id: 1, name: 'admin' }; // Mock role entity
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'hashed-password',
        roleId: 1,
        role: mockRole, // Include the role property
      };
      const mockToken = 'jwt-token';

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as UserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.email,
        role: mockUser.roleId,
      });
      expect(result).toEqual({
        message: 'Successfully loggedin',
        access_token: mockToken,
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        username: 'test@example.com',
        password: 'wrong-password',
      };
      const mockRole = { id: 1, name: 'admin' }; // Mock role entity
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'hashed-password',
        roleId: 1,
        role: mockRole, // Include the role property
      };
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockUser as UserEntity);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        role: 'admin',
      };

      const mockRole = { id: 1, name: 'admin' };
      const mockUser = {
        id: 1,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: 'hashed-password',
        roleId: mockRole.id,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null); // Mock findByEmail to return null
      jest
        .spyOn(rolesRepository, 'findOne')
        .mockResolvedValue(mockRole as RoleEntity);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('mocked-salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      jest
        .spyOn(usersRepository, 'create')
        .mockReturnValue(mockUser as UserEntity);
      jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue(mockUser as UserEntity);

      const result = await service.create(createUserDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      ); // Assert findByEmail is called
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { name: createUserDto.role },
      });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        'mocked-salt',
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        password: 'hashed-password',
        roleId: mockRole.id,
      });
      expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        message: 'User created successfully',
        data: {
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        role: 'admin',
      };

      const mockExistingUser: Partial<UserEntity> = {
        id: 1,
        email: createUserDto.email,
      };

      // Mock `findByEmail` to return an existing user
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue(mockExistingUser as UserEntity);

      // Ensure `rolesRepository.findOne` is not called in this scenario
      const rolesRepositorySpy = jest.spyOn(rolesRepository, 'findOne');

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      // Verify that `rolesRepository.findOne` is not called
      expect(rolesRepositorySpy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if role is invalid', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        role: 'invalid-role',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('mocked-salt'); // Mock genSalt
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password'); // Mock hash

      await expect(service.create(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllUser', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          roleId: 1,
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          roleId: 2,
        },
      ];

      jest
        .spyOn(usersRepository, 'find')
        .mockResolvedValue(mockUsers as UserEntity[]);

      const result = await service.findAllUser();

      expect(usersRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
      };

      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(mockUser as UserEntity);

      const result = await service.findOne(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const mockUser: Partial<UserEntity> = { id: 1 };
      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(mockUser as UserEntity);
      jest.spyOn(usersRepository, 'delete').mockResolvedValue({
        affected: 1,
        raw: {}, // Mock the raw property as an empty object
      } as DeleteResult);

      const result = await service.remove(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(usersRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 }); // Expect only the affected property
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
      };

      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(mockUser as UserEntity);

      const result = await service.findById(1);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
