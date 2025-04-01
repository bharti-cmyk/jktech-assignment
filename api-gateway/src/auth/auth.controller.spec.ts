import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from '../users/roles.guard';
import { AbilityFactory } from '../casl/ability.factory';
import { JwtService } from '@nestjs/jwt';

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ accessToken: 'test-token' }),
  create: jest.fn().mockResolvedValue({ id: 1, username: 'testUser' }),
  findAll: jest.fn().mockResolvedValue([{ id: 1, username: 'testUser' }]),
  findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testUser' }),
  remove: jest.fn().mockResolvedValue({ success: true }),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: AbilityFactory, useValue: { createForUser: jest.fn() } },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
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
