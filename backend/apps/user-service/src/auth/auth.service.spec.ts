import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Mock du UsersService
  const mockUsersService = {
    createUser: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  // Mock du JwtService
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(authService).toBeDefined();
  });

  describe('createUser', () => {
    it('devrait hacher le mot de passe, créer l utilisateur et signer un JWT', async () => {
      const createUserDto = {
        email: 'john@example.com',
        username: 'john_doe',
        password: 'securePassword123',
      };

      const mockCreatedUser = {
        id: 'uuid-1234',
        email: createUserDto.email,
        username: createUserDto.username,
        passwordHash: 'hashed_password',
      };

      // Configuration des retours de mocks
      mockUsersService.createUser.mockResolvedValue(mockCreatedUser);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed_password');

      // Exécution
      const result = await authService.createUser(createUserDto);

      // Vérifications
      expect(bcrypt.hash).toHaveBeenCalledWith('securePassword123', 10);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        email: createUserDto.email,
        username: createUserDto.username,
        passwordHash: 'hashed_password',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 'uuid-1234',
        email: createUserDto.email,
      });
      expect(result).toEqual({
        user: mockCreatedUser,
        token: 'mocked_jwt_token',
      });
    });
  });
});
