import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { JwtWsGuard, AuthenticatedSocket } from './jwt-ws.guard';
import { JwtPayload } from './jwt-http.guard';

describe('JwtWsGuard', () => {
  let guard: JwtWsGuard;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtWsGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtWsGuard>(JwtWsGuard);
    jwtService = module.get(JwtService);
  });

  const createMockWsContext = (url?: string, authHeader?: string): ExecutionContext => {
    const mockRequest = Object.assign(new IncomingMessage({} as any), {
      url: url ?? '/ws',
      headers: {
        authorization: authHeader,
      },
    });

    const mockClient = {
      upgradeReq: mockRequest,
    } as AuthenticatedSocket;

    return {
      switchToWs: () => ({
        getClient: () => mockClient,
        getData: () => ({ req: mockRequest }),
      }),
    } as unknown as ExecutionContext;
  };

  it('devrait valider un token passé dans la query URL (ex: ?token=XYZ)', async () => {
    const mockPayload: JwtPayload = { sub: '123' };
    jwtService.verifyAsync.mockResolvedValue(mockPayload);

    const context = createMockWsContext('/ws?token=mon_token_query');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('mon_token_query');
  });

  it('devrait valider un token passé dans le header Authorization', async () => {
    const mockPayload: JwtPayload = { sub: '123' };
    jwtService.verifyAsync.mockResolvedValue(mockPayload);

    const context = createMockWsContext('/ws', 'Bearer token_header');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('token_header');
  });

  it('devrait lever une WsException si aucun token n’est présent', async () => {
    const context = createMockWsContext('/ws');

    await expect(guard.canActivate(context)).rejects.toThrow(WsException);
  });
});