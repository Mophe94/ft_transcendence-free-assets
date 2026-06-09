import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'node_modules/@nestjs/jwt';

export class CustomIoAdapter extends IoAdapter {
  private readonly frontend_url: string;

  constructor(
    app: INestApplication,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super(app);
    this.frontend_url = configService.getOrThrow<string>('FRONT_END_URL');
  }

  
}
