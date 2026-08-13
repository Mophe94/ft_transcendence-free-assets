import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/users.entity';
import {
  FortyTwoCoal,
  FortyTwoProfile,
  FortyTwoTokenResponse,
} from './types/fortytwo-profile.interface';
import { ConfigService } from '@nestjs/config';
import { getSecret } from 'libs/shared/src/utils/secret.utils';
import axios from 'axios';
import { CoalitionEnum } from './types/coalition.enum';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ user: UserResponseDto; token: string }> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.usersService.createUser({
      email: createUserDto.email,
      passwordHash: hashedPassword,
      username: createUserDto.username,
    });

    const token = this.generateJwt(user);
    const sanitizedUser = new UserResponseDto({
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      coalitionId: user.coalitionId,
      settings: user.settings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return { user: sanitizedUser, token };
  }

  generateJwt(user: User): string {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.userRoles,
      avatarUrl: user.avatarUrl,
      skin: user.settings.skin,
    };

    return this.jwtService.sign(payload);
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findOneByEmail(email, true);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateJwt(user);
    console.log(token);

    return { user, token };
  }

  async handleFortyTwoAuth(code: string) {
    const accessToken = await this.exchangeCodeForToken(code);
    const profile = await this.getFortyTwoProfile(accessToken);
    const coal = await this.getFortyTwoCoal(accessToken, profile.id);

    const user = await this.usersService.findUserByFortyTwoId(profile.id);

    if (user) {
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.userRoles,
        avatarUrl: user.avatarUrl,
      };
      console.log(payload);
      const token = await this.jwtService.signAsync(payload);
      return { token, user };
    }

    const userProfile = {
      email: profile.email,
      username: profile.login,
      avatarUrl: profile.image?.link,
      coalitionId: coal?.id,
      fortyTwoId: profile.id,
    };

    const newUser = await this.usersService.createFortyTwoUser(userProfile);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.userRoles,
      avatarUrl: newUser.avatarUrl,
    };
    const token = await this.jwtService.signAsync(payload);
    return { token, newUser };
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const redirect_uri = this.configService.get<string>(
      'FORTYTWO_REDIRECT_URI',
    );
    const tokenExchangeUrl = this.configService.get<string>(
      'FORTYTWO_API_TOKENEXCHANGE',
    );
    const client_id = getSecret('fortytwo_client_id');
    const client_secret = getSecret('fortytwo_client_secret');

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

  async getFortyTwoProfile(accessToken: string): Promise<FortyTwoProfile> {
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
  async getFortyTwoCoal(
    accessToken: string,
    userId: number,
  ): Promise<FortyTwoCoal | undefined> {
    try {
      const response = await axios.get<Array<FortyTwoCoal>>(
        `${
          this.configService.get<string>('FORTYTWO_API_GETCOAL') ??
          'https://api.intra.42.fr/v2'
        }/users/${userId}/coalitions`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const coalitions = response.data;
      const current_coal = coalitions.find((coal) =>
        (Object.values(CoalitionEnum) as number[]).includes(coal.id),
      );
      return current_coal;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        "Couldn't fetch users coalitions.",
      );
    }
  }
}
