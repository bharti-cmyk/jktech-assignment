import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from '../users/roles.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/users/users.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            create: jest.fn(),
            findAllUser: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call login and return a token', async () => {
      const loginDto: LoginDto = {
        username: 'test@example.com',
        password: 'password',
      };
      const mockToken = {
        message: 'User Loggedin successfully',
        access_token: 'jwt-token',
      };

      jest.spyOn(service, 'login').mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockToken);
    });
  });

  describe('create', () => {
    it('should call create and return a success message', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        role: 'admin',
      };
      const mockResponse = {
        message: 'User created successfully',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockResponse);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAllUser', () => {
    it('should call findAllUser and return a list of users', async () => {
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
          firstName: 'Jane Doe',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          roleId: 2,
        },
      ];

      jest.spyOn(service, 'findAllUser').mockResolvedValue(mockUsers);

      const result = await controller.findAllUser();

      expect(service.findAllUser).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOneUser', () => {
    it('should call findOne and return a user', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as UserEntity);

      const result = await controller.findOneUser(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOneUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should call remove and return success message', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ affected: 1 });

      const result = await controller.deleteUser(1);

      console.log('Result from deleteUser:', result); // Debugging
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should propagate NotFoundException from the service', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      await expect(controller.deleteUser(1)).rejects.toThrow(NotFoundException);
    });
  });
});
