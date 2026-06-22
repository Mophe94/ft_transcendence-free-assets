import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UsersService } from 'apps/account-service/src/users/users.service';
import {
  FortyTwoProfile,
  FortyTwoTokenResponse,
} from './types/fortytwo-profile.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'node_modules/@types/express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async handleFortyTwoAuth(code: string) {
    const accessToken = await this.exchangeCodeForToken(code);
    const profile = await this.getFortyTwoProfile(accessToken);

    let user = await this.usersService.findOneByFortyTwoId(profile.id);
    if (!user) {
      user = await this.usersService.create({
        fortyTwoId: profile.id,
        username: profile.login,
        email: profile.email,
        avatarUrl: profile.image?.link ?? '',
      });
    }
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }

  private async exchangeCodeForToken(code: string): Promise<string> {
    const redirect_uri = this.configService.get<string>(
      'FORTYTWO_REDIRECT_URI',
    );
    const client_id = this.configService.get<string>('FORTYTWO_CLIENT_ID');
    const client_secret = this.configService.get<string>(
      'FORTYTWO_CLIENT_SECRET',
    );
    const tokenExchangeUrl = this.configService.get<string>(
      'FORTYTWO_API_TOKENEXCHANGE',
    );
    try {
      const tokenResponse = await axios.post<FortyTwoTokenResponse>(

        tokenExchangeUrl ?? 'https://api.intra.42.fr/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id,
          client_secret,
          code,
          redirect_uri,
        },
      );
      return tokenResponse.data.access_token;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Failed to authenticate.');
    }
  }

  private async getFortyTwoProfile(
    accessToken: string,
  ): Promise<FortyTwoProfile> {
    try {
      const response = await axios.get<FortyTwoProfile>(
        this.configService.get<string>('FORTYTWO_API_GETUSER') ??
          'https://api.intra.42.fr/v2/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Couldn't fetch users profile.");
    }
  }
}
