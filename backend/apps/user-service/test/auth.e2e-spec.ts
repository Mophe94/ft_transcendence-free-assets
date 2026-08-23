import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (E2E) - Validation Cookies', () => {
  let app: INestApplication;
  let authCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/signup - doit renvoyer l user et positionner le cookie access_token', async () => {
    const uniqueId = Date.now();

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test-${uniqueId}@example.com`,
        username: `test_user_${uniqueId}`, // ✅ Rendu unique avec le timestamp
        password: 'Password123!',
      })
      .expect(201);

    // 1. Vérifier la présence du header Set-Cookie
    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies).toBeDefined();

    // 2. Extraire le cookie access_token
    authCookie = cookies.find((c) => c.startsWith('access_token=')) || '';
    expect(authCookie).not.toBe('');
    expect(authCookie).toContain('HttpOnly'); // Sécurité du cookie

    // 3. Le corps ne doit contenir que l'user (pas le token brut)
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('token');
  });

  it('GET /auth/me - doit accepter la requête avec le cookie valide', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', [authCookie]) // Injection du cookie capturé
      .expect(200);

    expect(response.body).toHaveProperty('email');
  });

  it('GET /auth/me - doit rejeter (401) si aucun cookie n est fourni', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });
});
