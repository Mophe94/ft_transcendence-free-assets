import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtHttpGuard, JwtPayload } from './jwt-http.guard';

describe('JwtHttpGuard', () => {
  let guard: JwtHttpGuard;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtHttpGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtHttpGuard>(JwtHttpGuard);
    jwtService = module.get(JwtService);
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const request = {
      headers: {
        authorization: authHeader,
      },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it('devrait autoriser l’accès avec un JWT valide', async () => {
    const mockPayload: JwtPayload = { sub: '123', email: 'test@example.com' };
    jwtService.verifyAsync.mockResolvedValue(mockPayload);

    const context = createMockContext('Bearer token_valide');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token_valide');
  });

  it('devrait lever une exception si le header Authorization est absent', async () => {
    const context = createMockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('devrait lever une exception si le token est invalide', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const context = createMockContext('Bearer token_invalide');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});